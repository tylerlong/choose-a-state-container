/* eslint-env jest */
import SubX from 'subx'

let count = 0
const calculator = SubX.create({
  a: 1,
  b: 2,
  get sum () {
    count += 1
    return this.a + this.b
  }
})

describe('Cache - SubX', () => {
  test('default', () => {
    expect(calculator.sum).toBe(3)
    expect(calculator.sum).toBe(3)
    expect(count).toBe(1)
    calculator.a = 2
    calculator.a = 3
    calculator.a = 4
    expect(calculator.sum).toBe(6)
    expect(calculator.sum).toBe(6)
    expect(count).toBe(2) // `sum` only executes twice because of cache
  })
})
