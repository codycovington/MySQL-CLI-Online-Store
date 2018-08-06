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
  console.log("ENTERING MANAGER VIEW");
  managerListing();
});


function managerListing() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Choose from the options below",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Products", "Exit Program"],
        name: "choice"
      }
    ])
    .then(function(inquirerResponse) {
   
        switch (inquirerResponse.choice) {

            case "View Products for Sale":
              showProducts();
              break;
          
            case "View Low Inventory":
              lowProducts();
              break;
          
            case "Add to Inventory":
              addInventory();
              break;
          
            case "Add New Products":
              newProducts();
              break;
            
            case "Exit Program":
            connection.end();
            }          
    });
}

function showProducts() {
    
    connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        console.log("\nItem_ID: " + res[i].item_id + " |" + res[i].product_name + "|  Price: $" + res[i].price + "\n");
      }
      managerListing();
    });
    
  }

function lowProducts() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5",
    function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
          console.log("\n");
          console.log("\nItem_ID: " + res[i].item_id + " |" + res[i].product_name + "|  Price: $" + res[i].price + "\n" + "Stock Left: " + res[i].stock_quantity);
        }
        managerListing();
      });     
}

function addInventory() {
    inquirer
    .prompt([
      {
        type: "input",
        message: "What is the Item_ID of the product you wish to add inventory to? \n",
        name: "item_id"
      },
      {
        type: "input",
        message: "How MANY would you like to ADD to the inventory?\n",
        name: "quantity"
      }
    ])
    .then(function(inquirerResponse) {

        function checkCurrentQuantity() {
   
            var query = connection.query(
            "SELECT stock_quantity FROM products WHERE item_id =" + inquirerResponse.item_id,
            function(err, res) {
              var currentStock = parseInt(res[0].stock_quantity);
              //console.log(currentStock);
              addingToInventory(currentStock);
          });
        }

        function addingToInventory(currentStock) {
            var quantityNow = parseInt(currentStock) + parseInt(inquirerResponse.quantity);
            var query = connection.query(
            "UPDATE products SET stock_quantity =" + quantityNow + " WHERE item_id =" + inquirerResponse.item_id,
            function(err, res) {
          console.log("Stock successfully updated!");
          managerListing();
                }  
            );
        }
    checkCurrentQuantity();
    });  
}

function newProducts() {
    console.log("Add a NEW PRODUCT to DATABASE")
    inquirer
    .prompt([
      {
        type: "input",
        message: "What is the product name? \n",
        name: "product_name"
      },
      {
        type: "input",
        message: "Which Department does the product belong to? \n",
        name: "department_name"
      },
      {
        type: "input",
        message: "What is the PRICE of the product?\n",
        name: "price"
      },
      {
        type: "input",
        message: "What is the quantity?\n",
        name: "quantity"
      }
    ])
    .then(function(inquirerResponse) {
        console.log(inquirerResponse.product_name);
        console.log(inquirerResponse.price);
        console.log(inquirerResponse.quantity);
   
            var query = connection.query(
            "INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES (" + JSON.stringify(inquirerResponse.product_name) + "," + JSON.stringify(inquirerResponse.department_name) + "," + parseFloat(inquirerResponse.price) + "," + parseInt(inquirerResponse.quantity) + ")",
            function(err, res) {
              console.log("Product added to database!");
              managerListing();
            });      
    });
} 

        