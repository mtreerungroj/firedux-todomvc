import Firebase from 'firebase'
import { isFunction, isObject, omit, get } from 'lodash'
import updeep from 'updeep'

const localStorage = typeof window === 'object' ? window.localStorage : null

const initialState = {
  data: {}
}

function splitUrl(url) {
  return url.split('/')
}

// function urlToKeyPath (url) {
//   const keyPath = splitUrl(url).join('.')
//   return keyPath
// }

export default class Firedux {
  constructor(options) {
    const that = this
    if (options.url) {
      console.warn('Firedux option "url" is deprecated, use "ref" instead.')
    }

    this.v3 = Firebase.SDK_VERSION.substr(0, 2) === '3.'

    if (this.v3) {
      this.auth = Firebase.auth// eslint-disable-line
    }

    this.url = options.url || options.ref.toString()
    this.ref = options.ref || new Firebase(this.url)
    if (this.url.slice(-1) !== '/') {
      this.url += '/'
    }
    this.omit = options.omit || []
    this.token = null
    this.getting = {}
    this.removing = {}
    this.watching = {}
    this.actionId = 0
    this.dispatch = null
    this.userAuth = null

    function makeFirebaseState(action, state, path, value, merge = false) {
      // const keyPath = urlToKeyPath(path)
      // const dataPath = 'data.' + keyPath
      const dataPath = ['data'].concat(splitUrl(path))
      // const statusPath = 'status.' + keyPath
      // debug('MAKE FIREBASE STATE FOR ACTION', action.type, 'VALUE', keyPath, value, 'merge', merge)
      value = merge ? value : updeep.constant(value)
      const newState = updeep.updateIn(dataPath, value, state)
      return newState
    }

    function removeFirebaseState(action, state, path) {
      const split = splitUrl(path)
      const dataSplit = ['data'].concat(split)

      // get & set value for restore in case of error
      // TODO: Find a cleaner way to do this.
      action.setValue(get(state, dataSplit))

      const id = split.pop()
      const parentPath = split.join('.')
      that.ref.child(path).off()
      const keyPath = parentPath
      const dataPath = 'data.' + keyPath
      const newState = updeep.updateIn(dataPath, updeep.omit(id), state)
      return newState
    }

    this.reducer = function reducer() {
      return function (state = initialState, action) {
        // debug('FIREBASE ACTION', action.type, action)
        switch (action.type) {
          case 'FIREBASE_GET':
          case 'FIREBASE_WATCH':
            return makeFirebaseState(action, state, action.path, action.snapshot.val())
          case 'FIREBASE_SET':
          case 'FIREBASE_PUSH':
            return makeFirebaseState(action, state, action.path, action.value)
          case 'FIREBASE_UPDATE':
            return makeFirebaseState(action, state, action.path, action.value, true)
          case 'FIREBASE_REMOVE':
            return removeFirebaseState(action, state, action.path)
          case 'FIREBASE_SET_RESPONSE':
          case 'FIREBASE_UPDATE_RESPONSE':
          case 'FIREBASE_REMOVE_RESPONSE':
            // TODO: Error handling, at per-path level, somehow async without clobber, maybe queues?
            if (action.error) {
              console.error(action.error)
              // restore state
              return makeFirebaseState(action, state, action.path, action.value)
            }
            return state
          case 'FIREBASE_PUSH_RESPONSE':
            if (action.error) {
              // return removeFirebaseState(action, state, action.path)
            }
            return state
          case 'FIREBASE_LOGIN':
          case 'FIREBASE_LOGIN_ERROR':
          case 'FIREBASE_LOGOUT':
          case 'FIREBASE_LOGOUT_ERROR':
          case 'FIREBASE_VALIDATE_USER':
          console.log("action=", action)
            return Object.assign({}, state, {
              uid: action.uid,
              authError: action.error
            })
          default:
            return state
        }
      }
    }

    return this
  }
  cleanValue(value) {
    return isObject(value) ? omit(value, this.omit) : value
  }
  init() {
    const { dispatch } = this
    // const that = this
    return new Promise((resolve, reject) => {
      if (this.v3) {
        const auth = this.auth()
        auth.onAuthStateChanged(user => {
          if (user) {
            // let authData = {
            //   credential: {
            //     provider: "facebook.com",
            //     providerId: "facebook.com"
            //   },
            //   operationType: "signIn",
            //   user: user
            // }
            // console.log("authData=", authData)
            dispatch({ type: 'FIREBASE_VALIDATE_USER', uid: user.uid, authError: null })
            resolve(user)
          }
          // else {
          //   dispatch({ type: 'FIREBASE_VALIDATE_USER', authData: null, authError: null })
          //   reject(new Error('FIREBASE_LOGOUT'))
          // }
        })
      }

      // console.log("after this.v3")

      // listen for auth changes
      // if (isFunction(this.ref.onAuth)) {
      //   this.ref.onAuth(function (authData) {
      //     if (!authData) {
      //       dispatch({ type: 'FIREBASE_VALIDATE_USER', authData: null, authError: null })
      //       reject(new Error('FIREBASE_LOGOUT'))
      //     }
      //     resolve(authData)
      //   })
      // }
    })
  }
  login() {
    const { dispatch } = this
    const that = this
    return new Promise((resolve, reject) => {
      dispatch({ type: 'FIREBASE_LOGIN_ATTEMPT' })

      const handleError = function (error, authData = {}) {
        console.error('FB AUTH ERROR', error, authData)
        dispatch({ type: 'FIREBASE_LOGIN_ERROR', error })
        reject(error)
      }

      const handler = function (error, authData) {
        if (error) return handleError(error)
        // localStorage.setItem('FIREBASE_TOKEN', (authData.token || authData.refreshToken))
        that.authData = authData
        console.log(authData.user.uid)
        dispatch({ type: 'FIREBASE_LOGIN', uid: authData.user.uid, error })
        resolve(authData)
      }

      try {
        if (this.v3) {
          var provider = new this.auth.FacebookAuthProvider();
          this.auth()
            .signInWithPopup(provider)
            .then(authData => handler(null, authData))
            .catch(error => handleError(error))
        }
      } catch (error) {
        console.error('FB AUTH ERROR', error)
        dispatch({ type: 'FIREBASE_LOGIN_ERROR', error })
        reject(error)
      }
    })
  }
  logout() {
    const { dispatch } = this

    return new Promise((resolve, reject) => {
      dispatch({ type: 'FIREBASE_LOGOUT_ATTEMPT' })

      const handleLogout = function () {
        dispatch({ type: 'FIREBASE_LOGOUT', uid: null, error: null })
        resolve()
      }

      const handleLogoutError = function (error) {
        dispatch({ type: 'FIREBASE_LOGOUT_ERROR', error })
        if (error) reject(error)
        else resolve()
      }

      if (this.v3) {
        this.auth().signOut()
          .then(handleLogout, handleLogoutError)
      }
    })
  }
  watch(path, onComplete) {
    const { dispatch } = this
    return new Promise((resolve) => {
      if (this.watching[path]) {
        // // debug('already watching', path)
        return false
      }
      this.watching[path] = true
      // debug('DISPATCH WATCH', path)
      this.ref.child(path).on('value', snapshot => {
        // debug('GOT WATCHED VALUE', path, snapshot.val())
        // TODO: Make watches smart enough to ignore pending updates, e.g. not replace
        //  a path that has been removed locally but is queued for remote delete?
        dispatch({
          type: 'FIREBASE_WATCH',
          path: path,
          snapshot: snapshot
        })

        if (onComplete) onComplete(snapshot)
        resolve({ snapshot: snapshot })
      })
    })
  }
  get(path, onComplete) {
    const { dispatch } = this
    return new Promise((resolve) => {
      if (this.getting[path]) {
        // debug('already getting', path)
        return { type: 'FIREBASE_GET_PENDING' }
      }
      this.getting[path] = true
      // debug('FB GET', path)
      this.ref.child(path).once('value', snapshot => {
        this.getting[path] = false
        dispatch({
          type: 'FIREBASE_GET',
          path: path,
          snapshot: snapshot
        })
        if (onComplete) onComplete(snapshot)
        resolve({ snapshot: snapshot })
      })
    })
  }
  set(path, value, onComplete) {
    const { dispatch } = this
    return new Promise((resolve, reject) => {
      const newValue = this.cleanValue(value)
      // debug('FB SET', path, newValue)
      // optimism
      dispatch({
        type: 'FIREBASE_SET',
        path: path,
        value: newValue
      })
      this.ref.child(path).set(newValue, error => {
        dispatch({
          type: 'FIREBASE_SET_RESPONSE',
          path: path,
          value: newValue,
          error: error
        })
        if (onComplete) onComplete(error)
        if (error) reject(error)
        else resolve({ value: newValue })
      })
    })
  }
  update(path, value, onComplete) {
    const { dispatch } = this
    return new Promise((resolve, reject) => {
      const newValue = this.cleanValue(value)
      // debug('FB UPDATE', path, newValue)
      // optimism
      dispatch({
        type: 'FIREBASE_UPDATE',
        path: path,
        value: newValue
      })
      this.ref.child(path).update(newValue, error => {
        dispatch({
          type: 'FIREBASE_UPDATE_RESPONSE',
          path: path,
          value: newValue,
          error: error
        })
        if (onComplete) onComplete(error)
        if (error) reject(error)
        else resolve({ value: newValue })
      })
    })
  }
  remove(path, onComplete) {
    const { dispatch } = this
    return new Promise((resolve, reject) => {
      if (this.removing[path]) {
        // debug('already removing', path)
        return { type: 'FIREBASE_REMOVE_PENDING' }
      }
      this.removing[path] = true
      // debug('FB remove', path)

      let value

      // optimism
      dispatch({
        type: 'FIREBASE_REMOVE',
        path: path,
        // TODO: How to access state for cleaner rollback?
        // eslint-disable-next-line no-return-assign
        setValue: (v) => value = v
      })
      this.ref.child(path).remove((error) => {
        this.removing[path] = false
        dispatch({
          type: 'FIREBASE_REMOVE_RESPONSE',
          path: path,
          value: value,
          error: error
        })
        if (onComplete) onComplete(error)
        if (error) reject(error)
        else resolve()
      })
    })
  }
  push(toPath, value, onId, onComplete) {
    const { dispatch } = this
    const that = this
    const newValue = this.cleanValue(value)

    return new Promise((resolve, reject) => {
      // debug('FB PUSH', toPath, newValue)

      let path, newId
      const ref = that.ref.child(toPath)
      const pushRef = ref.push(newValue, (error) => {
        dispatch({
          type: 'FIREBASE_PUSH_RESPONSE',
          path: path,
          toPath: toPath,
          newId: newId,
          value: newValue,
          error: error
        })
        if (onComplete) onComplete(error, newId)
        if (error) reject(error)
        else resolve(newId)
      })
      path = pushRef.toString().replace(that.url, '')
      // function in firebase@2, property in firebase@3
      newId = isFunction(pushRef, 'key') ? pushRef.key() : pushRef.key
      if (onId) onId(newId)

      // optimism
      dispatch({
        type: 'FIREBASE_PUSH',
        path: path,
        toPath: toPath,
        newId: newId,
        value: newValue,
        ref: pushRef,
        toRef: ref
      })
    })
  }
}