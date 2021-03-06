/* eslint-env jest */
import { observable, autorun } from 'mobx'

describe('Cache - MobX', () => {
  test('with observer', () => {
    let count = 0
    const calculator = observable.object({
      a: 1,
      b: 2,
      get sum () {
        count += 1
        return this.a + this.b
      }
    })
    autorun(() => calculator.sum) // just to add a observer
    expect(calculator.sum).toBe(3)
    expect(calculator.sum).toBe(3)
    expect(count).toBe(1)
    calculator.a = 2
    calculator.a = 3
    calculator.a = 4
    expect(calculator.sum).toBe(6)
    expect(calculator.sum).toBe(6)
    expect(count).toBe(4) // Oh no! It re-computes every time because there is an observer?!
  })

  test('without observer', () => {
    let count = 0
    const calculator = observable.object({
      a: 1,
      b: 2,
      get sum () {
        count += 1
        return this.a + this.b
      }
    })
    expect(calculator.sum).toBe(3)
    expect(calculator.sum).toBe(3)
    expect(count).toBe(2) // no cache, sadly
    calculator.a = 2
    calculator.a = 3
    calculator.a = 4
    expect(calculator.sum).toBe(6)
    expect(calculator.sum).toBe(6)
    expect(count).toBe(4) // no cache, sadly
  })
})
