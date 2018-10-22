import { createSelector } from 'reselect'
import * as R from 'ramda'
import { combineReducers, createStore } from 'redux'
import hyperid from 'hyperid'

const uuid = hyperid()

// selectors
const todosSelector = state => state.todos
const visibilitySelector = state => state.visibility
export const lengthSelector = createSelector(
  todosSelector,
  todos => todos.length
)
export const visibleTodosSelector = createSelector(
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
export const areAllDoneSelector = createSelector(
  todosSelector,
  todos => R.all(todo => todo.completed, todos)
)
export const leftCountSelector = createSelector(
  todosSelector,
  todos => todos.filter(todo => !todo.completed).length
)
export const doneCountSelector = createSelector(
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
      // return [...todos.slice(0, index5), { ...todo5, completed: action.completed }, ...todos.slice(index5)]
      return R.set(R.lensPath([index5]), { ...todo5, completed: action.completed }, todos)
    case SET_TITLE:
      const index6 = R.findIndex(t => t.id === action.id, todos)
      const todo6 = todos[index6]
      // return [...todos.slice(0, index6), { ...todo6, title: action.title }, ...todos.slice(index6)]
      return R.set(R.lensPath([index6]), { ...todo6, title: action.title }, todos)
    default:
      return todos
  }
}
const reducer = combineReducers({
  visibility: visibilityReducer,
  todos: todosReducer
})

// store
const store = createStore(reducer)

// actions
export const add = title => ({ type: ADD, title })
export const toggleAll = () => ({ type: TOGGLE_ALL })
export const edit = id => ({ type: EDIT, id })
export const remove = id => ({ type: REMOVE, id })
export const doneEdit = id => ({ type: DONE_EDIT, id })
export const cancelEdit = id => ({ type: CANCEL_EDIT, id })
export const clearCompleted = () => ({ type: CLEAR_COMPLETED })
export const setTodos = todos => ({ type: SET_TODOS, todos })
export const setVisibility = visibility => ({ type: SET_VISIBILITY, visibility })
export const setCompleted = (id, completed) => ({ type: SET_COMPLETED, id, completed })
export const setTitle = (id, title) => ({ type: SET_TITLE, id, title })

export default store
