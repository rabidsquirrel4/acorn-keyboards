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
    qs("#contact-btn").addEventListener("click", sendMessage);
  }

  /**
   * Called when user clicks the submit form button.
   * @param {object} evt the event that called the function, used to prevent default
   * refresh of page after form is submitted
   */
  async function sendMessage(evt) {
    let name = qs("#name").value;
    let email = qs("#email").value;
    let msg = qs("#message").value;
    evt.preventDefault();
    // referred to skittles-v3-starter.js of skittles example
    if (!name) {
      qs("#results").textContent = "Please enter a Name.";
    } else if (!email) {
      qs("#results").textContent = "Please enter an email.";
    } else if (!msg) {
      qs("#results").textContent = "Message cannot be blank.";
    } else {
      let params = new FormData(id("contact-form"));
      try {
        let resp = await fetch("/contact", {method : "POST", body: params});
        resp = checkStatus(resp);
        const data = await resp.text();
        qs("#results").textContent = "Contact Form Sucessfully Submitted!";
      } catch (err) {
        err.message = "Contact Form submission unsuccessful. Please try again later.";
        handleRequestError(err);
      }
    }
  }
  
  /**
   * Called when there is an error with fetching dog data from the Dog API and 
   * prints a message to the user instead of populating the new products section
   * with dog cards.
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