import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import QuizInput from './QuizInput'

class QuizItem extends Component {
  constructor(props, context) {
    super(props, context)
  }

  handleSave(id, quiz, isAnswer) {
    this.props.editQuiz(`${id}`, quiz, isAnswer)
  }

  render() {
    const { quest, completeTodo, deleteQuiz } = this.props
    let element = (
      <div>
        <QuizInput
          quest={quest}
          onSave={(quiz, isAnswer) => this.handleSave(quest.id, quiz, isAnswer)} />
        <button
          className="destroy"
          onClick={() => deleteQuiz(quest.id)} />
      </div>
    )

    return (
      <li className={classnames({ completed: quest.completed })}>
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