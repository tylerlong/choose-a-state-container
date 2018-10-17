import Benchmark from 'benchmark'

import subxStore from './subx'
import reduxStore, { add } from './redux'
import mobxStore from './mobx'

const suite = new Benchmark.Suite()

suite
  .add('subx', () => {
    const store = subxStore
    store.add('todo 1')
    store.add('todo 2')
    store.add('todo 3')
  })
  .add('redux', () => {
    const store = reduxStore
    store.dispatch(add('todo 1'))
    store.dispatch(add('todo 2'))
    store.dispatch(add('todo 3'))
  })
  .add('mobx', () => {
    const store = mobxStore
    store.add('todo 1')
    store.add('todo 2')
    store.add('todo 3')
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run()
