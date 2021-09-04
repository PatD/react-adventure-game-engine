import React, { Component } from 'react';

export class MainMenuScore extends Component {
  render() {
    return (
      <span className='scoreStatus'>Score: {this.props.currentScore} of {this.props.highScore}</span>
    )
  }
}

export default React.memo(MainMenuScore);