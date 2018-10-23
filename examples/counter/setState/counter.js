/* global React, ReactDOM */
// component
class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = { number: 0 }
    this.decrease = this.decrease.bind(this)
    this.increase = this.increase.bind(this)
  }
  decrease () {
    this.setState({ number: this.state.number - 1 })
  }
  increase () {
    this.setState({ number: this.state.number + 1 })
  }
  render () {
    return <div>
      <button onClick={this.decrease}>-</button>
      <span>{this.state.number}</span>
      <button onClick={this.increase}>+</button>
    </div>
  }
}

// render
ReactDOM.render(<App />, document.getElementById('container'))
