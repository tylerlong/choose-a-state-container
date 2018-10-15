/* global React, SubX, R, uuid, ReactSubX, ReactDOM, pluralize, classNames, Router, rxjs */
const { filter, debounceTime } = rxjs.operators
const { Fragment } = React

// model
const Todo = new SubX({
  title: '',
  completed: false
})
Todo.create = obj => new Todo({ id: uuid(), ...obj })

// store
const store = SubX.create({
  todos: [],
  visibility: 'all',
  get visibleTodos () {
    if (this.visibility === 'all') {
      return this.todos
    } else if (this.visibility === 'active') {
      return this.todos.filter(todo => !todo.completed)
    } else if (this.visibility === 'completed') {
      return this.todos.filter(todo => todo.completed)
    }
  },
  get areAllDone () {
    return R.all(todo => todo.completed, this.todos)
  },
  get leftCount () {
    return this.todos.filter(todo => !todo.completed).length
  },
  get doneCount () {
    return this.todos.filter(todo => todo.completed).length
  },
  toggleAll () {
    if (this.areAllDone) {
      R.forEach(todo => { todo.completed = false }, this.todos)
    } else {
      R.forEach(todo => { todo.completed = true }, this.todos)
    }
  },
  add (title) {
    title = title.trim()
    if (title !== '') {
      this.todos.push(Todo.create({ title }))
    }
  },
  remove (todo) {
    const index = R.findIndex(t => t.id === todo.id, this.todos)
    this.todos.splice(index, 1)
  },
  edit (todo) {
    todo.cache = todo.title
  },
  doneEdit (todo) {
    delete todo.cache
    todo.title = todo.title.trim()
    if (todo.title === '') {
      this.remove(todo)
    }
  },
  cancelEdit (todo) {
    todo.title = todo.cache
    delete todo.cache
  },
  clearCompleted () {
    this.todos = this.todos.filter(todo => !todo.completed)
  }
})

// components
class App extends ReactSubX.Component {
  render () {
    const store = this.props.store
    return <Fragment>
      <section className='todoapp'>
        <header className='header'>
          <h1>todos</h1>
          <input className='new-todo' autoFocus autoComplete='off' placeholder='What needs to be done?' onKeyUp={e => {
            if (e.key === 'Enter') {
              store.add(e.target.value)
              e.target.value = ''
            }
          }} />
        </header>
        <Body store={store} />
        <Footer store={store} />
      </section>
      <footer className='info'>
        <p>Double-click to edit a todo</p>
        <p>Written by <a href='https://github.com/tylerlong'>Tyler Long</a></p>
        <p><a href='https://github.com/tylerlong/subx-demo-todomvc'>Source code</a> available</p>
      </footer>
    </Fragment>
  }
}
class Body extends ReactSubX.Component {
  render () {
    const store = this.props.store
    if (store.todos.length === 0) {
      return ''
    }
    return <section className='main'>
      <input id='toggle-all' className='toggle-all' type='checkbox' checked={store.areAllDone} onChange={e => store.toggleAll()} />
      <label htmlFor='toggle-all'>Mark all as complete</label>
      <ul className='todo-list'>
        {store.visibleTodos.map(todo => <TodoItem store={store} todo={todo} key={todo.id} />)}
      </ul>
    </section>
  }
}
class TodoItem extends ReactSubX.Component {
  render () {
    const { store, todo } = this.props
    return <li className={classNames('todo', { completed: todo.completed, editing: todo.cache })}>
      <div className='view'>
        <input className='toggle' type='checkbox' checked={todo.completed} onChange={e => { todo.completed = e.target.checked }} />
        <label onDoubleClick={e => {
          store.edit(todo)
          setTimeout(() => ReactDOM.findDOMNode(this.refs.editField).focus(), 10)
        }}>{todo.title}</label>
        <button className='destroy' onClick={e => store.remove(todo)} />
      </div>
      <input ref='editField' className='edit' type='text' value={todo.title}
        onChange={e => { todo.title = e.target.value }}
        onKeyUp={e => {
          if (e.key === 'Enter') {
            store.doneEdit(todo)
          } else if (e.key === 'Escape') {
            store.cancelEdit(todo)
          }
        }}
        onBlur={e => store.doneEdit(todo)} />
    </li>
  }
}
class Footer extends ReactSubX.Component {
  render () {
    const store = this.props.store
    if (store.todos.length === 0) {
      return ''
    }
    return <footer className='footer'>
      <span className='todo-count'>
        <strong>{pluralize('item', store.leftCount, true)}</strong> left
      </span>
      <ul className='filters'>
        <li><a href='#/all' className={classNames({ selected: store.visibility === 'all' })}>All</a></li>
        <li><a href='#/active' className={classNames({ selected: store.visibility === 'active' })}>Active</a></li>
        <li><a href='#/completed' className={classNames({ selected: store.visibility === 'completed' })}>Completed</a></li>
      </ul>
      {store.doneCount > 0 ? <button className='clear-completed' onClick={e => store.clearCompleted()}>Clear completed</button> : ''}
    </footer>
  }
}

// router
const router = new Router({
  '/all': () => { store.visibility = 'all' },
  '/active': () => { store.visibility = 'active' },
  '/completed': () => { store.visibility = 'completed' }
})
router.init()

// localStorage
store.$.pipe(
  filter(event => R.startsWith(['todos'], event.path)),
  debounceTime(100)
).subscribe(event => window.localStorage.setItem('todomvc-subx-todos', JSON.stringify(store.todos)))
const savedTodos = window.localStorage.getItem('todomvc-subx-todos')
if (savedTodos) {
  store.todos = JSON.parse(savedTodos)
}

// render
ReactDOM.render(<App store={store} />, document.getElementById('container'))
