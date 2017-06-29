import React, { PropTypes, Component } from 'react'
import { firebaseToArray } from '../utils'
import store from '../store'

let developers = []

class Leaderboard extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      isLoading: true
    }
  }

  getDevelopers() {
    return new Promise((resolve, reject) => {
      let { Developer } = this.props.firedux.data
      let developers = firebaseToArray(Developer)
      if (developers.length) resolve(developers)
    })
  }

  setDeveloperData(developer) {
    if (developer.summary) {
      let arraySummary = developer.summary;
      let maxScore = Math.max.apply(Math, arraySummary.map(summary => { return summary.score }))
      let maxSummary = arraySummary.find(summary => { return summary.score == maxScore; })
      developers.push({
        id: developer.id,
        profile: developer.profile,
        maxSummary: maxSummary
      })
    }
  }

  sortByScore(developers) {
    return developers.sort((a, b) => {
      return b.maxSummary.score - a.maxSummary.score
    });
  }

  toggleIsLoading() {
    this.setState({ isLoading: !this.state.isLoading })
  }

  render() {
    this.getDevelopers().then(devs => {
      developers = []
      devs.map(developer => { this.setDeveloperData(developer) })
    }).then(() => {
      this.sortByScore(developers)
    }).then(() => {
      if (this.state.isLoading) this.toggleIsLoading()
    })

    return this.state.isLoading ? (<div>Loading...</div>) : (
      <div>
        <h2>Leaderboard</h2>
        {!developers.length ? (<div>No Players</div>) :
          developers.map((developer, idx) =>
            <h2 key={idx + 1}>
              {idx + 1}. {developer.profile.first_name} {developer.maxSummary.grade} ( score: {developer.maxSummary.score} )
      </h2>
          )}
      </div>
    )
  }
}

Leaderboard.propTypes = {
  firedux: PropTypes.object.isRequired
}

export default Leaderboard
