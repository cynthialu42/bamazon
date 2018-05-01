/*
Create a new Node application called bamazonManager.js. Running this application will:


List a set of menu options:
View Products for Sale
View Low Inventory
Add to Inventory
Add New Product
If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
*/

let mysql = require('mysql');
let inquirer = require('inquirer');
const cTable = require('console.table');

let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon'
});

connection.connect(function(err){
    if(err) throw err;
    else{
        console.log(connection.threadId);
        promptManager();
    }
});

function promptManager(){
    inquirer.prompt({
        type: 'rawlist',
        name: 'prompt',
        message: 'Select an option',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product','Quit']
    }).then(function(answers){
        let selection = answers.prompt;
        console.log(selection);
        if(selection === 'Quit'){
            quitProgram();
        }
        else if(selection === 'View Products for Sale'){
            viewProducts();
        }
        else if(selection === 'View Low Inventory'){
            viewLowInventory();
        }
        else if(selection === 'Add to Inventory'){
            addToInventory();
        }
        else{
            addNewProduct();
        }
    });
}

function quitProgram(){
    console.log("Ok bye!");
    connection.end();
}

function viewProducts(){
    console.log("\n===== Current Inventory ====\n");
    let query = "SELECT item_id as ID, product_name as NAME, price as PRICE, stock_quantity as QUANTITY FROM products";
    connection.query(query, function(err, res){
        console.table(res);
        promptManager();
    });
}

function viewLowInventory(){
    console.log("\n===== Low Inventory ====\n");
    let query = "SELECT item_id as ID, product_name as NAME, price as PRICE, stock_quantity as QUANTITYy FROM products WHERE stock_quantity < 5";
    connection.query(query, function(err, res){
        console.table(res);
        promptManager();
    })
}

function addToInventory(){
    let query = "SELECT item_id, product_name, price, stock_quantity FROM products";
    connection.query(query, function(err, res){
        console.table(res);
        //console.log(res[1]);
        inquirer.prompt([
            {
                type: 'input',
                message: 'Which item ID would you like to restock?',
                name: 'item'
            },
            {
                type: 'input',
                message: 'How many would you like to stock?',
                name: 'quantity'
            }
        ]).then(function(answer){
            let query = "UPDATE products SET ? WHERE ?";
            let quantityUpdate = parseInt(res[answer.item -1].stock_quantity) + parseInt(answer.quantity);
            var itemName = res[answer.item-1].product_name;
            let updates = [
                {
                    stock_quantity: quantityUpdate
                },
                {
                    item_id: answer.item
                }
            ];
    
            connection.query(query, updates, function(err, res){
                if(err) throw err;
                else console.log(`Added ${answer.quantity} ${itemName}(s) to inventory`);
                viewProducts();
            });
        });
    });
}

function addNewProduct(){
    inquirer.prompt([
        {
            type: 'input',
            message: 'What the the item name?',
            name: 'name'
        },
        {
            type: 'input',
            message: 'What department does the item belong to?',
            name: 'department'
        },
        {
            type: 'input',
            message: "What is it's price?",
            name: 'price'
        },
        {
            type: 'input',
            message: 'How many are you stocking?',
            name: 'quantity'
        }
    ]).then(function(answer){
        let query = "INSERT INTO products SET ?";
        let newProduct = {
            product_name: answer.name,
            department_name: answer.department,
            price: answer.price,
            stock_quantity: answer.quantity
        };
        connection.query(query, newProduct, function(err, res){
            viewProducts();
        });
    });
}
