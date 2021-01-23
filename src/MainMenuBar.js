// import React, { Component } from 'react';
import React from 'react';
import MainMenuSound from './MainMenuSound.js'
import MainMenuScore from './MainMenuScore.js'



export default function MainMenuBar({soundState}){
  
  // return <span className='soundStatus'>Sound:{props.soundState}</span>
  return (
    <React.Fragment>
      <MainMenuScore/>
      <MainMenuSound soundState={soundState} />
    </React.Fragment>)

}




// const menuDropDowns = {

//   "File":["About this game","Help"],
//   "Action":["New Game","Save Game","Restore Game","Quit"],
//   "Special":["Do a thing"],
//   "Speed":["Slow","Normal","Fast"]


// }



// class MainMenuBar extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {soundState: "Off"};
  //   this.setSoundState = this.setSoundState.bind(this);

  // }


  // setSoundState(){
  //   console.log(this)
  // }

//   render() {

//       return (
//       <React.Fragment>
//         <MainMenuScore/>
//         <MainMenuSound />
//       </React.Fragment>)
//   }
// }

// export default MainMenuBar;