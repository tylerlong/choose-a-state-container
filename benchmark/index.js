import Benchmark from 'benchmark'

import subxStore from './subx'
import reduxStore, { add } from './redux'
import mobxStore from './mobx'

const suite = new Benchmark.Suite()

suite
  .add('subx', () => {
    subxStore.add('todo 1')
  })
  .add('redux', () => {
    reduxStore.dispatch(add('todo 1'))
  })
  .add('mobx', () => {
    mobxStore.add('todo 1')
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run()
