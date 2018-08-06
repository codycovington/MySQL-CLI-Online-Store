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
  console.log("Welcome to BAMAZOM.COM!!!!!!!!");
  showProducts();
});

function showProducts() {
  connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log("\nItem_ID: " + res[i].item_id + " |" + res[i].product_name + "|  Price: $" + res[i].price + "\n");
    }
  });
  greetCustomer();
}

function greetCustomer() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the Item_ID of the product you wish to buy? \n",
        name: "item_id"
      },
      {
        type: "input",
        message: "How MANY would you like to purchase?\n",
        name: "quantity"
      }
    ])
    .then(function(inquirerResponse) {
   
      var query = connection.query(
        "SELECT item_id, stock_quantity, price FROM products WHERE ?",
        {
          item_id: inquirerResponse.item_id      
        },
        function(err, res) {
          //console.log(inquirerResponse.quantity);
          //console.log(res[0].stock_quantity);;
         if (inquirerResponse.quantity > res[0].stock_quantity) {
            console.log("INSUFFICIENT STOCK AVAILABLE, PLEASE TRY AGAIN")
            greetCustomer();
          } else {
            placeOrder(inquirerResponse.quantity, inquirerResponse.item_id, res[0].stock_quantity, res[0].price);
          }
        }  
      );
    });
}


  function placeOrder(quantityPurchased, item_id, quantityAvailable, price) {  
    var stockChange = quantityAvailable - quantityPurchased;
    var totalPurchasePrice = quantityPurchased * price;  
    var query = connection.query(
    "UPDATE products SET stock_quantity ="+ stockChange + " WHERE item_id =" + item_id,
  function(err, res) {
    console.log("Your transaction is successful for a grand total of: $" + totalPurchasePrice + "\nStock now updated" + "\nThank you for Shopping BAMAZOM.com!!");
      }  
    );
    connection.end();
  }

