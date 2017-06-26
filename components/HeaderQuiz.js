import React, { PropTypes, Component } from 'react'
import QuizTextInput from './QuizTextInput'
import store from '../store'

class HeaderQuiz extends Component {
  handleSave(quiz) {
    if (quiz) {
      this.props.addQuiz(quiz)
    }
  }

  render() {
    return (
      <header className="header">
        <h1>Quiz Chatbot</h1>
        <QuizTextInput newQuiz
          onSave={this.handleSave.bind(this)}
          placeholder="Insert your quiz" />
      </header>
    )
  }
}

HeaderQuiz.propTypes = {
  addQuiz: PropTypes.func.isRequired
}

export default HeaderQuiz
