import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

class TodoTextInput extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      // subject: this.props.quiz.subject || '',
      // question: this.props.quiz.question || '',
      // answer: this.props.quiz.answer || '',
      // choice1: this.props.quiz.choice1 || '',
      // choice2: this.props.quiz.choice2 || '',
      subject: '',
      question: '',
      answer: '',
      choice1: '',
      choice2: '',
    }
  }

  handleSubmit(e) {
    const quiz = {
      subject: this.state.subject,
      question: this.state.question,
      answer: this.state.answer,
      choice1: this.state.choice1,
      choice2: this.state.choice2,
    }
    if (e.which === 13) {
      this.props.onSave(quiz)
      if (this.props.newQuiz) {
        this.setState({
          subject: '',
          question: '',
          answer: '',
          choice1: '',
          choice2: '',
        })
      }
    }
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleBlur(e) {
    if (!this.props.newQuiz) {
      this.props.onSave(e.target.value)
    }
  }

  render() {
    return (
      <div>
        Subject:
        <input className={
          classnames({
            edit: this.props.editing,
            'new-todo': this.props.newQuiz
          })}
          type="text"
          name="subject"
          placeholder={this.props.placeholder[0]}
          autoFocus="true"
          value={this.state.subject}
          onBlur={this.handleBlur.bind(this)}
          onChange={this.handleChange.bind(this)} />

        Question:
        <input className={
          classnames({
            edit: this.props.editing,
            'new-todo': this.props.newQuiz
          })}
          type="text"
          name="question"
          placeholder={this.props.placeholder[1]}
          autoFocus="true"
          value={this.state.question}
          onBlur={this.handleBlur.bind(this)}
          onChange={this.handleChange.bind(this)} />

        Answer:
        <input className={
          classnames({
            edit: this.props.editing,
            'new-todo': this.props.newQuiz
          })}
          type="text"
          name="answer"
          placeholder={this.props.placeholder[2]}
          autoFocus="true"
          value={this.state.answer}
          onBlur={this.handleBlur.bind(this)}
          onChange={this.handleChange.bind(this)} />

        Choice1:
        <input className={
          classnames({
            edit: this.props.editing,
            'new-todo': this.props.newQuiz
          })}
          type="text"
          name="choice1"
          placeholder={this.props.placeholder[3]}
          autoFocus="true"
          value={this.state.choice1}
          onBlur={this.handleBlur.bind(this)}
          onChange={this.handleChange.bind(this)} />

        Choice2:
        <input className={
          classnames({
            edit: this.props.editing,
            'new-todo': this.props.newQuiz
          })}
          type="text"
          name="choice2"
          placeholder={this.props.placeholder[4]}
          autoFocus="true"
          value={this.state.choice2}
          onBlur={this.handleBlur.bind(this)}
          onChange={this.handleChange.bind(this)}
          onKeyDown={this.handleSubmit.bind(this)} />
      </div>
    )
  }
}

TodoTextInput.propTypes = {
  onSave: PropTypes.func.isRequired,
  // quiz: PropTypes.object,
  placeholder: PropTypes.array,
  editing: PropTypes.bool,
  newQuiz: PropTypes.bool
}

export default TodoTextInput
