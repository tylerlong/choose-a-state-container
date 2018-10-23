/* global React, ReactDOM */
// component
class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = { number: 0 }
  }
  render () {
    return <div>
      <button onClick={e => this.setState({ number: this.state.number - 1 })}>-</button>
      <span>{this.state.number}</span>
      <button onClick={e => this.setState({ number: this.state.number + 1 })}>+</button>
    </div>
  }
}

// render
ReactDOM.render(<App />, document.getElementById('container'))
