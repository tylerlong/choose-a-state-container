/* eslint-env jest */
import { createStore } from 'redux'
import { createSelector } from 'reselect'

let count = 0
const aSelector = state => state.a
const bSelector = state => state.b
const sumSelector = createSelector(
  aSelector, bSelector,
  (a, b) => {
    count += 1
    return a + b
  }
)

const intialState = { a: 1, b: 2 }
const CHANGE_A = 'CHANGE_A'
const reducer = (state = intialState, action) => {
  switch (action.type) {
    case CHANGE_A:
      return { ...state, a: action.a }
    default:
      return state
  }
}
const store = createStore(reducer)

const changeA = a => ({ type: CHANGE_A, a })

describe('Cache - Redux', () => {
  test('default', () => {
    expect(sumSelector(store.getState())).toBe(3)
    expect(sumSelector(store.getState())).toBe(3)
    expect(count).toBe(1)
    store.dispatch(changeA(2))
    store.dispatch(changeA(3))
    store.dispatch(changeA(4))
    expect(sumSelector(store.getState())).toBe(6)
    expect(sumSelector(store.getState())).toBe(6)
    expect(count).toBe(2) // `sum` only executes twice because of cache
  })
})
