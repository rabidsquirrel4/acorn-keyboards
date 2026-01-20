/**
 * Name: Rachel Shi
 * CS 132 Spring 2023
 * Date: June 10th, 2023
 * 
 * The script file that populates a product page for a particular product that
 * was selected by the user on another page.
 * For CP4, the user can get reviews by clicking a button and then reviews for 
 * the product will appear on the page.
 *   Inspired by CS 132 Web Development Lecture 15, 16 and 17 slides.
 */
(function() {
    "use strict";
  
    /** 
     * Init function that populates the new products section and adds an event
     * listener to change the placeholder text for the search bar. Also adds
     * an event listener to refresh the dog images.
    */
    function init() {
      id("get-reviews").addEventListener("click", getReviews);
    }
  
    /**
     * Gets reviews data from review API.
     */
    async function getReviews() {
      let prodName = "odin75"
      let url = "product/" + prodName + "/reviews"
      try {
        let resp = await fetch(url);
        resp = checkStatus(resp);
        const data = await resp.json();
        addReviews(data);
      } catch (err) {
        handleReviewError(err);
      }
    }
  
    /**
     * Adds reviews to page given json of reviews on a particular product to add.
     * @param {array} data - array of data obtained from the reviews API
     */
    function addReviews(data) {
      id("customer-reviews").innerHTML = "";
      let numReviews = data.length;
      for (let i = 0; i < numReviews; i++) {
        let reviewData = data[i];
        let review = gen("article");
        // generate and add rating text
        let rating_text = gen("p"); 
        rating_text.textContent = "Rating: " + reviewData["rating"] + "/5 stars";
        rating_text.classList.add("rating");
        review.appendChild(rating_text);
        // generate title for review
        let title = gen("h3"); 
        title.textContent = reviewData["title"]; 
        review.appendChild(title);
        // generate date
        let date = gen("p"); 
        date.textContent = reviewData["date"];
        date.classList.add("date");
        review.appendChild(date);
        // generate and add paragraphs of review text content.
        let review_text = gen("p");
        review_text.textContent = reviewData["text"];
        review_text.classList.add("review-text");
        review.appendChild(review_text);
        // generate author and add
        let author = gen("p"); 
        author.textContent = "- " + reviewData["author"];
        author.classList.add("author");
        review.appendChild(author);
        
        id("customer-reviews").appendChild(review);
      }
    }
  
    /**
     * Called when there is an error with fetching data from the review API.
     * @param {Error} err - the error details of the request
     */
    function handleReviewError(err) {
      let response = gen("p");
      let msg = "There was an error requesting reviews. Sorry about that!";
      response.textContent = msg;
      id("customer-reviews").appendChild(response);
    }
  
    init();
  
  })();