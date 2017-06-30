import React, { Component, PropTypes } from 'react'
import { BrowserRouter, Route, Link, Redirect, Switch } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as QuizActions from '../actions'
import { AUTH } from '../constants/enum.js'
import Leaderboard from '../components/Leaderboard'
import MyQuiz from '../components/protected/MyQuiz'

class App extends Component {
  constructor() {
    super();
    this.state = {
      authed: false,
      authState: AUTH.CHECKING,
    }
  }

  componentDidMount() {
    this.props.actions.init().then(res => {
      if (res) this.setState({ authed: true })
    })
  }

  handleLogin() {
    this.props.actions.login().then(res => {
      if (res) this.setState({ authed: true })
    })
  }

  handleLogout() {
    this.props.actions.logout().then(res => {
      if (res == undefined) this.setState({ authed: false })
    })
  }

  render() {
    const { actions, firedux } = this.props
    return (
      <BrowserRouter>
        <div>
          <Link to="/">Leaderboard</Link><br />
          {
            !this.state.authed ? (
              <button onClick={() => this.handleLogin()}>Login with Facebook</button>
            ) : (
                <div>
                  <span> name: {this.props.firedux.authData && this.props.firedux.authData.user.displayName} </span><br />
                  <Link to="/myQuiz">My Quiz</Link><br />
                  <button onClick={() => this.handleLogout()}>Logout</button>
                </div>
              )
          }
          <Switch>
            <Route exact path="/"
              component={(props) => <Leaderboard firedux={firedux} {...props} />} />
            <Route exact path="/myQuiz"
              component={(props) => <MyQuiz firedux={firedux} actions={actions} {...props} />} />
            <Route render={() => <h3>No Match</h3>} />
          </Switch>
        </div>
      </BrowserRouter >
    );
  }
}

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
