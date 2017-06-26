import firedux, { firebaseApp } from '../store/firedux'

export function addTodo(text) {
  return () => {
    firedux.push('todos', {
      completed: false,
      text
    })
  }
}

export function deleteTodo(id) {
  return () => {
    firedux.remove(`todos/${id}`)
  }
}

export function editTodo(id, text) {
  return () => {
    firedux.update(`todos/${id}`, {
      text
    })
  }
}

export function completeTodo(id) {
  return (dispatch, getState) => {
    const state = getState()
    const completed = state.firedux.data.todos[id].completed

    firedux.set(`todos/${id}/completed`, !completed)
  }
}

export function completeAll() {
  return (dispatch, getState) => {
    const state = getState()
    const todos = state.firedux.data.todos

    const areAllMarked = _.values(todos).every(todo => todo.completed)

    _.each(todos, (todo, id) => {
      firedux.set(`todos/${id}/completed`, !areAllMarked)
    })
  }
}

export function clearCompleted() {
  return (dispatch, getState) => {
    const state = getState()
    const todos = state.firedux.data.todos

    _.each(todos, (todo, id) => {
      if (todo.completed) {
        firedux.remove(`todos/${id}`)
      }
    })
  }
}

export function addQuiz(quiz) {
  console.log("Date = ", Date())
  return () => {
    firedux.push('Quests', {
      subject: quiz.subject,
      question: quiz.question,
      answers: [quiz.answer, quiz.choice1, quiz.choice2],
      owner: "5LrhuhQtqDfempxq8B9zGpqiiK42",
      skills: "es6",
      point: 10,
      createdAt: Date(),
      updatedAt: Date(),
    })
  }
}

export function deleteQuiz(id) {
  return () => {
    firedux.remove(`Quests/${id}`)
  }
}

export function editQuiz(id, quiz) {
  return () => {
    firedux.update(`Quests/${id}`, {
      quiz
    })
  }
}



// export function login(email, password) {
//   return () => {
//     console.log("login start")
//     let credentials = {
//       email: email,
//       password: password,
//       token: "tttttttooooookkkkkkkeeeeeeeennnnnnnn"
//     }
//     console.log("credentials=", credentials)
//     firedux.login(credentials)
//       .then((authData) => {
//         console.log("authData: ", authData)
//       })
//       .catch((error) => {
//         console.log("error: ", error)
//       })
//     console.log("success ")
//   }
// }

// export function login(prov) {
//   return (dispatch, getState) => {
//     console.log("firedux = ", firedux)
//     let provider
//     switch (prov) {
//       case 'facebook':
//         provider = new firedux.auth.FacebookAuthProvider();
//         break;
//       default:
//         provider = null;
//         break;
//     }
//     firedux.auth().signInWithPopup(provider).then(function (authData) {
//       // localStorage.setItem('FIREBASE_TOKEN', (authData.credential.accessToken || authData.user.refreshToken))
//       // that.authData = authData
//       // dispatch({ type: 'FIREBASE_LOGIN', error: null, authData: authData.user })
//       // resolve(authData)
//       let uid = authData.user.uid
//       firedux.push(`users`, {
//         uid: uid
//       })

//       console.log("authData = ", authData)
//     })
//   }
// }