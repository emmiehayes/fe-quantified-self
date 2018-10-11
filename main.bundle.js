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

	///////////////////////////// FOOD.HTML PAGE //////////////////////////////////////

	// GET request
	var getAllFoods = function getAllFoods() {
	  $('#food-list').html('');
	  fetch('https://fast-meadow-36413.herokuapp.com/api/v1/foods').then(handleResponse).then(getFood).catch(errorLog);
	};

	var getFood = function getFood(foods) {
	  return foods.forEach(function (food) {
	    $('#food-list').append('\n    <article class="food-info">\n    <p class="name">' + food.name + '</p>\n    <p class="calories">' + food.calories + '</p>\n    <button class="updateFood-btn" id="' + food.id + '">Edit</button>\n    <button class="deleteFood-btn" id="' + food.id + '">Delete</button>\n    ');
	  });
	};

	// POST request
	var addNewFood = function addNewFood() {
	  var newFoodName = $('#newfoodName').val();
	  var newFoodCalories = $('#newfoodCalories').val();
	  var newFoodInfo = { food: { name: newFoodName, calories: newFoodCalories } };

	  fetch('https://fast-meadow-36413.herokuapp.com/api/v1/foods', newFoodPayload(newFoodInfo)).then(handleResponse).then(getAllFoods).then(clearInput).catch(errorLog);
	};

	var newFoodPayload = function newFoodPayload(body) {
	  return {
	    method: 'POST',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify(body)
	  };
	};

	// HELPERS
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

	getAllFoods();

	$('#newFood-btn').on('click', addNewFood);
	$('#createFood-btn').on('click', addNewFood);

	///////////////////////////// MEAL.HTML PAGE //////////////////////////////////////

	// GET request
	var getAllFoodsCheck = function getAllFoodsCheck() {
	  $('#allFoods').html('');
	  fetch('https://fast-meadow-36413.herokuapp.com/api/v1/foods').then(handleResponse).then(getFoodCheck).catch(errorLog);
	};

	var getFoodCheck = function getFoodCheck(foods) {
	  return foods.forEach(function (food) {
	    $('#allFoods').append('\n      <div class="food">\n      <p class="name">' + food.name + '</p>\n      <p class="calories">' + food.calories + '</p>\n      <input type="checkbox" class="food-chk">\n    ');
	  });
	};

	var getAllMealsBtn = function getAllMealsBtn() {
	  $('#allMeals').html('');
	  fetch('https://fast-meadow-36413.herokuapp.com/api/v1/meals').then(handleResponse).then(getMealBtn).catch(errorLog);
	};

	var getMealBtn = function getMealBtn(meals) {
	  return meals.forEach(function (meal) {
	    $('#allMeals').append('\n     <form id="meal">\n      <br>\n      <input type="submit" class="meal-btn" id=' + meal.id + ' value=' + meal.name + '>\n      </form> \n    ');
	  });
	};

	getAllFoodsCheck();
	getAllMealsBtn();

	///////////////////////////// DIARY.HTML PAGE //////////////////////////////////////

/***/ })
/******/ ]);