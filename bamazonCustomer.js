let mysql = require('mysql');
const cTable = require('console.table');
let inquirer = require('inquirer');

let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root', 
    password: 'W1ldcat3.',
    database: 'bamazon'
});

connection.connect(function(err){
    if(err) throw err;
    else{
        console.log(connection.threadId);
        displayProducts();
    }
});

function displayProducts(){
    console.log("==== Current Inventory ====");
    var query = "SELECT item_id, product_name, price FROM products";
    connection.query(query, function(err, res){
        console.table(res);
    });
}