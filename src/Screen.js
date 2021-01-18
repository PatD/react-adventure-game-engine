import React, { Component } from 'react';
import MainMenuSound from './MainMenuSound.js'

const ui = (
  <div> 
  
    <MainMenuSound/>
    <main>This is the main UI screen!</main>
  </div>
)

class Screen extends Component {
  render() {
    return ui
  }
}

export default Screen;