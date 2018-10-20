/* global React, mobx, mobxReact, ReactDOM */
// store
const store = mobx.observable.object({
  number: 0,
  decrease () {
    this.number -= 1
  },
  increase () {
    this.number += 1
  }
})

// component
class _App extends React.Component {
  render () {
    const store = this.props.store
    return <div>
      <button onClick={e => store.decrease()}>-</button>
      <span>{store.number}</span>
      <button onClick={e => store.increase()}>+</button>
    </div>
  }
}
const App = mobxReact.observer(_App)

// render
ReactDOM.render(<App store={store} />, document.getElementById('container'))
