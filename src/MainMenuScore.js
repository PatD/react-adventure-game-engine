import React, { Component } from 'react';

const maxScore = 245;
const currentScore = 0;

const playerScore = (
  <span className='scoreStatus'>Score: {currentScore} of {maxScore}</span>
)

class MainMenuScore extends Component {
  render() {
    return playerScore
  }
}

export default MainMenuScore;