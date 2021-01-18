import React, { Component } from 'react';
import MainMenuSound from './MainMenuSound.js'
import MainMenuScore from './MainMenuScore.js'

const menuActive = false;

// const menuDropDowns = {

//   "File":["About this game","Help"],
//   "Action":["New Game","Save Game","Restore Game","Quit"],
//   "Special":["Do a thing"],
//   "Speed":["Slow","Normal","Fast"]


// }


// User has clicked on menu or pressed 'Escape' key
const menuBarOpen =(
  <nav>
   
  </nav>
)

class MainMenuBar extends Component {
  render() {
    if(menuActive === false){
      return ( 
      <React.Fragment>
        <MainMenuScore/>
        <MainMenuSound/>
      </React.Fragment>)
    } else {
      return menuBarOpen
    }
  }
}

export default MainMenuBar;