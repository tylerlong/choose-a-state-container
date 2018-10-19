import Benchmark from 'benchmark'
import uuid from 'uuid/v4'
import * as R from 'ramda'

import subxStore from './subx'
import reduxStore, { add } from './redux'
import mobxStore from './mobx'

const suite = new Benchmark.Suite()

suite
  .add('SubX', () => {
    R.range(0, 100).forEach(i => subxStore.add(`todo ${uuid()}`))
  })
  .add('Redux', () => {
    R.range(0, 100).forEach(i => reduxStore.dispatch(add(`todo ${uuid()}`)))
  })
  .add('MobX', () => {
    R.range(0, 100).forEach(i => mobxStore.add(`todo ${uuid()}`))
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run()
