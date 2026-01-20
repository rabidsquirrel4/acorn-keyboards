/**
 * Name: Rachel Shi
 * CS 132 Spring 2023
 * Date: June 10th, 2023
 * 
 * The script file that runs the products API service.
 *    Inspired by CS 132 Web Development Lecture 15, 16, 17, and 18 slides.
 * I found this explanation of path vs. query parameters for RESTful APIs on StackOverflow helpful:
 *    https://stackoverflow.com/questions/30967822/when-do-i-use-path-params-vs-query-params-in-a-restful-api
 * 
 */
"use strict";
const express = require("express");
const app = express();
const mysql = require("promise-mysql");
const multer = require("multer");

// To handle different POST formats:
// application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// application/json
app.use(express.json()); // has built in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none());

app.use(express.static("public"));

const DEBUG = false;
const CLIENT_ERROR_CODE = 400;
const SERVER_ERROR_CODE = 500;
const SERVER_ERROR = "Sorry, there was an error with our servers. " + 
                     "Please try again later.";

// GET endpoints:

// Endpoint that returns all products
// Endpoint that gets some products based on a filter
app.get("/products/", validateQueryParameter, async (req, res, next) => {
  let db;
  let qry;
  const category = req.query["search"];
  try {
    db = await getDB();
    if (!category || category === "all") {
      qry = "SELECT * FROM products";
    } else {
      qry = "SELECT * FROM products WHERE category LIKE \"" + category + "\"";
    }
    let rows = await db.query(qry);
    let products = getProductsArr(rows);
    // Optional query parameter to get json or text response
    res.json(products);
  } catch (err) {
    res.status(SERVER_ERROR_CODE);
    err.message = SERVER_ERROR;
    if (db) {
      db.end();
    }
    next(err);
  }
  if (db) {
    db.end();
  }
});

// Endpoint that returns all product names
app.get("/product_names", validateTypeParameter, async (req, res, next) => {
  let db;
  try {
    db = await getDB();
    let qry = "SELECT product_name FROM products";
    let rows = await db.query(qry);
    let productNames = getProductNamesArr(rows);
    if ((req.query["type"]) == "text") {
      res.send(productNames.join(", "));
    } else {
      res.send(productNames);
    }
  } catch (err) {
    res.status(SERVER_ERROR_CODE);
    err.message = SERVER_ERROR;
    if (db) {
      db.end();
    }
    next(err);
  }
  if (db) {
    db.end();
  }
});

// Endpoint that gets information about one particular product
app.get("/product/:id", checkId, async (req, res, next) => {
  let db;
  let id = req.params.id;
  try {
    db = await getDB();
    let qry = "SELECT * FROM products WHERE pid = " + id + ";";
    let row = await db.query(qry);
    let products = getProductsArr(row);
    // Optional query parameter to get json or text response
    res.json(products[0]);
  } catch (err) {
    res.status(SERVER_ERROR_CODE);
    err.message = SERVER_ERROR;
    if (db) {
      db.end();
    }  
    next(err);
  }
  if (db) {
    db.end();
  }
});

// Endpoint that gets reviews for a particular product


// POST endpoints:

// Endpoint that enters message and contact info into the database
app.post("/contact", async (req, res, next) => {
  let db;
  let name = req.body.name;
  let email = req.body.email;
  let msg = req.body.msg;
  try {
    db = await getDB();
    await db.query(
      "INSERT INTO messages(name, email, msg_text) VALUES ('" +
      name + "', '" + email + "', '" + msg + "');" 
      );
    res.type("text");
    res.send("success!");
  } catch (err) {
    if (db) {
      db.end();
    }
    res.status(SERVER_ERROR_CODE);
    err.message = SERVER_ERROR;
    next(err);
  }
  if (db) {
    db.end();
  }
});

// Endpoint to signup as a user account (becoming a loyal customer) 
app.post("/new-user", async (req, res, next) => {
  let db;
  let username = req.body.username;
  let password = req.body.password;
  let first = req.body.firstname;
  let last = req.body.lastname;
  let email = req.body.email;
  let phone = "";
  let has_phone = "";
  if (req.body.phone) {
    phone = ", '" + req.body.phone + "'";
    has_phone = ", phone";
  }
  try {
    db = await getDB();
    await db.query(
      "CALL sp_add_user('" + username + "', '" + password + "', '" + 
      first + "', '" + last + "', '" + email + "');" 
      );
    res.type("text");
    res.send("success!");
  } catch (err) {
    res.status(SERVER_ERROR_CODE);
    err.message = SERVER_ERROR;
    next(err);
  }
  if (db) {
    db.end();
  }
});

// Endpoint that checks login information


// HELPER FUNCTIONS:
/**
 * Checks if Product ID is an integer and ID parameter exists.
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {function} next express next callback function 
 */
function checkId(req, res, next) {
  let id = req.params.id;
  try {
    id = parseInt(id);
    next();
  } catch (err) {
    res.status(CLIENT_ERROR_CODE);
    err.message = "Bad Query Parameter: required query parameter 'id'" +
      " must a number."; 
    next(err);
  }
  // if (id && Number.isInteger(id)) {
  //   next();
  // } else {
  //   res.status(CLIENT_ERROR_CODE);
  //   let err = new Error();
  //   err.message = "Bad Query Parameter: required query parameter 'id'" +
  //     " must an integer."; 
  //   next(err);
  // }
}

/**
 * Checks if optional category parameter is one that is supported by the API.
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {function} next express next callback function
 */
function validateQueryParameter(req, res, next) {
  // Optional query parameter to get 
  const qry = req.query["search"];
  if (!qry || qry === "all" || qry === "full" || qry === "90percent" || 
      qry === "80percent" || qry === "75percent" || qry === "65percent" || 
      qry === "60percent" || qry === "40percent" || qry === "kits" || 
      qry === "keycaps" || qry === "keychains") {
    next();
  } else {
    res.status(CLIENT_ERROR_CODE);
    let err = new Error();
    err.message = "Bad Query Parameter: optional query parameter " +
      "must be one listed in the API documentation."; 
    next(err);
  }
}

/**
 * Checks if the optional type parameter is text or json for output type.
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {function} next express next callback function
 */
function validateTypeParameter(req, res, next) {
  // Optional query parameter to get json or text response
  const respType = req.query["type"];
  if (respType && respType.toLowerCase() === "text") {
    res.type("text");
  } else if (!respType || respType.toLowerCase() === "json") {
    res.type("json");
  } else {
    res.status(CLIENT_ERROR_CODE);
    let err = new Error();
    err.message = "Bad Query Parameter: optional query parameter" +
      " 'type' must be either 'text' or 'json'"; 
    next(err);
  }
  next();
}

/**
 * Gets an array of product names from a RowDataPacket of product names
 * @param {RowDataPacket} rows A RowDataPacket object 
 * @returns {array} Array of product names:
 */
function getProductNamesArr(rows) {
  let productNames = [];
  for (let i = 0; i < rows.length; i++) {
    productNames.push(rows[i].product_name);
  }
  return productNames;
}

/**
 * Gets an array of product dictionary objects from a RowDataPacket of product 
 * names. 
 * The dictionaries (one for each product) include the following keys and 
 * information:
 *    - name : The name of the product as a string
 *    - img_path : The local path of the product as a string
 *    - price : The price of the product as a float
 * @param {RowDataPacket} rows A RowDataPacket object 
 * @returns {array} Array of product names
 */
function getProductsArr(rows) {
  let products = [];
  for (let i = 0; i < rows.length; i++) {
    products.push({
      id : rows[i].pid,
      name : rows[i].product_name,
      img_path : rows[i].product_img_path,
      img_alt : rows[i].product_img_alt,
      price : parseFloat(rows[i].price),
      category : rows[i].category,
      description : rows[i].description
    });
  }
  return products;
}

/**
 * Gets a database object to be used with queries.
 * @returns {object} SQL database object
 */
async function getDB() {
  const db = await mysql.createConnection({
    host: "localhost",
    port: "3306", 
    user: "appadmin", 
    password: "adminpw", // change to root password
    database: "productsdb"
  });
  return db;
}

/**
 * Generic error handler to be called when an error must be signaled.
 * @param {error object} err The error that occured, contains the error message 
 * that should be set before the function is called
 * @param {request object} req the request object
 * @param {response object} res the response object
 * @param {next function} next the next function to be called if there is one
 */
function errorHandler(err, req, res, next) {
  if (DEBUG) {
    console.log(err);
  }
  res.type("text");
  res.send(err.message);
}

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});