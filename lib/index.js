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
        }
        return Promise.reject(error)
      }
      return json
    })
}

const errorLog = (error) => {
  console.error({ error })
}

// -------------------------------------------------------------------- FOOD.HTML PAGE 

// GET FOODS
const getAllFoods = () => {
  $('#food-list').html('')
  fetch('https://limitless-everglades-18138.herokuapp.com/api/v1/foods')
  .then(handleResponse)
  .then(getFood)
  .catch(errorLog)
}

const getFood = (foods) => {
  return foods.forEach((food) => {
    $("#food-list").append(`
    <article class="food-info">
    <p class="name" contenteditable="false" id="name-${food.id}"=>${food.name}</p>
    <p class="calories" contenteditable="false" id="calories-${food.id}"=>${food.calories}</p>
    <p id="${food.id}" class="updateFood-btn"><i class="fa fa-pencil fa-lg"></i></p>
    <p id="${food.id}" class="deleteFood-btn"><i class="fa fa-trash fa-lg"></i></p>
    <label class="box">
      <input type="checkbox" id="${food.id}">
        <span class="checkmark"></span>
    </label>
  
    `);
  })
}

// POST FOOD

const postFood = () => {
  let newFoodName = $('#newfoodName').val()
  let newFoodCalories = $('#newfoodCalories').val()
  let newFoodInfo = { name: newFoodName, calories: newFoodCalories }
  
  fetch(`https://limitless-everglades-18138.herokuapp.com/api/v1/foods`, postPayload(newFoodInfo))
  .then(handleResponse)
  .then(getAllFoods)
  .then(clearInput)
  .catch(errorLog)
}

const postPayload = (body) => {
  return {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
}

$("#add-food-btn").on("click", postFood);


// PATCH FOOD
$("#food-list").on('click', '.updateFood-btn', function(event) {
  let foodId = event.currentTarget.id
  let nameField = document.getElementById(`name-${foodId}`)
  let caloriesField = document.getElementById(`calories-${foodId}`)
  let buttonText = document.getElementById(`${foodId}`).innerHTML
  
  if (buttonText != "Save") {
    document.getElementById(`${foodId}`).innerHTML = "Save"
    nameField.contentEditable = "true"
    caloriesField.contentEditable = "true"
  } else {
    document.getElementById(`${foodId}`).innerHTML = '<i class="fa fa-pencil" />';
    nameField.contentEditable = "false"
    caloriesField.contentEditable = "false"
    
    var updatedName = nameField.innerText
    var updatedCals = caloriesField.innerText
    patchFood(foodId, updatedName, updatedCals)
    clearInput()
  }
})

const patchFood = (foodId, updatedName, updatedCals) => {
  let body = { name: updatedName, calories: updatedCals }
  
  fetch(`https://limitless-everglades-18138.herokuapp.com/api/v1/foods/${foodId}`, patchPayload(body))
  .then(response => handleResponse(response))
  .catch(error => console.error({ error }))
}

const patchPayload = (body) => {
  return {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }
}

// DELETE FOOD
$("#food-list").on('click', '.deleteFood-btn', function (event) {
  let foodId = event.currentTarget.id
  
  fetch(`https://limitless-everglades-18138.herokuapp.com/api/v1/foods/${foodId}`,{ method: "DELETE" })
  .then(getAllFoods)
  .then(clearInput)
  .catch(errorLog)
})

// SEARCH FOOD
$('#search').keyup(function () {
  let letters = $('#search').val().toLowerCase()
  $('.food-info').each(function () { 
    let string = this.innerText.substring(0, 10).toLowerCase()
    if (string.indexOf(letters) > -1) { 
      $(this).show()
    } else {
      $(this).hide()
    }
  })
})

// GET MEALS
const getAllMealsForButtons = () => {
  $('#meal-buttons').html('')
  fetch(`https://limitless-everglades-18138.herokuapp.com/api/v1/meals`)
  .then(handleResponse)
  .then(appendMealToButton)
  .catch(errorLog)
}

const appendMealToButton = (meals) => {
  return meals.forEach((meal) => {
    $('#meal-buttons').append(`
    <div id="meal">
    <input type="submit" class="meal-name-btn" id=${meal.id} value=${meal.name}>
    </div> 
    `)
  })
}

$("#meal-buttons").on('click', '.meal-name-btn', function (event) {
  let mealId = event.currentTarget.id
  let foodId = function () { return this.id; }
  let foodsChecked = $(":checkbox:checked").map(foodId).get()
  
  if (foodsChecked.length > 0) {
    postFoodsToMeal(foodsChecked, mealId)
    window.open("diary.html")
  } else {
    alert("You must select a food first.")
  }
})

// POST FOOD TO MEAL
const postFoodsToMeal = (foodsChecked, mealId) => {
  let length = foodsChecked.length
  for (let i = 0; i < length; i++) {
    let foodId = foodsChecked[i] 
    fetch(`https://limitless-everglades-18138.herokuapp.com/api/v1/meals/${mealId}/foods/${foodId}`, postMealFoodPayload(mealId, foodId))
    .then(handleResponse)
    .catch(errorLog)
  }
}

const postMealFoodPayload = (foodId, mealId) => {
  return {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'Accept': 'application/json', 
    },
    body: JSON.stringify({
      food_id: foodId,
      meal_id: mealId
    })
  }
}

// -------------------------------------------------------------------- DIARY.HTML PAGE 

// GET MEALS WITH FOODS
const getDiaryMeals = () => {
  $('.meal-data').html('')
  fetch('https://limitless-everglades-18138.herokuapp.com/api/v1/meals')
    .then(handleResponse)
    .then(getMealInfo)
    .catch(errorLog)
}

const getMealInfo = (meals) => {
  return meals.forEach((meal) => {
    $('.meal-data').append(`
      <section class="meal-summary">
        <p class="meal-title">${meal.name}</p>
        <p>Total Calories:</p>
        <div class="meal-columns"></div>
      </section> 
    `)
    populateFoodsPerMeal(meal)
  })
}

const populateFoodsPerMeal = (meal) => {
    return meal.foods.forEach((food) => {
    $(".meal-columns").append(`
      <article class="food-info">
        <h3 class="name">${food.name.substring(0, 8)}</h3>
        <h3 id="calories">${food.calories}</h3>
        <p id="${food.id}" class="deleteFood-btn"><i class="fa fa-trash fa-lg"></i></p>
      </article>
    `);
  })
}

// DELETE FOOD FROM MEAL ONLY
$(`.meal-data`).on('click', '.deleteFood-btn', function (event) {
  let foodId = event.currentTarget.id
  let mealId = event.target.id
  fetch(`https://limitless-everglades-18138.herokuapp.com/api/v1/meals/${mealId}/foods/${foodId}`, { method: "DELETE" })
    .then(getDiaryMeals)
    .catch(errorLog)
})

getAllFoods()
getAllMealsForButtons()
getDiaryMeals()
