///////////////////////////// HELPER METHODS //////////////////////////////////////

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

///////////////////////////// FOOD.HTML PAGE //////////////////////////////////////

/////////////// GET request
const getAllFoods = () => {
  $('#food-list').html('')
  fetch('https://rails-quantified-self.herokuapp.com/api/v1/foods')
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
    <p class="edit-btn" id="${food.id}"><i class="fa fa-pencil fa-lg"></i></p>
    <p class="delete-btn" id="${food.id}"><i class="fa fa-trash-o fa-lg"></i></p>
    `)
  })
}

/////////////// POST request
const addNewFood = () => {
  let newFoodName = $('#newfoodName').val();
  let newFoodCalories = $('#newfoodCalories').val();
  let newFoodInfo = { food: { name: newFoodName, calories: newFoodCalories } }
  fetch(`https://rails-quantified-self.herokuapp.com/api/v1/foods`, newFoodPayload(newFoodInfo))
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

getAllFoods()

///////////////////////////// MEAL.HTML PAGE //////////////////////////////////////

/////////////// GET request foods
const getAllFoodsCheck = () => {
  $('#allFoods').html('')
  fetch('https://rails-quantified-self.herokuapp.com/api/v1/foods')
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

/////////////// GET request meals
const getAllMealsBtn = () => {
  $('#allMeals').html('')
  fetch('https://rails-quantified-self.herokuapp.com/api/v1/meals')
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

/////////////// GET request
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
    <p class="delete-btn" id="${food.id}"><i class="fa fa-trash-o fa-lg"></i></p>
    </article>
    `)
  })
}

getDiaryMeals()


///////////////////////////// EVENT LISTENERS //////////////////////////////////////
$('#newFood-btn').on('click', addNewFood)
$('#createFood-btn').on('click', addNewFood)