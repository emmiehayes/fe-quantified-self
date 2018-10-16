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

	// -------------------------------------------------------------------- HELPER FUNCTIONS
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

	// -------------------------------------------------------------------- FOOD.HTML PAGE 

	// GET 
	var getAllFoods = function getAllFoods() {
	  $('#food-list').html('');
	  fetch('https://fast-meadow-36413.herokuapp.com/api/v1/foods').then(handleResponse).then(getFood).catch(errorLog);
	};

	var getFood = function getFood(foods) {
	  return foods.forEach(function (food) {
	    $('#food-list').append('\n    <article id="food-info">\n    <p class="name" contenteditable="false" id="name-' + food.id + '"=>' + food.name + '</p>\n    <p class="calories" contenteditable="false" id="calories-' + food.id + '"=>' + food.calories + '</p>\n    <div class="tooltip">\n      <button type="button" class="updateFood-btn" id="' + food.id + '">Edit</button>\n      <span class="tooltip-update">Click edit, click on field, make changes, click save.</span>\n    </div>\n    <div class="tooltip">\n      <button type="button" class="deleteFood-btn" id="' + food.id + '">Delete</button>\n      <span class="tooltip-delete">Food can only be deleted if it is not linked to a meal. Visit the meal page to remove from meals.</span>\n    </div>\n    ');
	  });
	};

	// POST 
	var postFood = function postFood() {
	  var newFoodName = $('#newfoodName').val();
	  var newFoodCalories = $('#newfoodCalories').val();
	  var body = { food: { name: newFoodName, calories: newFoodCalories } };

	  fetch('https://fast-meadow-36413.herokuapp.com/api/v1/foods', postPayload(body)).then(handleResponse).then(getAllFoods).then(clearInput).catch(errorLog);
	};

	var postPayload = function postPayload(body) {
	  return {
	    method: 'POST',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify(body)
	  };
	};

	// PATCH 
	$("#food-list").on('click', '.updateFood-btn', function (event) {
	  var foodId = event.currentTarget.id;
	  var nameField = document.getElementById('name-' + foodId);
	  var caloriesField = document.getElementById('calories-' + foodId);
	  var buttonText = document.getElementById('' + foodId).innerHTML;

	  if (buttonText == "Edit") {
	    document.getElementById('' + foodId).innerHTML = "Save";
	    nameField.contentEditable = "true";
	    caloriesField.contentEditable = "true";
	  } else if (buttonText == "Save") {
	    document.getElementById('' + foodId).innerHTML = "Edit";
	    nameField.contentEditable = "false";
	    caloriesField.contentEditable = "false";

	    var updatedName = nameField.innerText;
	    var updatedCals = caloriesField.innerText;
	    patchFood(foodId, updatedName, updatedCals);
	  }
	});

	var patchFood = function patchFood(foodId, updatedName, updatedCals) {
	  var body = { food: { name: updatedName, calories: updatedCals } };

	  fetch('https://fast-meadow-36413.herokuapp.com//api/v1/foods/' + foodId + '/', patchPayload(body)).then(function (response) {
	    return handleResponse(response);
	  }).catch(function (error) {
	    return console.error({ error: error });
	  });
	};

	var patchPayload = function patchPayload(body) {
	  return {
	    method: 'PUT',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify(body)
	  };
	};

	// DELETE 
	$("#food-info").on('click', '.deleteFood-btn', function (event) {
	  debugger;
	  var foodId = event.currentTarget.id;

	  fetch('https://fast-meadow-36413.herokuapp.com//api/v1/foods/' + foodId + '/', { method: "DELETE" }).then(handleResponse).catch(errorLog);
	});

	// SEARCH
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

	// EVENTS
	getAllFoods();
	$('#add-food-btn').on('click', postFood);

	// -------------------------------------------------------------------- MEAL.HTML PAGE 

	// GET
	var getAllFoodsCheck = function getAllFoodsCheck() {
	  $('#allFoods').html('');
	  fetch('https://fast-meadow-36413.herokuapp.com/api/v1/foods').then(handleResponse).then(appendFoodToList).catch(errorLog);
	};

	var appendFoodToList = function appendFoodToList(foods) {
	  return foods.forEach(function (food) {
	    $('#food-list-for-meals').append('\n      <div class="food-info">\n      <p class="name">' + food.name + '</p>\n      <p class="calories">' + food.calories + '</p>\n      <input type="checkbox" class="food-chk" id="' + food.id + '">\n    ');
	  });
	};

	var getAllMealsForButtons = function getAllMealsForButtons() {
	  $('#meal-buttons').html('');
	  fetch('https://fast-meadow-36413.herokuapp.com/api/v1/meals').then(handleResponse).then(appendMealToButton).catch(errorLog);
	};

	var appendMealToButton = function appendMealToButton(meals) {
	  return meals.forEach(function (meal) {
	    $('#meal-buttons').append('\n     <div id="meal">\n      <input type="submit" class="meal-name-btn" id=' + meal.id + ' value=' + meal.name + '>\n      </div> \n    ');
	  });
	};

	$("#meal-buttons").on('click', '.meal-name-btn', function (event) {
	  var mealId = event.currentTarget.id;
	  var foodId = function foodId() {
	    return this.id;
	  };
	  var foodsChecked = $(":checkbox:checked").map(foodId).get();

	  if (foodsChecked.length != 0) {
	    alert("Check your diary to see the updates!");
	    postFoodsToMeal(foodsChecked, mealId);
	  } else {
	    alert("You must select a food first.");
	  }
	});

	var postFoodsToMeal = function postFoodsToMeal(foodsChecked, mealId) {
	  var length = foodsChecked.length;
	  for (var i = 0; i < length; i++) {
	    fetch('https://fast-meadow-36413.herokuapp.com/api/v1/meals/' + mealId + '/foods/' + foodsChecked[i], { method: "POST" }).then(handleResponse).catch(errorLog);
	  }
	};

	// -------------------------------------------------------------------- DIARY.HTML PAGE 

	// GET
	var getDiaryMeals = function getDiaryMeals() {
	  $('#meal-columns').html('');
	  fetch('https://fast-meadow-36413.herokuapp.com/api/v1/meals').then(handleResponse).then(getMealInfo).catch(errorLog);
	};

	var getMealInfo = function getMealInfo(meals) {
	  return meals.forEach(function (meal) {
	    $('#meal-columns').append('\n      <section class="meal-info">' + meal.name + '</section>\n    ');
	    populateFoodsPerMeal(meal);
	  });
	};

	var populateFoodsPerMeal = function populateFoodsPerMeal(meal) {
	  return meal.foods.forEach(function (food) {
	    $('.meal-info').append('\n    <article class="food-info">\n    <p class="name">' + food.name.substring(0, 8) + '</p>\n    <p class="calories">' + food.calories + '</p>\n    <p class="delete-btn" id=' + food.id + ' aria-label="Delete Food"><i class="fa fa-trash-o fa-lg" id=' + meal.id + '></i></p>\n    </article>\n    ');
	  });
	};

	$("#meal-columns").on('click', '.delete-btn', function (event) {
	  var foodId = event.currentTarget.id;
	  var mealId = event.target.id;
	  deleteMealFood(mealId, foodId);
	});

	var deleteMealFood = function deleteMealFood(mealId, foodId) {
	  fetch('https://fast-meadow-36413.herokuapp.com/api/v1/meals/' + mealId + '/foods/' + foodId, { method: "DELETE" }).then(handleResponse).then(getDiaryMeals).catch(errorLog);
	};

	getDiaryMeals();
	getAllFoodsCheck();
	getAllMealsForButtons();

/***/ })
/******/ ]);