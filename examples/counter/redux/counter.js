/* global React, Redux, ReactRedux, ReactDOM */
const { Provider } = ReactRedux

// reducer
const INCREMENT = 'INCREMENT'
const DECREMENT = 'DECREMENT'
const initialState = { number: 0 }
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT:
      return { ...state, number: state.number + 1 }
    case DECREMENT:
      return { ...state, number: state.number - 1 }
    default:
      return state
  }
}

// store
const store = Redux.createStore(reducer)

// actions
const increase = () => ({ type: INCREMENT })
const decrease = () => ({ type: DECREMENT })

// component
class _App extends React.Component {
  render () {
    const { number, increase, decrease } = this.props
    return <div>
      <button onClick={e => decrease()}>-</button>
      <span>{number}</span>
      <button onClick={e => increase()}>+</button>
    </div>
  }
}
const App = ReactRedux.connect(
  state => ({ number: state.number }),
  { increase, decrease }
)(_App)

// render
ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('container'))
