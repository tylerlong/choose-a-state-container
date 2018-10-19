/* eslint-env jest */
import { observable, autorun } from 'mobx'

let count = 0
const calculator = observable.object({
  a: 1,
  b: 2,
  get add () {
    count += 1
    return this.a + this.b
  }
})

autorun(() => calculator.add) // just to add a observer

describe('Cache - MobX', () => {
  test('default', () => {
    expect(calculator.add).toBe(3)
    expect(calculator.add).toBe(3)
    expect(count).toBe(1)
    calculator.a = 2
    calculator.a = 3
    calculator.a = 4
    expect(calculator.add).toBe(6)
    expect(calculator.add).toBe(6)
    expect(count).toBe(4) // Oh no! count should be 2! So it re-compute every time because there is an observer? Not want I want
  })
})
