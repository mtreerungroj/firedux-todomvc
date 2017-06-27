import React, { Component, PropTypes } from 'react'
import QuizItem from './QuizItem'
import Footer from './Footer'
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters'
import { firebaseToArray } from '../utils'
import store from '../store'

const QUIZ_FILTERS = {
  [SHOW_ALL]: () => true,
  [SHOW_ACTIVE]: quest => !quest.completed,
  [SHOW_COMPLETED]: quest => quest.completed
}

class MainSectionQuiz extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = { filter: SHOW_ALL }
  }

  handleClearCompleted() {
    this.props.actions.clearCompleted()
  }

  handleShow(filter) {
    this.setState({ filter })
  }

  renderToggleAll(completedCount) {
    const state = store.getState()
    const { actions } = this.props
    var { Quests } = this.props.firedux.data
    var quests = firebaseToArray(Quests)

    if (quests.length > 0) {
      return (
        <input className="toggle-all"
          type="checkbox"
          checked={completedCount === quests.length}
          onChange={actions.completeAll} />
      )
    }
  }

  renderFooter(completedCount) {
    var { Quests } = this.props.firedux.data
    var quests = firebaseToArray(Quests)
    const { filter } = this.state
    const activeCount = quests.length - completedCount

    if (quests.length) {
      return (
        <Footer completedCount={completedCount}
          activeCount={activeCount}
          filter={filter}
          onClearCompleted={this.handleClearCompleted.bind(this)}
          onShow={this.handleShow.bind(this)} />
      )
    }
  }

  render() {
    const { actions } = this.props
    const { filter } = this.state
    var { Quests } = this.props.firedux.data
    var quests = firebaseToArray(Quests)

    quests.sort(function (a, b) { return (b.updatedAt > a.updatedAt) ? 1 : ((a.updatedAt > b.updatedAt) ? -1 : 0); }) 

    const filteredQuizzes = quests.filter(QUIZ_FILTERS[filter])
    const completedCount = quests.reduce((count, quest) =>
      quest.completed ? count + 1 : count,
      0
    )

    return (
      <section className="main">
        {this.renderToggleAll(completedCount)}
        <ul className="todo-list">
          {filteredQuizzes.map(quest =>
            <QuizItem key={quest.id} quest={quest} {...actions} />
          )}
        </ul>
        {this.renderFooter(completedCount)}
      </section>
    )
  }
}

MainSectionQuiz.propTypes = {
  actions: PropTypes.object.isRequired,
  firedux: PropTypes.object.isRequired
}

export default MainSectionQuiz
