import React, { PropTypes, Component } from 'react'
import store from '../store'

class LoginSection extends Component {
  handleSubmit(e) {
    e.preventDefault()
    console.log("handleSubmit")
    this.props.login(this.email.value, this.password.value)
    // .then((authData) => {
    //   console.log("authData: ", authData)
    // })
    // .catch((error) => {
    //   console.log("error: ", error)
    // })
  }

  render() {
    return (
      <div>
        <h2> Login </h2>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div >
            <label>Email</label>
            <input
              placeholder="Email"
              ref={(email) => this.email = email}
            />
          </div>
          <div >
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              ref={(password) => this.password = password}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    )
  }
}

LoginSection.propTypes = {
  login: PropTypes.func.isRequired
}

export default LoginSection
