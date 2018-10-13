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
  var letters = $('#search').val()
  $('.food-info').each(function () { 
    var str = this.innerText.substring(0, 10)
    if (str.indexOf(letters) > -1) { 
      $(this).show()
    } else {
      $(this).hide()
    }
  })
})

getAllFoods()
$('#newFood-btn').on('click', postFood)

// -------------------------------------------------------------------- MEAL.HTML PAGE 

// GET
const getAllFoodsCheck = () => {
  $('#allFoods').html('')
  fetch('https://rails-quantified-self.herokuapp.com/api/v1/foods')
    .then(handleResponse)
    .then(getFoodCheck)
    .catch(errorLog)
}

const getFoodCheck = (foods) => {
  return foods.forEach((food) => {
    $('#food-list-for-meals').append(`
      <div class="food-info">
      <p class="name">${food.name}</p>
      <p class="calories">${food.calories}</p>
      <input type="checkbox" class="food-chk">
    `)
  })
}

const getAllMealsBtn = () => {
  $('#meal-buttons').html('')
  fetch('https://rails-quantified-self.herokuapp.com/api/v1/meals')
    .then(handleResponse)
    .then(getMealBtn)
    .catch(errorLog)
}

const getMealBtn = (meals) => {
  return meals.forEach((meal) => {
    $('#meal-buttons').append(`
     <form id="meal">
      <input type="submit" class="meal-name-btn" id=${meal.id} value=${meal.name}>
      </form> 
    `)
  })
}

getAllFoodsCheck()
getAllMealsBtn()

// -------------------------------------------------------------------- DIARY.HTML PAGE 

// GET
const getDiaryMeals = () => {
  $('#meal-columns').html('')
  fetch('https://rails-quantified-self.herokuapp.com/api/v1/meals')
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
    <p class="delete-btn" id="${food.id}" aria-label="Delete Food"><i class="fa fa-trash-o fa-lg"></i></p>
    </article>
    `)
  })
}

getDiaryMeals()