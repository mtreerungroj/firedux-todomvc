import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Header from '../components/Header'
import HeaderQuiz from '../components/HeaderQuiz'
import MainSection from '../components/MainSection'
import LoginSection from '../components/LoginSection'
import * as TodoActions from '../actions'

class App extends Component {
  render() {
    const { todos, actions, firedux } = this.props
    return (
      <div>
        <HeaderQuiz addQuiz={actions.addQuiz} />
      </div>
    )
  }
}
// <Header addTodo={actions.addTodo} />
// <MainSection todos={todos} actions={actions} firedux={firedux} />

App.propTypes = {
  actions: PropTypes.object.isRequired,
  firedux: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    firedux: state.firedux
  }
}


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(TodoActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
