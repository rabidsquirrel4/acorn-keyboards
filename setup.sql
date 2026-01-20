/* Inspired by:
    setup-oh.sql example from CS132 Web Development class at Caltech
 */
CREATE DATABASE IF NOT EXISTS productsdb;
USE productsdb;

-- Sets up SQL files for 
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;


CREATE TABLE users(
    -- User ID
    uid INT AUTO_INCREMENT,
    username VARCHAR(20) UNIQUE NOT NULL,
    -- The salt will always be 8 characters, taken from CS121 Final Project 
    -- codebase
    salt CHAR(8) NOT NULL,
    -- We are using SHA-2 with 256-bit hashes.
    -- MySQL returns the hash
    -- value as a hexadecimal string, which means that each byte is
    -- represented as 2 characters.  Thus, 256 / 8 * 2 = 64.
    -- We can use BINARY or CHAR here; BINARY simply has a different
    -- definition for comparison/sorting than CHAR.
    -- taken from CS121 Final Project codebase
    password_hash BINARY(64) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL DEFAULT '',
    email VARCHAR(30) NOT NULL,
    phone NUMERIC(7, 0),
    PRIMARY KEY(uid)
);

CREATE TABLE products(
    -- Product ID
    pid INT AUTO_INCREMENT,
    -- unique for now, but may want to change to be non-unique later,
    -- so we have decided not to use this as a primary key
    product_name VARCHAR(80) UNIQUE NOT NULL,
    product_img_path VARCHAR(250) NOT NULL,
    product_img_alt VARCHAR(250) NOT NULL,
    -- my hope is that a keyboard never costs more than 6 figures
    price NUMERIC(8, 2) NOT NULL,
    category VARCHAR(20),
    description TEXT NOT NULL,
    PRIMARY KEY(pid)
);

CREATE TABLE reviews(
    -- Review ID
    rid INT AUTO_INCREMENT,
    -- Identifies the product for which the review is for
    pid INT NOT NULL, 
    rating INT DEFAULT 5,
    -- NOT NULL for now, but will be changed to allow reviews with only a rating
    title VARCHAR(30) NOT NULL,
    post_date DATE DEFAULT (DATE(NOW())),
    -- NOT NULL for now, but will be changed to allow null later for reviews
    -- with only a rating and/or title
    review_text TEXT NOT NULL,
    -- could be null, review should show up under anonymous in this case
    uid INT,
    -- ideally this would be a tuple primary key (pid, rid)
    PRIMARY KEY (rid),
    FOREIGN KEY (pid) REFERENCES products(pid)
        ON DELETE CASCADE,
    FOREIGN KEY (uid) REFERENCES users(uid)
        ON DELETE CASCADE
);

CREATE TABLE messages(
    msg_id INT AUTO_INCREMENT,
    -- The name of the person who submitted the message
    name VARCHAR(60) NOT NULL,
    email VARCHAR(80) NOT NULL,
    msg_text TEXT NOT NULL,
    msg_timestamp TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (msg_id)
);