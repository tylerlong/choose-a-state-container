/* global React, mobx, mobxReact, ReactDOM */
// store
const store = mobx.observable({
  number: 0,
  decrease () {
    this.number -= 1
  },
  increase () {
    this.number += 1
  }
})

// component
class App extends React.Component {
  render () {
    const store = this.props.store
    return <div>
      <button onClick={e => store.decrease()}>-</button>
      <span>{store.number}</span>
      <button onClick={e => store.increase()}>+</button>
    </div>
  }
}

// observe
const ObservedApp = mobxReact.observer(App)

// render
ReactDOM.render(<ObservedApp store={store} />, document.getElementById('container'))
