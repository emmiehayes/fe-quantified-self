///////////////////////////// FOOD.HTML PAGE //////////////////////////////////////

// GET request
const getAllFoods = () => {
  $('#food-list').html('')
  fetch('https://fast-meadow-36413.herokuapp.com/api/v1/foods')
  .then(handleResponse)
  .then(getFood)
  .catch(errorLog)
}

const getFood = (foods) => {
  return foods.forEach((food) => {
    $('#food-list').append(`
    <article class="food-info">
    <p class="name">${food.name}</p>
    <p class="calories">${food.calories}</p>
    <button class="updateFood-btn" id="${food.id}">Edit</button>
    <button class="deleteFood-btn" id="${food.id}">Delete</button>
    `)
  })
}

// POST request
const addNewFood = () => {
  let newFoodName = $('#newfoodName').val();
  let newFoodCalories = $('#newfoodCalories').val();
  let newFoodInfo = { food: { name: newFoodName, calories: newFoodCalories } }

  fetch(`https://fast-meadow-36413.herokuapp.com/api/v1/foods`, newFoodPayload(newFoodInfo))
  .then(handleResponse)
  .then(getAllFoods)
  .then(clearInput)
  .catch(errorLog)
}

const newFoodPayload = (body) => {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }
}

// DELETE request
// UPDATE request

// HELPERS
const clearInput = () => {
  $('.input').val('')
}

const handleResponse = (response) => {
  return response.json()
  .then((json) => {
    if (!response.ok) {
      const error = {
        status: response.status,
        statusText: response.statusText,
        json
      };
      return Promise.reject(error)
    }
    return json
  })
}

const errorLog = (error) => {
  console.error({ error })
}

getAllFoods()

$('#newFood-btn').on('click', addNewFood)
$('#createFood-btn').on('click', addNewFood)



///////////////////////////// MEAL.HTML PAGE //////////////////////////////////////

// GET request
const getAllFoodsCheck = () => {
  $('#allFoods').html('')
  fetch('https://fast-meadow-36413.herokuapp.com/api/v1/foods')
    .then(handleResponse)
    .then(getFoodCheck)
    .catch(errorLog)
}

const getFoodCheck = (foods) => {
  return foods.forEach((food) => {
    $('#allFoods').append(`
      <div class="food">
      <p class="name">${food.name}</p>
      <p class="calories">${food.calories}</p>
      <input type="checkbox" class="food-chk">
    `)
  })
}

const getAllMealsBtn = () => {
  $('#allMeals').html('')
  fetch('https://fast-meadow-36413.herokuapp.com/api/v1/meals')
    .then(handleResponse)
    .then(getMealBtn)
    .catch(errorLog)
}

const getMealBtn = (meals) => {
  return meals.forEach((meal) => {
    $('#allMeals').append(`
     <form id="meal">
      <br>
      <input type="submit" class="meal-btn" id=${meal.id} value=${meal.name}>
      </form> 
    `)
  })
}

getAllFoodsCheck()
getAllMealsBtn()







///////////////////////////// DIARY.HTML PAGE //////////////////////////////////////
// GET request
const getAllMealFoods = () => {
  $('#allMealFoods').html('')
  fetch('https://fast-meadow-36413.herokuapp.com/api/v1/meals')
    .then(handleResponse)
    .then(getFoodCheck)
    .catch(errorLog)
}

const getMealFood = (mealFood) => {
  return mealFood.forEach((food) => {
    debugger;
    $('#allMealFoods').append(`
      <div class="food">
      <p class="name">${food.name}</p>
      <p class="calories">${food.calories}</p>
      <input type="checkbox" class="food-chk">
    `)
  })
}
