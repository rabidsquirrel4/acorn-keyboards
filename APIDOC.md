Link to postman documentation:
https://documenter.getpostman.com/view/27928178/2s93sgVVb1

# Keyboard Products API Documentation
*Fill in a short description here about the API's purpose
(specific to the API, not a front-end client).
Can list any shared behavior for all endpoints, such as 500
error-handling.*

## GET /products
**Request Type:** GET

**Returned Data Format:** JSON (default) or Plain Text (given query parameter "type" set to "text")

**Description:** Gets either a JSON array of the names of all products in the API, or a string of plain text
with all product names comma separated.

**Supported Parameters** 
* type (optional)
  * The type of response that the endpoint will return,
  must be either 'text' or 'json'.

**Example Request:** 
Returns JSON:
http://localhost:8000/products/
http://localhost:8000/products/?type=json
http://localhost:8000/products/?type=JSON
Returns Plain Text:
http://localhost:8000/products/?type=text
http://localhost:8000/products/?type=TexT

**Example Response:**
*Fill in example response in the ticks*
JSON:
```json
{
  ["odin75","tofu65"]
}
```
Plain Text:
```
odin75, tofu65
```

**Error Handling:**
If an invalid query parameter is passed in as 'type',
there will be a status code 400 error with the following error message:

"Bad Query Parameter: optional query parameter 'type' must be either 'text' or 'json'"

If there is a server error, a status code 500 error 
response will be sent with the plain text error message:

Sorry, there was an error with our servers. Please try again later.
