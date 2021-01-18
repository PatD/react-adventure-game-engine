import React, { Component } from 'react';

const soundOnOff = "On"
const soundStatus = (
<span>Sound: {soundOnOff}</span>
)

class MainMenuSound extends Component {
  render() {
    return soundStatus
  }
}

export default MainMenuSound;