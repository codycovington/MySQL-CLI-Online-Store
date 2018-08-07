var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("ENTERING SUPERVISOR VIEW");
  supervisorListing();
});


function supervisorListing() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Choose from the options below",
        choices: ["View Products Sales By Department", "Create New Department", "Exit Program"],
        name: "choice"
      }
    ])
    .then(function(inquirerResponse) {
   
        switch (inquirerResponse.choice) {

            case "View Products Sales By Department":
              viewSales();
              break;
          
            case "Create New Department":
              createDepartment();
              break;
            
            case "Exit Program":
            connection.end();
            }          
    });
}

function createDepartment() {
    console.log("Add a NEW DEPARTMENT")
    inquirer
    .prompt([
      {
        type: "input",
        message: "What is the department name? \n",
        name: "department_name"
      },
      {
        type: "input",
        message: "What are the overhead costs of the department \n",
        name: "over_head_costs"
      }
    ])
    .then(function(inquirerResponse) {
        console.log(inquirerResponse.department_name);
        console.log(inquirerResponse.over_head_costs);
   
            var query = connection.query(
            "INSERT INTO departments(department_name, over_head_costs) VALUES (" + JSON.stringify(inquirerResponse.department_name) + "," + parseInt(inquirerResponse.over_head_costs) + ")",
            function(err, res) {
              console.log("Department added to database!");
              supervisorListing();
            });      
    });
} 

function viewSales() {

    connection.query("select departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales FROM departments, products  WHERE departments.department_name = products.department_name GROUP BY department_id;", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
          console.log("\nDepartment_ID: " + res[i].department_id + " |" + res[i].department_name + "|  Overhead Costs: $" + res[i].over_head_costs + " | Sales: $" + res[i].product_sales);
        }
        supervisorListing();
      });
    
}