import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Leaderboard from '../components/Leaderboard'
import HeaderQuiz from '../components/HeaderQuiz'
import MainSectionQuiz from '../components/MainSectionQuiz'
import * as QuizActions from '../actions'

class App extends Component {
  render() {
    const { actions, firedux } = this.props
    return (
      <div>
        <Leaderboard firedux={firedux} />
        <br /><br />
        <HeaderQuiz addQuiz={actions.addQuiz} />
        Your Questions:
        <MainSectionQuiz actions={actions} firedux={firedux} />
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
  return { firedux: state.firedux }
}


function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(QuizActions, dispatch) }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
