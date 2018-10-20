/* eslint-env jest */
import SubX from 'subx'
import { observable, autorun, computed, decorate } from 'mobx'
import { createStore } from 'redux'
import { createSelector } from 'reselect'

describe('delete property', () => {
  test('SubX', () => {
    const store = SubX.create({
      a: 1,
      b: 2,
      get sum () {
        return this.a && this.b ? this.a + this.b : NaN
      }
    })
    expect(store.sum).toBe(3)
    delete store.a
    expect(store.sum).toBe(NaN) // Correct!
  })

  test('SubX OOP Style', () => {
    const Store = new SubX({
      a: 1,
      b: 2,
      get sum () {
        return this.a && this.b ? this.a + this.b : NaN
      }
    })
    const store = new Store()
    expect(store.sum).toBe(3)
    delete store.a
    expect(store.sum).toBe(NaN) // Correct!
  })

  test('Redux', () => {
    const reducer = (state = { a: 1, b: 2 }, action) => {
      if (action.type === 'DELETE_A') {
        return { b: state.b }
      }
      return state
    }
    const store = createStore(reducer)
    const aSelector = state => state.a
    const bSelector = state => state.b
    const sumSelector = createSelector(
      aSelector, bSelector,
      (a, b) => a && b ? a + b : NaN
    )
    expect(sumSelector(store.getState())).toBe(3)
    store.dispatch({ type: 'DELETE_A' })
    expect(sumSelector(store.getState())).toBe(NaN) // Correct!
  })

  test('mobx + @decorator + autorun', () => {
    class Store {
      @observable a = 1
      @observable b = 2
      @computed get sum () {
        return this.a && this.b ? this.a + this.b : NaN
      }
    }
    const store = new Store()
    autorun(() => store.sum)
    expect(store.sum).toBe(3)
    delete store.a
    expect(store.sum).toBe(3) // Wrong!
  })

  test('mobx + @decorator - autorun', () => {
    class Store {
      @observable a = 1
      @observable b = 2
      @computed get sum () {
        return this.a && this.b ? this.a + this.b : NaN
      }
    }
    const store = new Store()
    expect(store.sum).toBe(3)
    delete store.a
    expect(() => expect(store.sum).toBe(3)).toThrow(RangeError) // Maximum call stack size exceeded
  })

  test('mobx + decorate() + autorun', () => {
    class Store {
      a = 1
      b = 2
      get sum () {
        if (this.a && this.b) {
          return this.a + this.b
        }
        return NaN
      }
    }
    decorate(Store, {
      a: observable,
      b: observable,
      sum: computed
    })
    const store = new Store()
    autorun(() => store.sum)
    expect(store.sum).toBe(3)
    delete store.a
    expect(store.sum).toBe(3) // Wrong!
  })

  test('mobx + decorate() - autorun', () => {
    class Store {
      a = 1
      b = 2
      get sum () {
        if (this.a && this.b) {
          return this.a + this.b
        }
        return NaN
      }
    }
    decorate(Store, {
      a: observable,
      b: observable,
      sum: computed
    })
    const store = new Store()
    expect(store.sum).toBe(3)
    delete store.a
    expect(() => expect(store.sum).toBe(3)).toThrow(RangeError) // Maximum call stack size exceeded
  })

  test('MobX + observable.object', () => {
    const store = observable.object({
      a: 1,
      b: 2,
      get sum () {
        return this.a && this.b ? this.a + this.b : NaN
      }
    })
    autorun(() => store.sum)
    expect(store.sum).toBe(3)
    delete store.a
    expect(store.sum).toBe(NaN) // Correct!
  })
})
