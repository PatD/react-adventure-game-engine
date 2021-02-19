import React, { Component } from 'react';
// import React from 'react';
import MainMenuSound from './MainMenuSound.js'
import MainMenuScore from './MainMenuScore.js'
// import { render } from 'react-dom';



export default class MainMenuBar extends Component {
  constructor() {
    super();
    this.state = {
      menuVisibility: "menuClosed",
    };
  }
  openMenu = () =>{
    if(this.state.menuVisibility === "menuClosed"){
      this.setState({menuVisibility:"menuOpen"})
    } else {
      this.setState({menuVisibility:"menuClosed"})
    }
  }
  
  // return <span className='soundStatus'>Sound:{props.soundState}</span>
  render(props){
  return (
    <React.Fragment>
      <div id="menu" onClick={this.openMenu} className={this.state.menuVisibility} >
        
        {/* Hover state */}
        <div id="menuHoverDisplay">
          <nav>
            <ul>
              <li>File</li>
              <li>Sound</li>
              <li>Special</li>
            </ul>
          </nav>
        </div>
        {/* The default state, things are shown */}
        <div id="menuDefaultDisplay">
          <MainMenuScore/>
          <MainMenuSound toggleSound={this.props.toggleSound} soundStatus={this.props.soundStatus} />
        </div>
      </div>
      <div id="hoverblock" className={this.state.menuVisibility}></div>
    </React.Fragment>)
}
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