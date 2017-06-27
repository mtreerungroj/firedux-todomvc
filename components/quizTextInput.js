import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

class QuizTextInput extends Component {
  constructor(props, context) {
    super(props, context)
    let quest;
    if(props.quest != undefined) {
    // console.log("val=", props.quest.val())
      quest = {
        subject: props.quest.subject,
        question: props.quest.question,
        choice_0: props.quest.choices[0],
        choice_1: props.quest.choices[1],
        choice_2: props.quest.choices[2],
      }
    } else { quest = {} }

    this.state = {
      subject: quest.subject || '',
      question: quest.question || '',
      choice_0: quest.choice_0 || '',
      choice_1: quest.choice_1 || '',
      choice_2: quest.choice_2 || '',
      isEditing: {
        subject: false,
        question: false,
        choice_0: false,
        choice_1: false,
        choice_2: false
      }
    }
  }

  handleSubmit(e) {
    const quiz = {
      subject: this.state.subject,
      question: this.state.question,
      choice_0: this.state.choice_0,
      choice_1: this.state.choice_1,
      choice_2: this.state.choice_2,
    }
    // if (e.which === 13) {
    this.props.onSave(quiz)
    if (this.props.newQuiz) {
      this.setState({
        subject: '',
        question: '',
        choice_0: '',
        choice_1: '',
        choice_2: '',
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
      let keys = form.split('_')
      let quiz = (keys[0] === 'choice') ? { [keys[1]] : this.state[form] } : { [form]: this.state[form] }
      
      let isAnswer = false
      if (form == 'choice_0' || form == 'choice_1' || form == 'choice_2') isAnswer = true
      
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
        {this.renderForm("choice_0")}
        {this.renderForm("choice_1")}
        {this.renderForm("choice_2")}
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
