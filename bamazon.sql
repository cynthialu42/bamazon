DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50),
    price DECIMAL(10, 2),
    stock_quantity INT,
    product_sales DECIMAL(10,2) DEFAULT 0,
    PRIMARY KEY(item_id)
);

CREATE TABLE departments (
	department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50),
    over_head_costs INT DEFAULT 100
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 	("Teddy Bear", "Toys", 15.50, 100), 
		("Basketball", "Sports", 20.00, 50),
        ("Eyeshadow", "Beauty", 45.50, 10),
        ("Sweater", "Clothes", 20.00, 20),
        ("Leggings", "Clothes", 5.00, 15),
        ("Ramen", "Food", .25, 200),
        ("Tennis Ball", "Sports", 10.00, 100),
        ("Lipstick", "Beauty", 36.00, 30),
        ("Blush", "Beauty", 15.00, 100),
        ("Puzzle", "Toys", 10.00, 100);
        
SELECT * FROM products