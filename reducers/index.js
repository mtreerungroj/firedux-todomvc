import { combineReducers } from 'redux'
import firedux from '../store/firedux'

const rootReducer = combineReducers({
  firedux: firedux.reducer(),
  developerData: (state, action) => {
    if (!state) {
      return {
        developers: []
      }
    }
    switch (action.type) {
      case 'developer/set-developer-data':
        return {
          developers: action.data
        }
      default:
        return {
          developers: state.developers ? state.developers : []
        }
    }
  },
  app: (state, action) => {
    if (!state) return { authed: false }
    switch (action.type) {
      case 'auth/complete':
        return {
          authed: true
        }
      case 'auth/fail':
        return {
          authed: false

        }
      default:
        return Object.assign({}, state)
    }
  }
})

export default rootReducer
