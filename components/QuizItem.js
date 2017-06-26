import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import QuizTextInput from './QuizTextInput'

class QuizItem extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      editing: false
    }
  }

  handleDoubleClick() {
    console.log("set editing: true")
    this.setState({ editing: true })
  }

  handleSave(id, quiz) {
    this.props.editQuiz(id, quiz)
    console.log("set editing: false")
    this.setState({ editing: false })
  }

  render() {
    const { quest, completeTodo, deleteQuiz } = this.props

    let element
    if (this.state.editing) {
      element = (
        <QuizTextInput quest={quest}
          editing={this.state.editing}
          onSave={(quiz) => this.handleSave(quest.id, quiz)} />
      )
    } else {
      element = (
        <div className="view">
          <label onDoubleClick={this.handleDoubleClick.bind(this)}>
            Subject: {quest.subject} <br />
            Question: {quest.question} <br />
            Answer: {quest.answers[0]} <br />
          </label>
          <button className="destroy"
            onClick={() => deleteQuiz(quest.id)} />
        </div>
      )
    }

    return (
      <li className={classnames({
        completed: quest.completed,
        editing: this.state.editing
      })}>
        {element}
      </li>
    )
  }
}

QuizItem.propTypes = {
  quest: PropTypes.object.isRequired,
  editQuiz: PropTypes.func.isRequired,
  deleteQuiz: PropTypes.func.isRequired,
}

export default QuizItem
