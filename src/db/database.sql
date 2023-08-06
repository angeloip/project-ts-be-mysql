CREATE DATABASE IF NOT EXISTS storedb;

USE storedb;

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    discountPercentage INT NOT NULL DEFAULT 0,
    rating DECIMAL(2,1) NOT NULL DEFAULT 0,
    stock INT NOT NULL,
    category VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

INSERT INTO products VALUES
  (1, 'IPhone 9', 'An apple mobile which is nothing like apple', 549, DEFAULT, DEFAULT, 94, 'IPhone', DEFAULT, DEFAULT),
  (2, 'IPhone X', 'SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED tech…', 899, DEFAULT, DEFAULT, 34, 'Skincare', DEFAULT, DEFAULT);