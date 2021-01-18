import React, { Component } from 'react';

export default class MainMenuSound extends Component {
  constructor(props) {
    super(props);
    this.state = {soundState:true};
    this.toggleSound = this.toggleSound.bind(this);
  }
  toggleSound(){
    this.setState(state => ({
      soundState: !state.soundState
    }));
  };


  render() {
    return (
      <React.Fragment>
        <span 
          onClick={this.toggleSound} 
          className="soundStatus">Sound:{this.state.soundState ? 'On' : 'Off'}</span>
      </React.Fragment>
    )
  }
}
