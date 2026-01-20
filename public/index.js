/**
 * Name: Rachel Shi
 * CS 132 Spring 2023
 * Date: May 20th, 2023
 * 
 * The script file that controls dropdowns and populates the new products section for 
 * the Acorn keyboards website.
 *   Inspired by CS 132 Web Development Homework2 Part A
 *   Inspired by Caltech CS 132 Web Development skittles version 3 with timers 
 *      example by Professor El Hovik
 *   https://eipsum.github.io/cs132/lectures/lec09-js-animations/code/skittles-v3/skittles-v3-starter.js
 *   Inspired by Caltech CS 132 Web Development encrypt-it example by Professor
 *      El Hovik
 *   Inspired by Caltech CS 132 Web Development apod example by Professor 
 *      El Hovik
 */
(function() {
  "use strict";
  /*
  Sample JSON response:
  {
    "message":["https:\/\/images.dog.ceo\/breeds\/whippet\/n02091134_12537.jpg",
    "https:\/\/images.dog.ceo\/breeds\/whippet\/n02091134_14465.jpg",
    "https:\/\/images.dog.ceo\/breeds\/whippet\/n02091134_17788.jpg",
    "https:\/\/images.dog.ceo\/breeds\/whippet\/n02091134_4002.jpg",
    "https:\/\/images.dog.ceo\/breeds\/whippet\/n02091134_9433.jpg"],
    "status":"success"
  }
  */
  const DOG_BASE_URL = "https://dog.ceo/api/breed/whippet/images/random/";
  const PRODUCTS_BASE_URL = "products";
  // Referenced code from MDN Web Docs:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Text_formatting
  const usdPrice = new Intl.NumberFormat("en-US", {
    style: "currency", 
    currency: "USD",
    minimumFractionDigits: 2,
  });
  /** 
   * Init function that populates the new products section and adds an event
   * listener to change the placeholder text for the search bar. Also adds
   * an event listener to refresh the dog images.
   */
  function init() {
    id("product-type").addEventListener("change", changeSearchPlaceholder);
    id("product-type").addEventListener("change", fetchSelectedProducts);
    fetchDogs();
    fetchAllProducts();
  }

  /**
   * Uses fetch to get dog images from the Dog API (https://dog.ceo/dog-api/) and
   * handles any errors from requesting images.
   */
  function fetchDogs() {
    id("new-products").innerHTML = "";
    let url = DOG_BASE_URL + "5";
    fetch(url)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(populateNewProducts)
      .catch(handleRequestError);
  }

  async function fetchAllProducts() {
    id("all-products").innerHTML = "";
    try {
      let resp = await fetch(PRODUCTS_BASE_URL);
      resp = checkStatus(resp);
      const data = await resp.json();
      if (data.length === 0) {
        fetchDogs();
      } else {
        populateProducts(data, "all-products");
      }
    } catch (err) {
      err.message = "There was an error getting product information. " + 
        "Please try again later!";
      handleRequestError(err);
    }
    
  }

  async function fetchSelectedProducts(evt) {
    id("new-products-section").querySelector("h2").textContent = "Our Latest Selection of " + evt.target.value;
    id("new-products").innerHTML = "";
    let category = getCategory(evt.target.value);
    try {
      let resp = await fetch(PRODUCTS_BASE_URL + "/?search=" + category);
      resp = checkStatus(resp);
      const data = await resp.json();
      if (data.length === 0) {
        fetchDogs();
      } else {
        populateProducts(data, "new-products");
      }
    } catch (err) {
      err.message = "There was an error getting product information. " + 
        "Please try again later!";
      handleRequestError(err);
    }
    
  }

  function getCategory(value) {
    if (value == "Full Keyboards") {
      return "full";
    } else if (value == "90% Keyboards") {
      return "90percent";
    } else if (value == "80% Keyboards") {
      return "80percent";
    } else if (value == "65% Keyboards") {
      return "65percent";
    } else if (value == "60% Keyboards") {
      return "60percent";
    } else if (value == "Kits" || value == "Keychains" || value == "All") {
      return value.toLowerCase();
    }
  }

  /**
   * Changes the placeholder text in the search bar to show selected search 
   * type.
   * @param {object} evt the change event for the product type that triggered the function to be 
   * called.
   */
  function changeSearchPlaceholder(evt) {
    // referred to MDN example code
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event
    qs("#search").placeholder = `Search ${evt.target.value}`;
  }

  /**
   * Populates the new products section with 5 cards with 5 different images of whippet dogs.
   * @param {Json object} dogJson the json object retrieved from the response from the Dog API.
   */
  function populateNewProducts(dogJson) {
    let imgUrls = dogJson.message;
    for (let i = 0; i < imgUrls.length; i++) {
      let card = generateDogCard(imgUrls[i]);
      id("new-products").appendChild(card);
    } 
  }

  /**
   * Populates the new products section with 5 cards with 5 different images of whippet dogs.
   * @param {JSON object} products the json object retrieved from the response from the Dog API.
   */
  function populateProducts(products, sectionId) {
    for (let i = 0; i < products.length; i++) {
      let card = generateProductCard(products[i]);
      id(sectionId).appendChild(card);
    } 
  }

  /**
   * Generates a new card object with Out of stock text and the given image of a whippet dog
   * to be placed in the new products section.
   * @param {string} imgUrl The url to the image of a whippet dog.
   * @returns {object} A card object to be placed in the new products section.
   */
  function generateDogCard(imgUrl) {
    // Code referenced: apod-lec13-starter
    let card = gen("article");
    let title = gen("h3");
    title.textContent = "Out Of Stock";
    let image = gen("img");
    image.src = imgUrl;
    image.alt = "Randomly generated photo of a Whippet Dog";
    let description = gen("p");
    description.textContent = "It looks like we are short on inventory right now. " + 
      "Please check back later! Here is a photo of a dog instead.";
    card.appendChild(title);
    card.appendChild(image);
    card.appendChild(description);
    return card;
  }

  /**
   * Generates a new card object for a product with the name as the title text 
   * and the given image of the product as well as the price of the product.
   * @param {object} productInfo The dictionary holding the information about 
   * the product.
   * @returns {object} A card element object to be placed on the page.
   */
  function generateProductCard(productInfo) {
    // Code referenced: apod-lec13-starter
    let card = gen("article");
    let title = gen("h3");
    title.textContent = productInfo["name"];
    let image = gen("img");
    image.src = productInfo["img_path"];
    image.alt = productInfo["img_alt"];
    let price = gen("p");
    // referred to MDN example code
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event
    price.textContent = "Price: " + usdPrice.format(productInfo["price"]);
    card.appendChild(title);
    card.appendChild(image);
    card.appendChild(price);
    card.id = productInfo["id"];
    card.addEventListener("dblclick", goToProductPage);
    return card;
  }

  async function goToProductPage() {
    let id = (this.id);
    try {
      let resp = await fetch("product/" + id);
      resp = checkStatus(resp);
      const data = await resp.json();
      populateProductView(data);
      toggleView();
    } catch (err) {
      err.message = "There was an error getting product information. " + 
        "Please try again later!";
      handleRequestError(err);
    }
  }

  /** A helper function to change between the menu view and single product view. */
  function toggleView() {
    // implementation idea from CS132 HW2 
    id("main-view").classList.toggle("hidden");
    id("product-view").classList.toggle("hidden");
  }

  function populateProductView(productInfo) {
    id("product-info").innerHTML = "";
    let info = gen("div");
    let title = gen("h1");
    title.textContent = productInfo["name"];
    let image = gen("img");
    image.src = productInfo["img_path"];
    image.alt = productInfo["img_alt"];
    let description = gen("p");
    description.textContent = "Description: \n" + productInfo["description"];
    info.appendChild(title);
    info.appendChild(image);
    info.appendChild(description);
    info.id = productInfo["id"];
    id("product-info").appendChild(info);
    let aside = gen("aside");
    let asideTitle = gen("h4");
    asideTitle.textContent = productInfo["name"];
    let price = gen("p");
    // referred to MDN example code
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event
    price.textContent = "Price: " + usdPrice.format(productInfo["price"]);
    let addToCart = gen("button");
    addToCart.textContent = "Add to Cart";
    addToCart.id = "add-to-cart";
    aside.appendChild(asideTitle);
    aside.appendChild(price);
    aside.appendChild(addToCart);
    id("product-info").appendChild(aside);
  }

  /**
   * Called when there is an error with fetching dog data from the Dog API and 
   * prints a message to the user instead of populating the new products section
   * with dog cards.
   * @param {Error} err - the error details of the request
   */
  function handleRequestError(err) {
    let response = gen("p");
    let msg = "There was an error requesting dog images. Sorry about that!";
    response.textContent = err.message;
    id("new-products").appendChild(response);
  }

  init();

})();