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


// Helper Methods
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


