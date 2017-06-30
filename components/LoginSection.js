// import React, { Component, PropTypes } from 'react'
// import { connect } from 'react-redux'
// import { firebaseConnect, isLoaded, isEmpty, pathToJS } from 'react-redux-firebase'

// // UserIsNotAuthenticated // redirect to list page if logged in
// firebaseConnect() // add this.props.firebase
// connect( // map redux state to props
//   ({ firebase }) => ({
//     authError: pathToJS(firebase, 'authError')
//   })
// )
// class LoginSection extends Component {

//   // handleLogin(loginData) {
//   // return this.props.firebase.login(loginData)
//   // }

//   providerLogin(provider) {
//     this.handleLogin({ provider })
//   }
//   // <button onClick={() => this.providerLogin('google')}>Login with Facebook</button>

//   render() {
//     return (
//       <div>
//         Login Me
//       </div>
//     )
//   }
// }

// LoginSection.propTypes = {
//   firebase: PropTypes.shape({
//     login: PropTypes.func.isRequired
//   })
// }

// export default LoginSection