let mysql = require('mysql');
const cTable = require('console.table');
let inquirer = require('inquirer');

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
        //console.log(connection.threadId);
        displayOptions();
    }
});

function displayOptions(){
    inquirer.prompt([
        {
            type: 'rawlist',
            message: 'Select an option',
            choices: ['View Product Sales by Department','Create a New Department', 'Quit'],
            name: 'option'
        }
    ]).then(function(answer){
        if(answer.option === "View Product Sales by Department"){
            viewProductSales();
        }
        else if(answer.option === "Create a New Department"){
            createDepartment();
        }
        else{
            console.log("Bye!");
            connection.end();
        }
    });
}

function viewProductSales(){
    let query = "SELECT department_id, departments.department_name, over_head_costs, SUM(product_sales) as product_sales, SUM(product_sales) - over_head_costs as total_profit FROM products, departments WHERE products.department_name = departments.department_name GROUP BY department_id;";
        connection.query(query, function(err, res){
            if(err) {
                console.log(err);
            }
            console.log('\n');
            console.table(res);
            console.log('\n');

            displayOptions();
        });
}

function createDepartment(){
    inquirer.prompt([
        {
            type:'input',
            message: 'What is the name of the new department?',
            name: 'name'
        }, 
        {
            type:'input',
            message: 'What is the overhead cost on this department?',
            name: 'overhead'
        }
    ]).then(function(answer){
        let name = answer.name;
        let overhead = parseInt(answer.overhead);
        //console.log(name + overhead)
        let query = "INSERT INTO departments SET ?";
        let newDep = 
            {
                department_name: name,
                over_head_costs: overhead
            };
        connection.query(query, newDep, function(err, res){
            showDepartmentTable();
        });
    });
}

function showDepartmentTable(){
    let query = "SELECT * FROM departments";
    connection.query(query, function(err, res){
        console.log("New Department Successfully Added");
        console.table(res);
        displayOptions();
    });
}