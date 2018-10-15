/* global React, Redux, R, uuid, ReactRedux, ReactDOM, pluralize, classNames, Router, _, Reselect */
const { Provider } = ReactRedux
const { Fragment } = React

// selectors
const todosSelector = state => state.todos
const visibilitySelector = state => state.visibility
const lengthSelector = Reselect.createSelector(
  todosSelector,
  todos => todos.length
)
const visibleTodosSelector = Reselect.createSelector(
  todosSelector, visibilitySelector,
  (todos, visibility) => {
    if (visibility === 'all') {
      return todos
    } else if (visibility === 'active') {
      return todos.filter(todo => !todo.completed)
    } else if (visibility === 'completed') {
      return todos.filter(todo => todo.completed)
    }
  }
)
const areAllDoneSelector = Reselect.createSelector(
  todosSelector,
  todos => R.all(todo => todo.completed, todos)
)
const leftCountSelector = Reselect.createSelector(
  todosSelector,
  todos => todos.filter(todo => !todo.completed).length
)
const doneCountSelector = Reselect.createSelector(
  todosSelector,
  todos => todos.filter(todo => todo.completed).length
)

// reducer
const TOGGLE_ALL = 'TOGGLE_ALL'
const ADD = 'ADD'
const REMOVE = 'REMOVE'
const EDIT = 'EDIT'
const DONE_EDIT = 'DONE_EDIT'
const CANCEL_EDIT = 'CANCEL_EDIT'
const CLEAR_COMPLETED = 'CLEAR_COMPLETED'
const SET_TODOS = 'SET_TODOS'
const SET_VISIBILITY = 'SET_VISIBILITY'
const SET_COMPLETED = 'SET_COMPLETED'
const SET_TITLE = 'SET_TITLE'
const initialState = {
  todos: [],
  visibility: 'all'
}
const visibilityReducer = (visibility = initialState.visibility, action) => {
  switch (action.type) {
    case SET_VISIBILITY:
      return action.visibility
    default:
      return visibility
  }
}
const todosReducer = (todos = initialState.todos, action) => {
  switch (action.type) {
    case TOGGLE_ALL:
      if (areAllDoneSelector({ todos })) {
        return R.map(R.assoc('completed', false), todos)
      } else {
        return R.map(R.assoc('completed', true), todos)
      }
    case ADD:
      const title = action.title.trim()
      if (title !== '') {
        return [...todos, { id: uuid(), title, completed: false }]
      }
      return todos
    case REMOVE:
      const index = R.findIndex(t => t.id === action.id, todos)
      return R.remove(index, 1, todos)
    case EDIT:
      const index2 = R.findIndex(t => t.id === action.id, todos)
      const todo2 = todos[index2]
      return R.set(R.lensPath([index2]), { ...todo2, cache: todo2.title }, todos)
    case DONE_EDIT:
      const index3 = R.findIndex(t => t.id === action.id, todos)
      const todo3 = todos[index3]
      if (todo3.title.trim() === '') {
        return R.remove(index3, 1, todos)
      } else {
        return R.set(R.lensPath([index3]), R.dissoc('cache', todo3), todos)
      }
    case CANCEL_EDIT:
      const index4 = R.findIndex(t => t.id === action.id, todos)
      const todo4 = todos[index4]
      return R.set(R.lensPath([index4]), R.pipe(
        R.assoc('title', todo4.cache),
        R.dissoc('cache')
      )(todo4))(todos)
    case CLEAR_COMPLETED:
      return R.filter(todo => !todo.completed, todos)
    case SET_TODOS:
      return action.todos
    case SET_COMPLETED:
      const index5 = R.findIndex(t => t.id === action.id, todos)
      const todo5 = todos[index5]
      return R.set(R.lensPath([index5]), { ...todo5, completed: action.completed }, todos)
    case SET_TITLE:
      const index6 = R.findIndex(t => t.id === action.id, todos)
      const todo6 = todos[index6]
      return R.set(R.lensPath([index6]), { ...todo6, title: action.title }, todos)
    default:
      return todos
  }
}
const reducer = Redux.combineReducers({
  visibility: visibilityReducer,
  todos: todosReducer
})

// store
const store = Redux.createStore(reducer)

// actions
const add = title => ({ type: ADD, title })
const toggleAll = () => ({ type: TOGGLE_ALL })
const edit = id => ({ type: EDIT, id })
const remove = id => ({ type: REMOVE, id })
const doneEdit = id => ({ type: DONE_EDIT, id })
const cancelEdit = id => ({ type: CANCEL_EDIT, id })
const clearCompleted = () => ({ type: CLEAR_COMPLETED })
const setTodos = todos => ({ type: SET_TODOS, todos })
const setVisibility = visibility => ({ type: SET_VISIBILITY, visibility })
const setCompleted = (id, completed) => ({ type: SET_COMPLETED, id, completed })
const setTitle = (id, title) => ({ type: SET_TITLE, id, title })

// component App
class _App extends React.Component {
  render () {
    const { add } = this.props
    return <Fragment>
      <section className='todoapp'>
        <header className='header'>
          <h1>todos</h1>
          <input className='new-todo' autoFocus autoComplete='off' onKeyUp={e => {
            if (e.key === 'Enter') {
              add(e.target.value)
              e.target.value = ''
            }
          }} placeholder='What needs to be done?' />
        </header>
        <Body />
        <Footer />
      </section>
      <footer className='info'>
        <p>Double-click to edit a todo</p>
        <p>Written by <a href='https://github.com/tylerlong'>Tyler Long</a></p>
        <p><a href='https://github.com/tylerlong/choose-a-state-container/tree/master/examples/todomvc/redux'>
          Source code
        </a> available</p>
      </footer>
    </Fragment>
  }
}
const App = ReactRedux.connect(null, { add })(_App)

// component Body
class _Body extends React.Component {
  render () {
    const { length, areAllDone, visibleTodos, toggleAll } = this.props
    if (length === 0) {
      return ''
    }
    return <section className='main'>
      <input id='toggle-all' className='toggle-all' type='checkbox' checked={areAllDone} onChange={e => toggleAll()} />
      <label htmlFor='toggle-all'>Mark all as complete</label>
      <ul className='todo-list'>
        {visibleTodos.map(todo => <TodoItem id={todo.id} key={todo.id} />)}
      </ul>
    </section>
  }
}
const Body = ReactRedux.connect(
  state => ({
    length: lengthSelector(state),
    areAllDone: areAllDoneSelector(state),
    visibleTodos: visibleTodosSelector(state)
  }),
  { toggleAll }
)(_Body)

// component TodoItem
class _TodoItem extends React.Component {
  render () {
    const { todo, edit, doneEdit, cancelEdit, remove, setTitle, setCompleted } = this.props
    return <li className={classNames('todo', { completed: todo.completed, editing: todo.cache })}>
      <div className='view'>
        <input className='toggle' type='checkbox' checked={todo.completed}
          onChange={e => setCompleted(todo.id, e.target.checked)} />
        <label onDoubleClick={e => {
          edit(todo.id)
          setTimeout(() => ReactDOM.findDOMNode(this.refs.editField).focus(), 10)
        }}>{todo.title}</label>
        <button className='destroy' onClick={e => remove(todo.id)} />
      </div>
      <input ref='editField' className='edit' type='text' value={todo.title}
        onChange={e => setTitle(todo.id, e.target.value)}
        onKeyUp={e => {
          if (e.key === 'Enter') {
            doneEdit(todo.id)
          } else if (e.key === 'Escape') {
            cancelEdit(todo.id)
          }
        }}
        onBlur={e => doneEdit(todo.id)} />
    </li>
  }
}
const TodoItem = ReactRedux.connect(
  (state, ownProps) => ({
    todo: todosSelector(state).filter(todo => todo.id === ownProps.id)[0]
  }),
  { edit, remove, doneEdit, cancelEdit, setCompleted, setTitle }
)(_TodoItem)

// component Footer
class _Footer extends React.Component {
  render () {
    const { length, leftCount, doneCount, visibility, clearCompleted } = this.props
    if (length === 0) {
      return ''
    }
    return <footer className='footer'>
      <span className='todo-count'>
        <strong>{pluralize('item', leftCount, true)}</strong> left
      </span>
      <ul className='filters'>
        <li><a href='#/all' className={classNames({ selected: visibility === 'all' })}>All</a></li>
        <li><a href='#/active' className={classNames({ selected: visibility === 'active' })}>Active</a></li>
        <li><a href='#/completed' className={classNames({ selected: visibility === 'completed' })}>Completed</a></li>
      </ul>
      {doneCount <= 0 ? ''
        : <button className='clear-completed' onClick={e => clearCompleted()}>Clear completed</button>}
    </footer>
  }
}
const Footer = ReactRedux.connect(
  state => ({
    length: lengthSelector(state),
    leftCount: leftCountSelector(state),
    visibility: visibilitySelector(state),
    doneCount: doneCountSelector(state)
  }),
  { clearCompleted }
)(_Footer)

// router
const router = new Router({
  '/all': () => store.dispatch(setVisibility('all')),
  '/active': () => store.dispatch(setVisibility('active')),
  '/completed': () => store.dispatch(setVisibility('completed'))
})
router.init()

// localStorage
let saveToLocalStorage = () => {
  window.localStorage.setItem('todomvc-redux-todos', JSON.stringify(todosSelector(store.getState())))
}
saveToLocalStorage = _.debounce(saveToLocalStorage, 100)
store.subscribe(() => saveToLocalStorage())
const savedTodos = window.localStorage.getItem('todomvc-redux-todos')
if (savedTodos) {
  const todos = JSON.parse(savedTodos)
  store.dispatch(setTodos(todos))
}

// render
ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('container'))
