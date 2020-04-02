/* eslint-env jest */
import { observable } from '@nx-js/observer-util'

let count = 0
const calculator = observable({
  a: 1,
  b: 2,
  get sum () {
    count += 1
    return this.a + this.b
  }
})

describe('Cache - @nx-js/observer-util', () => {
  test('default', () => {
    expect(calculator.sum).toBe(3)
    expect(calculator.sum).toBe(3)
    expect(count).toBe(2) // no cache? it should be 1
    calculator.a = 2
    calculator.a = 3
    calculator.a = 4
    expect(calculator.sum).toBe(6)
    expect(calculator.sum).toBe(6)
    expect(count).toBe(4) // no cache? it shoudl be 2
  })
})
