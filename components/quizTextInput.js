import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

class QuizTextInput extends Component {
  constructor(props, context) {
    super(props, context)
    let quest;
    if(props.quest != undefined) {
      quest = {
        subject: props.quest.subject,
        question: props.quest.question,
        answer: props.quest.choices['answer'],
        choice1: props.quest.choices['choice1'],
        choice2: props.quest.choices['choice2'],
      }
    } else { quest = {} }

    this.state = {
      subject: quest.subject || '',
      question: quest.question || '',
      answer: quest.answer || '',
      choice1: quest.choice1 || '',
      choice2: quest.choice2 || '',
      isEditing: {
        subject: false,
        question: false,
        answer: false,
        choice1: false,
        choice2: false
      }
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
    // if (e.which === 13) {
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
    // }
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleDoubleClick(form) {
    this.setState({ isEditing: { [form]: true } })
  }

  handleBlur(form) {
    if (!this.props.newQuiz) {
      let quiz = { [form]: this.state[form] }
      let isAnswer = false
      if (form == 'answer' || form == 'choice1' || form == 'choice2') isAnswer = true
      this.props.onSave(quiz, isAnswer)
      this.setState({ isEditing: { [form]: false } })
    }
  }

  renderForm(form) {
    if (this.state.isEditing[form] || this.props.newQuiz) {
      return (
        <div>
          {form}:
          <input className={
            classnames({
              edit: this.props.editing,
              'new-todo': this.props.newQuiz
            })}
            type="text"
            name={form}
            placeholder={form+"??"}
            value={this.state[form]}
            autoFocus="true"
            onChange={this.handleChange.bind(this)}
            onBlur={() => this.handleBlur(form)}
          />
        </div>
      )
    } else {
      return (
        <div className="view">
          <label onDoubleClick={() => this.handleDoubleClick(form)}>
            {form}: {this.state[form]}
          </label>
          <br />
        </div>
      )
    }
  }

  renderSubmitButton() {
    if (this.props.newQuiz) {
      return (
        <button onClick={() => this.handleSubmit()}>Submit</button>
      )
    }
  }

  render() {
    return (
      <div>
        {this.renderForm("subject")}
        {this.renderForm("question")}
        {this.renderForm("answer")}
        {this.renderForm("choice1")}
        {this.renderForm("choice2")}
        {this.props.newQuiz ? this.renderSubmitButton() : <br />}
      </div>
    )
  }
}

QuizTextInput.propTypes = {
  onSave: PropTypes.func.isRequired,
  quest: PropTypes.object,
  placeholder: PropTypes.array,
  editing: PropTypes.bool,
  newQuiz: PropTypes.bool
}

export default QuizTextInput
