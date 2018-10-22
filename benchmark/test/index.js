import Benchmark from 'benchmark'
import * as R from 'ramda'

let id = 0
const uuid = () => ++id

let a = []
const suite1 = new Benchmark.Suite()
suite1
  .add('array push', () => {
    R.range(0, 1000).forEach(i => a.push(uuid()))
    a = []
  })
  .add('array shift', () => {
    R.range(0, 500).forEach(i => a.shift())
    R.range(0, 500).forEach(i => a.push(uuid()))
  })
  .add('array pop', () => {
    R.range(0, 500).forEach(i => a.pop())
    R.range(0, 500).forEach(i => a.push(uuid()))
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run()
