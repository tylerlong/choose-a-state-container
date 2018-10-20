/* eslint-env jest */
import { observable, autorun } from 'mobx'

describe('dynamic property', () => {
  test('MobX + observable.object', () => {
    let count = 0
    const store = observable.object({
      a: 1,
      get sum () {
        count += 1
        return this.a && this.b ? this.a + this.b : NaN
      }
    })
    autorun(() => store.sum)
    expect(count).toBe(1)
    expect(store.sum).toBe(NaN)
    expect(count).toBe(1)
    store.b = 2
    expect(count).toBe(2)
    expect(store.sum).toBe(3)
    expect(store.sum).toBe(3)
    expect(count).toBe(2)
  })

  test('nested property', () => {
    let count1 = 0
    let count2 = 0
    const store = observable.object({
      todos: [],
      visibility: 'all',
      get doneCount () {
        count1 += 1
        return this.todos.filter(todo => todo.completed).length
      },
      get activeCount () {
        count2 += 1
        return this.todos.filter(todo => !todo.completed).length
      }
    })
    autorun(() => store.doneCount)
    autorun(() => store.activeCount)
    expect(store.doneCount).toBe(0)
    expect(store.activeCount).toBe(0)
    store.todos.push({ id: 1, title: '111', completed: false })
    expect(store.doneCount).toBe(0)
    expect(store.activeCount).toBe(1)
    store.todos.push({ id: 2, title: '222', completed: true })
    expect(store.doneCount).toBe(1)
    expect(store.activeCount).toBe(1)
    store.todos[0].completed = true
    store.todos[0].completed = false
    store.todos[0].completed = true
    store.todos[0].completed = false
    store.todos[0].completed = true
    expect(store.doneCount).toBe(2)
    expect(store.activeCount).toBe(0)
    expect(count1).toBe(8)
    expect(count2).toBe(8)
    expect(store.doneCount).toBe(2)
    expect(store.activeCount).toBe(0)
    expect(count1).toBe(8)
    expect(count2).toBe(8)
  })
})
