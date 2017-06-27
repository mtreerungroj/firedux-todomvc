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

  handleSave(id, quiz) {
    this.props.editQuiz(`${id}`, quiz)
    // this.setState({ editing: false })
  }

  render() {
    const { quest, completeTodo, deleteQuiz } = this.props
    let element = (
      <div>
      <QuizTextInput quest={quest}
        onSave={(quiz) => this.handleSave(quest.id, quiz)} />
      <button className="destroy"
        onClick={() => deleteQuiz(quest.id)} />
      </div>
    )

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