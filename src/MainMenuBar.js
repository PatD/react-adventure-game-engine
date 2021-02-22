import React, { Component } from 'react';
import MainMenuSound from './MainMenuSound.js'
import MainMenuScore from './MainMenuScore.js'
import NavGame from './navs/Game.js'
import NavFile from './navs/File.js'
import NavSound from './navs/Sound.js'
import NavSpecial from './navs/Special.js'


export default class MainMenuBar extends Component {
  constructor() {
    super();
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
    selectedMenuForSetState["mainNav" + event.target.innerText + "Menu"] = "active subMenu"

    this.setState(selectedMenuForSetState)
  }

  // Fires when a menu item is chosen
  resetMenu = (event) =>{
    this.setState({
      mainNavBar: "active",  
      mainNavMenuVisibility: "inactive", 
      mainNavGameMenu: "inactive subMenu" 
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
          <MainMenuSound toggleSound={this.props.toggleSound} soundStatus={this.props.soundStatus} />
        </div>

        {/*
          This is the main nav bar.  
          It is "invisible" when inactive, and "visible" when active
        */}
        <div id="menuBarNavBarActive" className={this.state.mainNavMenuVisibility}>
          <nav>
            <ul>
              <li onClick={this.toggleMenuDropdown}>Game</li>                
              <li onClick={this.toggleMenuDropdown}>File</li>
              <li onClick={this.toggleMenuDropdown}>Special</li>
              <li onClick={this.toggleMenuDropdown}>Sound</li>
            </ul>
          </nav>
        </div>

   
      <NavGame    resetMenu={this.resetMenu} mainNavGameMenu={this.state.mainNavGameMenu} />
      <NavFile    resetMenu={this.resetMenu} mainNavFileMenu={this.state.mainNavFileMenu} />
      <NavSpecial resetMenu={this.resetMenu} mainNavSpecialMenu={this.state.mainNavSpecialMenu} />
      <NavSound   resetMenu={this.resetMenu} mainNavSoundMenu={this.state.mainNavSoundMenu} />


      {/* clicking off the menu closes it */}
      <div id="hoverblock" onClick={this.resetMenu}  className={this.state.mainNavBar}></div>
    </React.Fragment>
  )}
}
