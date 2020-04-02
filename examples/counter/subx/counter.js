/* global SubX, ReactSubX, ReactDOM */
// store
const store = SubX.create({
  number: 0,
  decrease () {
    this.number -= 1
  },
  increase () {
    this.number += 1
  }
})

// component
class App extends ReactSubX.Component {
  render () {
    const store = this.props.store
    return (
      <div>
        <button onClick={e => store.decrease()}>-</button>
        <span>{store.number}</span>
        <button onClick={e => store.increase()}>+</button>
      </div>
    )
  }
}

// render
ReactDOM.render(<App store={store} />, document.getElementById('container'))
