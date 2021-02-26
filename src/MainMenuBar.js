import React, { Component } from 'react';
import MainMenuScore from './MainMenuScore.js'
import NavGame from './navs/Game.js'
import NavFile from './navs/File.js'
import NavSound from './navs/Sound.js'
import NavSpecial from './navs/Special.js'


export default class MainMenuBar extends Component {
  constructor() {
    super();

    // Initial state - all menu items are closed, and the score and title are displayed to the user
    this.state = {
      mainNavBar: "active",  
      mainNavMenuVisibility: "inactive", 
      mainNavGameMenu: "inactive subMenu",
      mainNavFileMenu: "inactive subMenu",
      mainNavSoundMenu: "inactive subMenu",
      mainNavSpecialMenu: "inactive subMenu",
    };
  }
  activateMainMenu = (event) =>{ 
    event.preventDefault();
    if(this.state.mainNavBar === "active"){
      this.setState({
        mainNavBar:"inactive",
        mainNavMenuVisibility: "active"
      })
    }
  }


  toggleMenuDropdown = (event) =>{
    event.preventDefault();
    
    // Close menus
    this.setState({
      mainNavGameMenu: "inactive subMenu",
      mainNavFileMenu: "inactive subMenu",
      mainNavSoundMenu: "inactive subMenu",
      mainNavSpecialMenu: "inactive subMenu",
    })

    // Open selected menu
    const selectedMenuForSetState = {}
    selectedMenuForSetState["mainNav" + event.target.innerText + "Menu"] = "active subMenu";
    this.setState(selectedMenuForSetState)

    // Pause the game
    this.props.togglePause()
  }



  // Fires when a menu item is chosen
  resetMenu = (event) =>{
    // unpause game
    this.props.togglePause()

    // Put the menu back together
    this.setState({
      mainNavBar: "active",  
      mainNavMenuVisibility: "inactive", 
      mainNavGameMenu: "inactive subMenu",
      mainNavFileMenu: "inactive subMenu",
      mainNavSoundMenu: "inactive subMenu",
      mainNavSpecialMenu: "inactive subMenu",
    })
  }

  // return <span className='soundStatus'>Sound:{props.soundState}</span>
  render(props){
  return (
    <React.Fragment>
       
        {/* 
            Default state for the main nav inactive state 
            It is "visible" by default, and "hidden" when the submenu is "active".
        */}
        <div id="menuBarDefaultDisplay" className={this.state.mainNavBar} onClick={this.activateMainMenu}>
          <MainMenuScore/>
          {/* <MainMenuSound toggleSound={this.props.toggleSound} soundStatus={this.props.soundStatus} /> */}
          <span id="gameTitle">{this.props.gameTitle}</span>
        </div>



        {/*
          This is the main nav bar.  
          It is "invisible" when inactive, and "visible" when active
        */}
        <div id="menuBarNavBarActive" className={this.state.mainNavMenuVisibility}>
          <nav>
            <ul>
              <li onClick={this.toggleMenuDropdown} className={this.state.mainNavGameMenu}>Game</li>                
              <li onClick={this.toggleMenuDropdown} className={this.state.mainNavFileMenu}>File</li>
              <li onClick={this.toggleMenuDropdown} className={this.state.mainNavSpecialMenu}>Special</li>
              <li onClick={this.toggleMenuDropdown} className={this.state.mainNavSoundMenu}>Sound</li>
            </ul>
          </nav>
        </div>

   
      <NavGame    resetMenu={this.resetMenu} mainNavGameMenu={this.state.mainNavGameMenu} handleDropDownMenuClick={this.props.handleDropDownMenuClick} />
      <NavFile    resetMenu={this.resetMenu} mainNavFileMenu={this.state.mainNavFileMenu} handleDropDownMenuClick={this.props.handleDropDownMenuClick} />
      <NavSpecial resetMenu={this.resetMenu} mainNavSpecialMenu={this.state.mainNavSpecialMenu} handleDropDownMenuClick={this.props.handleDropDownMenuClick} />
      <NavSound   resetMenu={this.resetMenu} mainNavSoundMenu={this.state.mainNavSoundMenu} handleDropDownMenuClick={this.props.handleDropDownMenuClick} />


      {/* Clicking this invisible div closes the main menu */}
      <div id="hoverblock" onClick={this.resetMenu}  className={this.state.mainNavBar}></div>
    </React.Fragment>
  )}
}
