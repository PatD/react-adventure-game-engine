import React, { Component } from 'react';
import MainMenuBar from './MainMenuBar'
import TextInputParse from './TextInputParser'

const gameUI = (
  <React.Fragment> 
    <header>
      <MainMenuBar/>
    </header>
    <main>This is the main UI screen!</main>
    <footer>
      <TextInputParse/>
    </footer>

  </React.Fragment>
)

class Screen extends Component {
  render() {
    return gameUI
  }
}

export default Screen;