/**
 * Name: Rachel Shi
 * CS 132 Spring 2023
 * Date: May 6th, 2023
 * 
 * The script file that controls logging in and checking if login information
 * is correct on the Acorn keyboards website.
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
    qs("#login-btn").addEventListener("click", attemptLogin);
  }

  /**
   * Called when user clicks the login button and processes login form 
   * information.
   * @param {object} evt the event that called the function, used to prevent default
   * refresh of page after form is submitted
   */
  function attemptLogin(evt) {
    let username = qs("#username").value;
    evt.preventDefault();
    // referred to skittles-v3-starter.js of skittles example
    if (!qs("#username").value) {
      qs("#results").textContent = "Please enter a username.";
    } else if (!qs("#password").value) {
      qs("#results").textContent = "Please enter a password.";
    } else if (checkUsername(username)) {
      qs("#login-form").classList.add("hidden");
      qs("#results").textContent = "Welcome " + username + "!";
    } else {
      let invalid_username_msg = "Please enter a valid username. \n" + 
        "Valid usernames must be between 5-30 characters and only contain " +
        "either captial or lowercase letters from a to z.";
      qs("#results").textContent = invalid_username_msg;
    }
  }

  /**
   * Checks whether the given username is a valid username. Valid usernames are
   * 5-30 characters in length and only contain lowercase and capital letters
   * (a-z and A-Z).
   * @param {string} username 
   * @returns boolean, true if the username is valid, false if it isn't valid
   */
  function checkUsername(username) {
    let is_valid = true;
    if (username.length < 5) {
     is_valid = false;
    } else if (username.length > 30) {
     is_valid = false;
    }
    for (let i = 0; i < username.length; i++) {
      let c = username[i];
      // referred to in review session demo of encrypt-it example
      if (!((c >= 'a' && c < 'z') || (c >= 'A' && c < 'Z'))) {
        is_valid = false;
      }
    }
    return is_valid;
  }

  init();

})();