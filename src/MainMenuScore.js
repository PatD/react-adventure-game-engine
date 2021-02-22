import React, { Component } from 'react';

const maxScore = 245;
const currentScore = 0;


export default class MainMenuScore extends Component {
  render() {
    return (
      <span className='scoreStatus'>Score: {currentScore} of {maxScore}</span>
    )
  }
}
