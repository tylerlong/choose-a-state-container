import { decorate, observable, action, computed } from 'mobx'
import * as R from 'ramda'

let id = 0
const uuid = () => ++id

// model
class Todo {
  id = uuid()
  title = ''
  completed = false
  cache = undefined
}
decorate(Todo, {
  title: observable,
  completed: observable,
  cache: observable
})

// store
class Store {
  todos = []
  visibility = 'all'
  get visibleTodos () {
    if (this.visibility === 'all') {
      return this.todos
    } else if (this.visibility === 'active') {
      return this.todos.filter(todo => !todo.completed)
    } else if (this.visibility === 'completed') {
      return this.todos.filter(todo => todo.completed)
    }
  }

  get length () {
    return this.todos.length
  }

  get areAllDone () {
    return R.all(todo => todo.completed, this.todos)
  }

  get leftCount () {
    return this.todos.filter(todo => !todo.completed).length
  }

  get doneCount () {
    return this.todos.filter(todo => todo.completed).length
  }

  toggleAll () {
    if (this.areAllDone) {
      R.forEach(todo => { todo.completed = false }, this.todos)
    } else {
      R.forEach(todo => { todo.completed = true }, this.todos)
    }
  }

  add (title) {
    title = title.trim()
    if (title !== '') {
      const todo = new Todo()
      todo.title = title
      this.todos.push(todo)
    }
  }

  remove (todo) {
    const index = R.findIndex(t => t.id === todo.id, this.todos)
    this.todos.splice(index, 1)
  }

  edit (todo) {
    todo.cache = todo.title
  }

  doneEdit (todo) {
    todo.cache = undefined
    todo.title = todo.title.trim()
    if (todo.title === '') {
      this.remove(todo)
    }
  }

  cancelEdit (todo) {
    todo.title = todo.cache
    todo.cache = undefined
  }

  clearCompleted () {
    this.todos = this.todos.filter(todo => !todo.completed)
  }
}
decorate(Store, {
  todos: observable,
  visibility: observable,
  visibleTodos: computed,
  length: computed,
  areAllDone: computed,
  leftCount: computed,
  doneCount: computed,
  toggleAll: action,
  add: action,
  remove: action,
  edit: action,
  doneEdit: action,
  cancelEdit: action,
  clearCompleted: action
})
const store = new Store()

export default store
