CREATE DATABASE IF NOT EXISTS storedb;

USE storedb;

CREATE TABLE categories (
    _id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id)
);

CREATE TABLE products (
    _id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    discountPercentage INT NOT NULL DEFAULT 0,
    rating DECIMAL(2,1) NOT NULL DEFAULT 0,
    stock INT NOT NULL,
    category INT NOT NULL,
    thumbnail JSON NOT NULL DEFAULT (JSON_OBJECT('url', 'https://res.cloudinary.com/dzgiu2txq/image/upload/v1677945017/picture/no-image_abom6f.jpg', 'public_id', '')),
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id),
    FOREIGN KEY (category) REFERENCES categories(_id)
);

INSERT INTO products VALUES
  (1, 'IPhone 9', 'An apple mobile which is nothing like apple', 549, DEFAULT, DEFAULT, 94, 'IPhone', DEFAULT, DEFAULT),
  (2, 'IPhone X', 'SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED tech…', 899, DEFAULT, DEFAULT, 34, 'Skincare', DEFAULT, DEFAULT);

CREATE TABLE users (
    _id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL UNIQUE,
    isAdmin BOOLEAN NOT NULL DEFAULT false,
    avatar JSON NOT NULL DEFAULT (JSON_OBJECT('url', 'https://res.cloudinary.com/dzgiu2txq/image/upload/v1665616153/avatar/blank_profile_picture_hf0cjj.png', 'public_id', '')),
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id)
);


