import Benchmark from 'benchmark'
import uuid from 'uuid/v1'
import * as R from 'ramda'

import { resetStores } from './shared'
import subxStore from '../todomvc/subx'
import reduxStore, { add, setCompleted, setTitle, remove } from '../todomvc/redux'
import mobxStore from '../todomvc/mobx'

// benchmark adding todos
resetStores()
const suite1 = new Benchmark.Suite()
suite1
  .add('SubX adding todos', () => {
    R.range(0, 100).forEach(i => subxStore.add(`todo ${uuid()}`))
  })
  .add('Redux adding todos', () => {
    R.range(0, 100).forEach(i => reduxStore.dispatch(add(`todo ${uuid()}`)))
  })
  .add('MobX adding todos', () => {
    R.range(0, 100).forEach(i => mobxStore.add(`todo ${uuid()}`))
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run()

// benchmark editing todos
resetStores()
R.range(0, 1000).forEach(i => subxStore.add(`todo ${uuid()}`))
R.range(0, 1000).forEach(i => reduxStore.dispatch(add(`todo ${uuid()}`)))
R.range(0, 1000).forEach(i => mobxStore.add(`todo ${uuid()}`))
const suite2 = new Benchmark.Suite()
suite2
  .add('SubX editing todos', () => {
    const todos = subxStore.todos
    R.range(0, 1000).forEach(i => {
      const todo = todos[i]
      todo.title = `todo ${uuid()}`
      todo.completed = Math.random() >= 0.5
    })
  })
  .add('Redux editing todos', () => {
    const todos = reduxStore.getState().todos
    R.range(0, 1000).forEach(i => {
      const id = todos[i].id
      reduxStore.dispatch(setTitle(id, `todo ${uuid()}`))
      reduxStore.dispatch(setCompleted(id, Math.random() >= 0.5))
    })
  })
  .add('MobX editing todos', () => {
    const todos = mobxStore.todos
    R.range(0, 1000).forEach(i => {
      const todo = todos[i]
      todo.title = `todo ${uuid()}`
      todo.completed = Math.random() >= 0.5
    })
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run()

// benchmark deleting & re-adding todos
resetStores()
R.range(0, 100).forEach(i => subxStore.add(`todo ${uuid()}`))
R.range(0, 100).forEach(i => reduxStore.dispatch(add(`todo ${uuid()}`)))
R.range(0, 100).forEach(i => mobxStore.add(`todo ${uuid()}`))
const suite3 = new Benchmark.Suite()
suite3
  .add('SubX deleting & re-adding todos', () => {
    const todos = subxStore.todos
    R.range(0, 50).forEach(i => {
      const index = Math.floor(Math.random() * todos.length)
      subxStore.remove(todos[index])
    })
    R.range(0, 50).forEach(i => subxStore.add(`todo ${uuid()}`))
  })
  .add('Redux deleting & re-adding todos', () => {
    R.range(0, 50).forEach(i => {
      const todos = reduxStore.getState().todos
      const index = Math.floor(Math.random() * todos.length)
      reduxStore.dispatch(remove(todos[index].id))
    })
    R.range(0, 50).forEach(i => reduxStore.dispatch(add(`todo ${uuid()}`)))
  })
  .add('MobX deleting & re-adding todos', () => {
    const todos = mobxStore.todos
    R.range(0, 50).forEach(i => {
      const index = Math.floor(Math.random() * todos.length)
      mobxStore.remove(todos[index])
    })
    R.range(0, 50).forEach(i => mobxStore.add(`todo ${uuid()}`))
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run()
