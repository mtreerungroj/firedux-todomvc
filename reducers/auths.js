import * as types from '../constants/ActionTypes'
import { firebaseApp as firebase } from '../store/firedux'

console.log("firebase=", firebase)
// const initialState = [
//   {
//     text: 'Use Redux',
//     completed: false,
//     id: 0
//   }
// ]

function handleLogin() {
  // const { dispatch } = this
  // const that = this
  return new Promise((resolve, reject) => {
    // dispatch({ type: 'FIREBASE_LOGIN_ATTEMPT' })

    // const handleError = function (error, authData = {}) {
    //   console.error('FB AUTH ERROR', error, authData)
    //   dispatch({ type: 'FIREBASE_LOGIN_ERROR', error })
    //   reject(error)
    // }

    const handler = function (error, authData) {
      if (error) return handleError(error)

      // localStorage.setItem('FIREBASE_TOKEN', (authData.token || authData.refreshToken))
      // that.authData = authData
      dispatch({ type: 'FIREBASE_LOGIN', authData: authData, error: error })
      resolve(authData)
    }

    try {
      // if (this.v3) {
      firebase.auth()
        .signInWithEmailAndPassword(credentials.email, credentials.password)
        .then(authData => handler(null, authData))
      // .catch(error => handleError(error))
      // }
      // else if (credentials.token) {
      //   this.ref.authWithCustomToken(this.token, handler)
      // } else {
      //   this.ref.authWithPassword(credentials, handler)
      // }
    } catch (error) {
      console.error('FB AUTH ERROR', error)
      // dispatch({ type: 'FIREBASE_LOGIN_ERROR', error })
      // reject(error)
    }
  })
}

export default function auths(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return handleLogin().then(res => { console.log("logged in") })

    // case VALIDATE_USER:
    //   return makeUserState("Name: Ying")

    default:
      return state
  }
}
