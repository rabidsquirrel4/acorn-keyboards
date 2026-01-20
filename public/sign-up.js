/**
 * Name: Rachel Shi
 * CS 132 Spring 2023
 * Date: June 16th, 2023
 * 
 * The script file that controls sending a message to contact the website devs.
 * Sources:
 *   Inspired by CS 132 Web Development Homework2 Part A
 *   Inspired by Caltech CS 132 Web Development skittles example by Professor 
 *      El Hovik
 *   https://eipsum.github.io/cs132/lectures/lec09-js-animations/code/skittles-v3/skittles-v3-starter.js
 *   Inspired by Caltech CS 132 Web Development encrypt-it example by Professor
 *      El Hovik
 */
(function() {
  "use strict";

  /** 
   * Init function that initializes event listener for login attempt button.
  */
  function init(){
    qs("#sign-up-btn").addEventListener("click", addUser);
  }

  /**
   * Called when user clicks the submit form button.
   * @param {object} evt the event that called the function, used to prevent default
   * refresh of page after form is submitted
   */
  async function addUser(evt) {
    let username = qs("#username").value;
    let password = qs("#password").value;
    let firstname = qs("#firstname").value;
    let lastname = qs("#lastname").value;
    let email = qs("#email").value;
    let phone = "";
    evt.preventDefault();
    // referred to skittles-v3-starter.js of skittles example
    if (!username) {
      qs("#results").textContent = "Please enter a valid username.";
    } else if (!password) {
      qs("#results").textContent = "Please enter an valid password.";
    } else if (!firstname) {
      qs("#results").textContent = "Please enter your first name.";
    } else if (!lastname) {
      qs("#results").textContent = "Please enter your last name.";
    } else if (!email) {
      qs("#results").textContent = "Please enter an email.";
    } else {
      if (!phone) {
        phone = "";
      }
      
      let params = new FormData(id("sign-up-form"));
      params.append("phone", "");
      try {
        let resp = await fetch("/new-user", {method : "POST", body: params});
        resp = checkStatus(resp);
        const data = await resp.text();
        id("results").textContent = "Sucessfully Signed Up!";
      } catch (err) {
        err.message = "Unsuccessful sign up. Please try again later.";
        handleRequestError(err);
      }
    }
  }
  
  /**
   * Called when there is an error with fetching data from the Dog or Products 
   * APIs and prints a message to the user instead of populating the new 
   * products section with dog cards.
   * @param {Error} err - the error details of the request
   */
  function handleRequestError(err) {
    id("results").innerHTML = "";
    let response = gen("p");
    response.textContent = err.message;
    id("results").appendChild(response);
  }

  init();

})();