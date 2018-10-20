import Benchmark from 'benchmark'
import uuid from 'uuid/v4'
import * as R from 'ramda'

import subxStore from '../todomvc/subx'
import reduxStore, { add } from '../todomvc/redux'
import mobxStore from '../todomvc/mobx'

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
