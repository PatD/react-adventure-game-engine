import React, { Component } from 'react';

const soundOnOff = "on"
const soundStatus = (
<span className="soundStatus">Sound:{soundOnOff}</span>
)

class MainMenuSound extends Component {
  render() {
    return soundStatus
  }
}

export default MainMenuSound;