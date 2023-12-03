const todoList = document.querySelector('#todo-list')
const errMsgContent = document.querySelector('.error-msg')
const myModal = new bootstrap.Modal('#myModal')
let todosArr = []

const getTodo = async () => {
  try {
    const response = await fetch('https://js1-todo-api.vercel.app/api/todos?apikey=955e53a9-dda5-41b8-859a-caf89cb530a9')

    if (response.status !== 200) {
        throw new Error('Something went wrong, status: ' + response.status)
    }

    const data = await response.json()
    data.forEach(todo => todosArr.unshift(todo))
    rendertodosArr()
      
  } catch (err) {
    document.body.insertAdjacentHTML('beforeend', `
    <div class="alert alert-danger w-50 col-md-6 offset-md-3" role="alert">
      Something went wrong
    </div>
    `)
    console.error(err.message)
  }
}

getTodo()


function rendertodosArr() {
  todoList.innerHTML = ''
  errMsgContent.textContent = ''
  todosArr.forEach(todo => {
    todoList.insertAdjacentHTML('beforeend', `
    <li class="todo bg-light p-2 rounded mb-3 d-flex align-items-center w-50">
      <p class="fs-3 mb-0 w-100 overflow-auto">${todo.title}</p>
      <input class="form-check-input todoCheck mx-3 my-0 border border-primary" type="checkbox" id="todoCheck-${todo._id}" name="checkbox">
      <button todo-id="${todo._id}" id="remove-${todo._id}" class="btn remove-btn"><i class="fa-solid fa-trash"></i></button>
    </li>
    `)
    
    const checkbox = document.querySelector('#todoCheck-' + todo._id)
    if (todo.completed == true){
      checkbox.checked = true
      checkbox.parentElement.classList.toggle('text-decoration-line-through')
    }

    checkbox.addEventListener('change', async () => {
      const todoStatus = { completed: checkbox.checked }

      try {
        const response = await fetch(`https://js1-todo-api.vercel.app/api/todos/${todo._id}?apikey=955e53a9-dda5-41b8-859a-caf89cb530a9`, {
          method: 'PUT',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(todoStatus)
        })

        if (response.status !== 200) {
          throw new Error('Could not set todo to complete: ' + response.status)
        }

        checkbox.parentElement.classList.toggle('text-decoration-line-through')
        todo.completed = todoStatus.completed

      } catch (err) {
        document.body.insertAdjacentHTML('beforeend', `
        <div class="alert alert-danger w-50 col-md-6 offset-md-3" role="alert">
          Something went wrong
        </div>
        `)
        console.error(err.message)
      }
    })
    
    document.querySelector('#remove-' + todo._id).addEventListener('click', async () => {
      if (todo.completed !== true) {
        myModal.show()
        return
      }

      try {
        const response = await fetch(`https://js1-todo-api.vercel.app/api/todos/${todo._id}?apikey=955e53a9-dda5-41b8-859a-caf89cb530a9`, {
          method: 'DELETE'
        })

        if (response.status !== 200) {
          throw new Error('Could not delete todo: ' + response.status)
        }

        todosArr.splice(todosArr.indexOf(todo), 1)
        rendertodosArr()

      } catch (err) {
        document.body.insertAdjacentHTML('beforeend', `
        <div class="alert alert-danger w-50 col-md-6 offset-md-3" role="alert">
          Something went wrong
        </div>
        `)
        console.error(err.message)
      }
    })
  }) 
}


const form = document.querySelector('#regForm')

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  
  if (form['title'].value.trim() === '') {
    errMsgContent.textContent = 'Can\'t be empty'
    return
  }

  const newTodo = { title: form['title'].value }

  try {
    const response = await fetch('https://js1-todo-api.vercel.app/api/todos?apikey=955e53a9-dda5-41b8-859a-caf89cb530a9', {
      method: 'POST',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify(newTodo)
    })

    if(response.status !== 201) {
      throw new Error('Could not add new todo: ' + response.status)
    }
    
    const todo = await response.json()
    todosArr.unshift(todo)
    rendertodosArr()
    form.reset()

  } catch (err) {
    document.body.insertAdjacentHTML('beforeend', `
    <div class="alert alert-danger w-50 col-md-6 offset-md-3" role="alert">
      Something went wrong
    </div>
    `)
    console.error(err.message)
  }
})


  

  
