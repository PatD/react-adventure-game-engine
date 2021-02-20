import React, { Component } from 'react';
import MainMenuSound from './MainMenuSound.js'
import MainMenuScore from './MainMenuScore.js'
import NavGame from './navs/Game.js'
// import NavFile from './navs/File.js'
// import NavSound from './navs/Sound.js'
// import NavSpecial from './navs/Special.js'


export default class MainMenuBar extends Component {
  constructor() {
    super();
    this.state = {
      mainNavBar: "active",  // or 'active'
      mainNavMenuVisibility: "inactive", // or 'active'
      mainNavGameMenu: "inactive" // or 'active'
    };
  }
  toggleMainMenu = (event) =>{ 

    event.preventDefault();
    if(this.state.mainNavBar === "active"){
      this.setState({
        mainNavBar:"inactive",
        mainNavMenuVisibility: "active"
      })


    } else {
     // this.setState({menuVisibility:"menuClosed"})
    }
  }

  // toggleMenuGame = (event) =>{ 
  //   console.log(event)
  //   event.preventDefault();
  //   if(this.state.menuVisibilityGame === "menuClosed subMenu"){
  //     this.setState({menuVisibilityGame:"menuOpen subMenu"})
  //   } else {
  //     this.setState({menuVisibilityGame:"menuClosed subMenu"})
  //   }
  // }
  
  // return <span className='soundStatus'>Sound:{props.soundState}</span>
  render(props){
  return (
    <React.Fragment>
       
        {/* 
            Default state for the main nav inactive state 
            It is "visible" by default, and "hidden" when the submenu is "active".
        */}
        <div id="menuBarDefaultDisplay" className={this.state.mainNavBar} onClick={this.toggleMainMenu}>
          <MainMenuScore/>
          <MainMenuSound toggleSound={this.props.toggleSound} soundStatus={this.props.soundStatus} />
        </div>

        {/*
          This is the main nav bar.  
          It is "invisible" when inactive, and "visible" when active
        */}
        <div id="menuBarNavBarActive" className={this.state.mainNavMenuVisibility}>
          <nav>
            <ul>
              <li onClick={this.toggleMenuGame}>Game</li>                
              <li>File</li>
              <li>Special</li>
              <li>Sound</li>
            </ul>
          </nav>
        </div>

        {/* These are the submenu dropdowns. 
            They are "invisible" when the main nav bar is displayed
            They are "invisible" but ready for clickhandlers when the
        */}

      <NavGame mainNavGameMenu={this.state.mainNavGameMenu} />


      {/* <NavFile/>
      <NavSpecial/>
      <NavSound/> */}


      <div id="menu" className={this.state.menuVisibility} >
        

        
        {/* The default state, things are shown */}

      </div>
      

      
      <div id="hoverblock" onClick={this.toggleMainMenu}  className={this.state.menuVisibility}></div>

    </React.Fragment>
  )}
}




// const menuDropDowns = {

//   "File":["About this game","Help"],
//   "Action":["New Game","Save Game","Restore Game","Quit"],
//   "Special":["Do a thing"],
//   "Speed":["Slow","Normal","Fast"]


// }
