import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

class QuizTextInput extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      owner: '',
      subject: '',
      question: '',
      answer: '',
      choice1: '',
      choice2: ''
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state != null) {
      const quiz = {
        owner: '5LrhuhQtqDfempxq8B9zGpqiiK42',
        subject: this.state.subject,
        question: this.state.question,
        answer: this.state.answer,
        choice1: this.state.choice1,
        choice2: this.state.choice2
      }
      this.props.onSave(quiz)
      if (this.props.newQuiz) {
        this.setState({
          owner: '',
          subject: '',
          question: '',
          answer: '',
          choice1: '',
          choice2: ''
        })
      }
    } else {
      console.log("Your state is null")
    }
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          Subject:
        <input
            type="text"
            placeholder="subject?"
            autoFocus="true"
            value={this.state.subject}
            onChange={this.handleChange.bind(this)}
          />
          <br />
          Question:
        <input
            type="text"
            placeholder="question?"
            value={this.state.question}
            onChange={this.handleChange.bind(this)}
          />
          <br />
          Answer:
        <input
            type="text"
            placeholder="answer?"
            value={this.state.answer}
            onChange={this.handleChange.bind(this)}
          />
          <br />
          Choice1:
        <input
            type="text"
            placeholder="choice1?"
            value={this.state.choice1}
            onChange={this.handleChange.bind(this)}
          />
          <br />
          Choice2:
        <input
            type="text"
            placeholder="choice2?"
            value={this.state.choice2}
            onChange={this.handleChange.bind(this)}
          />
          <br />
          <button>Add Quiz</button>
        </form>
      </div>
    )
  }
}

QuizTextInput.propTypes = {
  onSave: PropTypes.func.isRequired,
  // text: PropTypes.string,
  placeholder: PropTypes.string,
  editing: PropTypes.bool,
  newQuiz: PropTypes.bool
}

export default QuizTextInput
