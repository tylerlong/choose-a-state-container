/* eslint-env jest */
import { observable, computed, autorun, decorate, action } from 'mobx'

describe('MobX decorator', () => {
  test('@decorator', () => {
    let count = 0
    class Calculator {
      @observable a = 1
      @observable b = 2
      @computed get sum () {
        count += 1
        return this.a + this.b
      }
      @action changeA (a) {
        this.a = a
      }
    }
    const calculator = new Calculator()
    autorun(() => calculator.sum)
    expect(calculator.sum).toBe(3)
    expect(calculator.sum).toBe(3)
    expect(calculator.sum).toBe(3)
    expect(count).toBe(1)
    calculator.changeA(2)
    expect(calculator.sum).toBe(4)
    expect(count).toBe(2)
  })

  test('decorate()', () => {
    let count = 0
    class Calculator {
      a = 1
      b = 2
      get sum () {
        count += 1
        return this.a + this.b
      }
      changeA (a) {
        this.a = a
      }
    }
    decorate(Calculator, {
      a: observable,
      b: observable,
      sum: computed,
      changeA: action
    })
    const calculator = new Calculator()
    autorun(() => calculator.sum)
    expect(calculator.sum).toBe(3)
    expect(calculator.sum).toBe(3)
    expect(calculator.sum).toBe(3)
    expect(count).toBe(1)
    calculator.changeA(2)
    expect(calculator.sum).toBe(4)
    expect(count).toBe(2)
  })

  test('@decorator + keepAlive', () => {
    let count = 0
    class Calculator {
      @observable a = 1
      @observable b = 2
      @computed({ keepAlive: true }) get sum () {
        count += 1
        return this.a + this.b
      }
      @action changeA (a) {
        this.a = a
      }
    }
    const calculator = new Calculator()
    expect(calculator.sum).toBe(3)
    expect(calculator.sum).toBe(3)
    expect(calculator.sum).toBe(3)
    expect(count).toBe(1)
    calculator.changeA(2)
    expect(calculator.sum).toBe(4)
    expect(count).toBe(2)
  })

  test('decorate() + keepAlive', () => {
    let count = 0
    class Calculator {
      a = 1
      b = 2
      get sum () {
        count += 1
        return this.a + this.b
      }
      changeA (a) {
        this.a = a
      }
    }
    decorate(Calculator, {
      a: observable,
      b: observable,
      sum: computed({ keepAlive: true }),
      changeA: action
    })
    const calculator = new Calculator()
    expect(calculator.sum).toBe(3)
    expect(calculator.sum).toBe(3)
    expect(calculator.sum).toBe(3)
    expect(count).toBe(1)
    calculator.changeA(2)
    expect(calculator.sum).toBe(4)
    expect(count).toBe(2)
  })
})
