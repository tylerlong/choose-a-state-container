/* global uuid, mobx, R, React, ReactDOM, classNames, pluralize, Router, mobxReact */
const { observable, decorate, computed, action, autorun } = mobx
const { observer } = mobxReact

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

// component App
class _App extends React.Component {
  render () {
    const store = this.props.store
    return (
      <>
        <section className='todoapp'>
          <header className='header'>
            <h1>todos</h1>
            <input
              className='new-todo' autoFocus autoComplete='off' onKeyUp={e => {
                if (e.key === 'Enter') {
                  store.add(e.target.value)
                  e.target.value = ''
                }
              }} placeholder='What needs to be done?'
            />
          </header>
          <Body store={store} />
          <Footer store={store} />
        </section>
        <footer className='info'>
          <p>Double-click to edit a todo</p>
          <p>Written by <a href='https://github.com/tylerlong'>Tyler Long</a></p>
          <p>
            <a href='https://github.com/tylerlong/choose-a-state-container/tree/master/examples/todomvc/mobx'>
              Source code
            </a> available
          </p>
        </footer>
      </>
    )
  }
}
const App = observer(_App)

// component Body
class _Body extends React.Component {
  render () {
    const store = this.props.store
    if (store.length === 0) {
      return ''
    }
    return (
      <section className='main'>
        <input
          id='toggle-all' className='toggle-all' type='checkbox'
          checked={store.areAllDone} onChange={e => store.toggleAll()}
        />
        <label htmlFor='toggle-all'>Mark all as complete</label>
        <ul className='todo-list'>
          {store.visibleTodos.map(todo => <TodoItem store={store} todo={todo} key={todo.id} />)}
        </ul>
      </section>
    )
  }
}
const Body = observer(_Body)

// component TodoItem
class _TodoItem extends React.Component {
  render () {
    const { store, todo } = this.props
    return (
      <li className={classNames('todo', { completed: todo.completed, editing: todo.cache })}>
        <div className='view'>
          <input
            className='toggle' type='checkbox' checked={todo.completed}
            onChange={e => { todo.completed = e.target.checked }}
          />
          <label onDoubleClick={e => {
            store.edit(todo)
            setTimeout(() => ReactDOM.findDOMNode(this.refs.editField).focus(), 10)
          }}
          >{todo.title}
          </label>
          <button className='destroy' onClick={e => store.remove(todo)} />
        </div>
        <input
          ref='editField' className='edit' type='text' value={todo.title}
          onChange={e => { todo.title = e.target.value }}
          onKeyUp={e => {
            if (e.key === 'Enter') {
              store.doneEdit(todo)
            } else if (e.key === 'Escape') {
              store.cancelEdit(todo)
            }
          }}
          onBlur={e => store.doneEdit(todo)}
        />
      </li>
    )
  }
}
const TodoItem = observer(_TodoItem)

// component Footer
class _Footer extends React.Component {
  render () {
    const { store } = this.props
    if (store.length === 0) {
      return ''
    }
    return (
      <footer className='footer'>
        <span className='todo-count'>
          <strong>{pluralize('item', store.leftCount, true)}</strong> left
        </span>
        <ul className='filters'>
          <li><a href='#/all' className={classNames({ selected: store.visibility === 'all' })}>All</a></li>
          <li><a href='#/active' className={classNames({ selected: store.visibility === 'active' })}>Active</a></li>
          <li><a href='#/completed' className={classNames({ selected: store.visibility === 'completed' })}>Completed</a>
          </li>
        </ul>
        {store.doneCount <= 0 ? ''
          : <button className='clear-completed' onClick={e => store.clearCompleted()}>Clear completed</button>}
      </footer>
    )
  }
}
const Footer = observer(_Footer)

// router
const router = new Router({
  '/all': () => { store.visibility = 'all' },
  '/active': () => { store.visibility = 'active' },
  '/completed': () => { store.visibility = 'completed' }
})
router.init()

// localStorage
const savedTodos = window.localStorage.getItem('todomvc-mobx-todos')
if (savedTodos) {
  store.todos = JSON.parse(savedTodos)
}
autorun(() => {
  window.localStorage.setItem('todomvc-mobx-todos', JSON.stringify(store.todos))
}, { delay: 1000 }) // delay is throttle, don't know how to debounce using MobX

// render
ReactDOM.render(<App store={store} />, document.getElementById('container'))
