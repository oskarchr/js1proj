// Fixa todos som är för långa för windowsize
// Mer styling på completed todos?
// Modal popup när man försöker deleta ej-completed
//Lägga till datum tillagd?


const todoList = document.querySelector('#todo-list')
const errMsgContent = document.querySelector('.error-msg')
const myModal = new bootstrap.Modal('#myModal')

let todosArr = []

const getTodo = async () => {
  
  try {
    const response = await fetch('https://js1-todo-api.vercel.app/api/todos?apikey=955e53a9-dda5-41b8-859a-caf89cb530a9')

    if(response.status !== 200) {
        throw new Error('Something went wrong, status: ' + response.status)
    }

    const data = await response.json()
    
    console.log(data)
    data.forEach(x => todosArr.unshift(x)) 
    
    rendertodosArr()
      
  } catch (err) {
    document.body.insertAdjacentHTML('beforeend', `
    <div class="popup" id="errorPopup">
      Error
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
    <li class="todo bg-light p-2 rounded mb-3">
      <p class="fs-1 mb-0">${todo.title}</p>
      <input type="checkbox" id="todoCheck-${todo._id}" name="checkbox">
      <button todo-id="${todo._id}" id="remove-${todo._id}" class="btn remove-btn"><i class="fa-solid fa-trash"></i></button>
    </li>
    `)

    const checkbox = document.querySelector('#todoCheck-' + todo._id)
    if (todo.completed == true){
      checkbox.checked = true
    } // Pre-mark completed todos when rendering


    checkbox.addEventListener('change', async () => {
      const todoStatus = { completed: checkbox.checked }
      console.log(todoStatus)
      
      try {
        const response = await fetch(`https://js1-todo-api.vercel.app/api/todos/${todo._id}?apikey=955e53a9-dda5-41b8-859a-caf89cb530a9`, {
          method: 'PUT',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(todoStatus)
        })

        if(response.status !== 200) {
          throw new Error('Could not set todo to complete: ' + response.status)
        }

        todo.completed = todoStatus.completed
        console.log(todosArr)

      } catch (err) {
        document.body.insertAdjacentHTML('beforeend', `
        <div class="popup" id="errorPopup">
          Error
        </div>
        `)
        console.error(err.message)
      }
    })
    
    document.querySelector('#remove-' + todo._id).addEventListener('click', async () => {
      if(todo.completed !== true) {
        console.log('can not delete')
        console.log(todosArr)
        myModal.show()
        return
      }

      try {
        const response = await fetch(`https://js1-todo-api.vercel.app/api/todos/${todo._id}?apikey=955e53a9-dda5-41b8-859a-caf89cb530a9`, {
          method: 'DELETE'
        })

        if(response.status !== 200) {
          throw new Error('Could not delete todo: ' + response.status)
        }

        const data = await response.json()
        todosArr.splice(todosArr.indexOf(todo), 1)
        rendertodosArr()
      } catch (err) {
        document.body.insertAdjacentHTML('beforeend', `
        <div class="popup" id="errorPopup">
          Error
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
  
  if(form['title'].value.trim() === ''){
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
      throw new Error('Could not add new todo' + response.status)
    }
    
    const todo = await response.json()

    todosArr.unshift(todo)
    rendertodosArr()
    form.reset()

  } catch (err) {
    document.body.insertAdjacentHTML('beforeend', `
    <div class="popup" id="errorPopup">
      Error
    </div>
    `)
    console.error(err.message)
  }
})


  

  
