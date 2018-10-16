// -------------------------------------------------------------------- HELPER FUNCTIONS
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

// GET 
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
    <p class="name" contenteditable="false" id="name-${food.id}"=>${food.name}</p>
    <p class="calories" contenteditable="false" id="calories-${food.id}"=>${food.calories}</p>
    <button type="button" class="updateFood-btn" id="${food.id}">Edit</button>
    `)
  })
}

// POST 
const postFood = () => {
  let newFoodName = $('#newfoodName').val()
  let newFoodCalories = $('#newfoodCalories').val()
  let body = { food: { name: newFoodName, calories: newFoodCalories } }

  fetch(`https://fast-meadow-36413.herokuapp.com/api/v1/foods`, postPayload(body))
  .then(handleResponse)
  .then(getAllFoods)
  .then(clearInput)
  .catch(errorLog)
}

const postPayload = (body) => {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }
}

// PATCH 
$("#food-list").on('click', '.updateFood-btn', function(event) {
  let foodId = event.currentTarget.id
  let nameField = document.getElementById(`name-${foodId}`)
  let caloriesField = document.getElementById(`calories-${foodId}`)
  let buttonText = document.getElementById(`${foodId}`).innerHTML

  if (buttonText == "Edit") {
    document.getElementById(`${foodId}`).innerHTML = "Save"
    nameField.contentEditable = "true"
    caloriesField.contentEditable = "true"
  } else if (buttonText == "Save") {
    document.getElementById(`${foodId}`).innerHTML = "Edit"
    nameField.contentEditable = "false"
    caloriesField.contentEditable = "false"

    var updatedName = nameField.innerText
    var updatedCals = caloriesField.innerText
    patchFood(foodId, updatedName, updatedCals)
  }
})

const patchFood = (foodId, updatedName, updatedCals) => {
  let body = { food: { name: updatedName, calories: updatedCals } }
  
  fetch(`https://fast-meadow-36413.herokuapp.com//api/v1/foods/${foodId}/`, patchPayload(body))
    .then(response => handleResponse(response))
    .catch(error => console.error({ error }))
}

const patchPayload = (body) => {
  return {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }
}

// SEARCH
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

// EVENTS
getAllFoods()
$('#add-food-btn').on('click', postFood)

// -------------------------------------------------------------------- MEAL.HTML PAGE 

// GET
const getAllFoodsCheck = () => {
  $('#allFoods').html('')
  fetch('https://fast-meadow-36413.herokuapp.com/api/v1/foods')
    .then(handleResponse)
    .then(appendFoodToList)
    .catch(errorLog)
}

const appendFoodToList = (foods) => {
  return foods.forEach((food) => {
    $('#food-list-for-meals').append(`
      <div class="food-info">
      <p class="name">${food.name}</p>
      <p class="calories">${food.calories}</p>
      <input type="checkbox" class="food-chk" id="${food.id}">
    `)
  })
}

const getAllMealsForButtons = () => {
  $('#meal-buttons').html('')
  fetch('https://rails-quantified-self.herokuapp.com/api/v1/meals')
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

  if (foodsChecked.length != 0) {
    alert("Check your diary to see the updates!")
    postFoodsToMeal(foodsChecked, mealId)
  } else {
    alert("You must select a food first.")
  }
})

const postFoodsToMeal = (foodsChecked, mealId) => {
  let length = foodsChecked.length
  for (var i = 0; i < length; i++) {
    fetch(`https://fast-meadow-36413.herokuapp.com/api/v1/meals/${mealId}/foods/${foodsChecked[i]}`, {method: "POST"})
    .then(handleResponse)
    .catch(errorLog)
  }
}

// -------------------------------------------------------------------- DIARY.HTML PAGE 

// GET
const getDiaryMeals = () => {
  $('#meal-columns').html('')
  fetch('https://fast-meadow-36413.herokuapp.com/api/v1/meals')
    .then(handleResponse)
    .then(getMealInfo)
    .catch(errorLog)
}

const getMealInfo = (meals) => {
  return meals.forEach((meal) => {
    $('#meal-columns').append(`
      <section class="meal-info">${meal.name}</section>
    `)
    populateFoodsPerMeal(meal)
  })
}

const populateFoodsPerMeal = (meal) => {
    return meal.foods.forEach((food) => {
    $('.meal-info').append(`
    <article class="food-info">
    <p class="name">${food.name.substring(0, 8)}</p>
    <p class="calories">${food.calories}</p>
    <p class="delete-btn" id=${food.id} aria-label="Delete Food"><i class="fa fa-trash-o fa-lg" id=${meal.id}></i></p>
    </article>
    `)
  })
}

$("#meal-columns").on('click', '.delete-btn', function (event) {
  let foodId = event.currentTarget.id
  let mealId = event.target.id
  deleteMealFood(mealId, foodId)
})

const deleteMealFood = (mealId, foodId) => {
  fetch(`https://fast-meadow-36413.herokuapp.com/api/v1/meals/${mealId}/foods/${foodId}`, {method: "DELETE"})
  .then(handleResponse)
  .then(getDiaryMeals)
  .catch(errorLog)
}


getDiaryMeals()
getAllFoodsCheck()
getAllMealsForButtons()
