/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	'use strict';

	var clearInput = function clearInput() {
	  $('.input').val('');
	};

	var handleResponse = function handleResponse(response) {
	  return response.json().then(function (json) {
	    if (!response.ok) {
	      var error = {
	        status: response.status,
	        statusText: response.statusText,
	        json: json
	      };
	      return Promise.reject(error);
	    }
	    return json;
	  });
	};

	var errorLog = function errorLog(error) {
	  console.error({ error: error });
	};

	// GET FOODS
	var getAllFoods = function getAllFoods() {
	  $('#food-list').html('');
	  fetch('https://limitless-everglades-18138.herokuapp.com/api/v1/foods').then(handleResponse).then(getFood).catch(errorLog);
	};

	var getFood = function getFood(foods) {
	  return foods.forEach(function (food) {
	    $("#food-list").append('\n    <article class="food-info">\n    <p class="name" contenteditable="false" id="name-' + food.id + '"=>' + food.name + '</p>\n    <p class="calories" contenteditable="false" id="calories-' + food.id + '"=>' + food.calories + '</p>\n    <p id="' + food.id + '" class="updateFood-btn"><i class="fa fa-pencil fa-lg"></i></p>\n    <p id="' + food.id + '" class="deleteFood-btn"><i class="fa fa-trash fa-lg"></i></p>\n    <label class="box">\n      <input type="checkbox" class="' + food.name + '"id="' + food.id + '">\n        <span class="checkmark"></span>\n    </label>\n    ');
	  });
	};

	// POST FOOD
	var postFood = function postFood() {
	  var newFoodName = $('#newfoodName').val();
	  var newFoodCalories = $('#newfoodCalories').val();
	  var newFoodInfo = { name: newFoodName, calories: newFoodCalories };

	  fetch('https://limitless-everglades-18138.herokuapp.com/api/v1/foods', postPayload(newFoodInfo)).then(handleResponse).then(getAllFoods).then(clearInput).catch(errorLog);
	};

	var postPayload = function postPayload(body) {
	  return {
	    method: 'POST',
	    headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify(body)
	  };
	};

	$("#add-food-btn").on("click", postFood);

	// PATCH FOOD
	$("#food-list").on('click', '.updateFood-btn', function (event) {
	  var foodId = event.currentTarget.id;
	  var nameField = document.getElementById('name-' + foodId);
	  var caloriesField = document.getElementById('calories-' + foodId);
	  var buttonText = document.getElementById('' + foodId).innerHTML;

	  if (buttonText != "Save") {
	    document.getElementById('' + foodId).innerHTML = "Save";
	    nameField.contentEditable = "true";
	    caloriesField.contentEditable = "true";
	  } else {
	    document.getElementById('' + foodId).innerHTML = '<i class="fa fa-pencil" />';
	    nameField.contentEditable = "false";
	    caloriesField.contentEditable = "false";

	    var updatedName = nameField.innerText;
	    var updatedCals = caloriesField.innerText;
	    patchFood(foodId, updatedName, updatedCals);
	    clearInput();
	  }
	});

	var patchFood = function patchFood(foodId, updatedName, updatedCals) {
	  var body = { name: updatedName, calories: updatedCals };

	  fetch('https://limitless-everglades-18138.herokuapp.com/api/v1/foods/' + foodId, patchPayload(body)).then(function (response) {
	    return handleResponse(response);
	  }).catch(function (error) {
	    return console.error({ error: error });
	  });
	};

	var patchPayload = function patchPayload(body) {
	  return {
	    method: 'PATCH',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify(body)
	  };
	};

	// DELETE FOOD
	$("#food-list").on('click', '.deleteFood-btn', function (event) {
	  var foodId = event.currentTarget.id;

	  fetch('https://limitless-everglades-18138.herokuapp.com/api/v1/foods/' + foodId, { method: "DELETE" }).then(getAllFoods).then(clearInput).catch(errorLog);
	});

	// SEARCH FOOD
	$('#search').keyup(function () {
	  var letters = $('#search').val().toLowerCase();
	  $('.food-info').each(function () {
	    var string = this.innerText.substring(0, 10).toLowerCase();
	    if (string.indexOf(letters) > -1) {
	      $(this).show();
	    } else {
	      $(this).hide();
	    }
	  });
	});

	// GET MEALS
	var getAllMealsForButtons = function getAllMealsForButtons() {
	  $('#meal-buttons').html('');
	  fetch('https://limitless-everglades-18138.herokuapp.com/api/v1/meals').then(handleResponse).then(appendMealToButton).catch(errorLog);
	};

	var appendMealToButton = function appendMealToButton(meals) {
	  return meals.forEach(function (meal) {
	    $("#meal-buttons").append('\n    <div id="meal">\n    <input type="submit" class="meal-name-btn" id=' + meal.id + ' value=' + meal.name + '>\n    </div>\n    ');
	  });
	};

	$("#meal-buttons").on('click', '.meal-name-btn', function (event) {
	  var mealId = event.currentTarget.id;
	  var foodId = function foodId() {
	    return this.id;
	  };
	  var foodsChecked = $(":checkbox:checked").map(foodId).get();

	  if (foodsChecked.length > 0) {
	    postFoodsToMeal(foodsChecked, mealId);
	    window.open("diary.html");
	  } else {
	    alert("You must select a food first.");
	  }
	});

	// POST FOOD TO MEAL
	var postFoodsToMeal = function postFoodsToMeal(foodsChecked, mealId) {
	  var length = foodsChecked.length;
	  for (var i = 0; i < length; i++) {
	    var foodId = foodsChecked[i];
	    fetch('https://limitless-everglades-18138.herokuapp.com/api/v1/meals/' + mealId + '/foods/' + foodId, postMealFoodPayload(mealId, foodId)).then(handleResponse).catch(errorLog);
	  }
	};

	var postMealFoodPayload = function postMealFoodPayload(foodId, mealId) {
	  return {
	    method: 'POST',
	    headers: {
	      'Content-Type': 'application/json',
	      'Accept': 'application/json'
	    },
	    body: JSON.stringify({
	      food_id: foodId,
	      meal_id: mealId
	    })
	  };
	};

	// GET MEALS WITH FOODS
	var getDiaryMeals = function getDiaryMeals() {
	  $('.meal-data').html('');
	  fetch('https://limitless-everglades-18138.herokuapp.com/api/v1/meals').then(handleResponse).then(getMealInfo).catch(errorLog);
	};

	var getMealInfo = function getMealInfo(meals) {
	  return meals.forEach(function (meal) {
	    $('.meal-data').append('\n      <section class="meal-summary">\n        <p class="meal-title">' + meal.name + '</p>\n        <p>Total Calories:</p>\n        <div class="meal-columns"></div>\n      </section> \n    ');
	    populateFoodsPerMeal(meal);
	  });
	};

	var populateFoodsPerMeal = function populateFoodsPerMeal(meal) {
	  return meal.foods.forEach(function (food) {
	    $(".meal-columns").append('\n      <article class="food-info">\n        <h3 class="name">' + food.name.substring(0, 8) + '</h3>\n        <h3 id="calories">' + food.calories + '</h3>\n        <p id="' + food.id + '" class="deleteFood-btn"><i class="fa fa-trash fa-lg"></i></p>\n      </article>\n    ');
	  });
	};

	// DELETE FOOD FROM MEAL ONLY
	$('.meal-data').on('click', '.deleteFood-btn', function (event) {
	  var foodId = event.currentTarget.id;
	  var mealId = event.target.id;
	  fetch('https://limitless-everglades-18138.herokuapp.com/api/v1/meals/' + mealId + '/foods/' + foodId, { method: "DELETE" }).then(getDiaryMeals).catch(errorLog);
	});

	getAllFoods();
	getAllMealsForButtons();
	getDiaryMeals();

	// GET RECIPES
	$("#interactive-list").on('click', '.recipe-btn', function (event) {
	  var foodName = function foodName() {
	    return this.className;
	  };
	  var foodsChecked = $(":checkbox:checked").map(foodName).get();

	  if (foodsChecked.length > 0) {
	    fetchRecipes(foodsChecked);
	  }
	});

	var recipeView = function recipeView() {
	  $('#food-list').hide();
	  $('#recipes-button').hide();
	  $("#back-button").show();
	  document.getElementById('instruction').innerHTML = "Click the recipe's image to view details";
	};

	var fetchRecipes = function fetchRecipes(foodsChecked) {
	  recipeView();
	  var YUMMLY_API_KEY = config.YUMMLY_API_KEY;
	  var YUMMLY_APP_ID = config.YUMMLY_APP_ID;

	  var formatChecked = foodsChecked.join("+");
	  fetch('http://api.yummly.com/v1/api/recipes?_app_id=' + YUMMLY_APP_ID + '&_app_key=' + YUMMLY_API_KEY + '&requirePictures=true&q=' + formatChecked + '&maxResult=5').then(handleResponse).then(populateRecipes).catch(errorLog);
	};

	var populateRecipes = function populateRecipes(recipes) {
	  return recipes.matches.forEach(function (recipe) {
	    $(".recipe-data").append('\n      <section class="recipe-summary">\n        <h5 class="recipe-title">' + recipe.recipeName + '</h5>\n        <a href="https://www.yummly.com/recipe/' + recipe.id + '">\n          <img href src="' + recipe.imageUrlsBySize["90"] + '">\n        </a>\n        <h5 class="recipe-rating"> Rating: ' + recipe.rating + '</h5>\n      </section> \n    ');
	  });
	};

	$("#back-button").hide();

	$('#back-button').click(function () {
	  location.reload();
	});

/***/ })
/******/ ]);