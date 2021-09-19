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



  activateMainMenu = (event) => {
    console.log('Menu clicked');
    event.preventDefault();
    if (this.state.mainNavBar === "active") {
      console.log('Menu was closed, opening')
      this.props.updateAppComponentState([{ menuBarActive: true }])

      this.setState({
        mainNavBar: "inactive",
        mainNavMenuVisibility: "active",
        mainNavGameMenu: "active subMenu",
      })
    }
    else {
      console.log('closing time')

      this.resetMenu()

    }
  }




  toggleMenuDropdown = (event) => {
    event.preventDefault();

    // Close menus
    this.setState({
      mainNavGameMenu: "inactive subMenu",
      mainNavFileMenu: "inactive subMenu",
      mainNavSoundMenu: "inactive subMenu",
      mainNavSpecialMenu: "inactive subMenu",
    })

    // Toggling with a mouse click
    if (event.target.innerText) {
      // Open selected menu
      const selectedMenuForSetState = {}
      selectedMenuForSetState["mainNav" + event.target.innerText + "Menu"] = "active subMenu";
      this.setState(selectedMenuForSetState)
    }
    // Open the first dropdown when user hits escape key
    else {
      //  this.setState({mainNavGameMenu:"active subMenu"})
    }

    // Pause the game
    // this.props.togglePause()
  }


  moveMenuKeyboard = (key) => {

    return console.log(key)

    // How many dropdowns are there? 

    // Where are we in the order of dropdowns L-R?  

      // If we're first or last, go back around again (yikes)
  

    // Once we're in the dropdown, first choice is highlighted and up/down arrows available

      // bottom of up/down goes back to top

  }


  // Fires when a menu item is chosen
  // resetMenu = (event) =>{
  resetMenu = () => {
    console.log('ResetMenu')
    return [

      // Put the menu back together
      this.setState({
        mainNavBar: "active",
        mainNavMenuVisibility: "inactive",
        mainNavGameMenu: "inactive subMenu",
        mainNavFileMenu: "inactive subMenu",
        mainNavSoundMenu: "inactive subMenu",
        mainNavSpecialMenu: "inactive subMenu",
      }),
      this.props.updateAppComponentState([{ menuBarActive: false }])
    ]
  }


  componentDidMount(){
      // Keyboard movement of menu
      document.addEventListener('keydown', (event) => {

        // Handle arrow keys for movement
          if (
            (this.props.menuBarActive === true && this.state.mainNavMenuVisibility === "active") &&
            (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
            return this.moveMenuKeyboard(event.key)
          }
    
          // Any other keypress is ignored!
          else return false
          
        }, false);
  }


  componentDidUpdate(prevProps) {

    // console.log(this.props.menuBarActive)
    // console.log(prevProps.menuBarActive)


    if (this.props.menuBarActive !== prevProps.menuBarActive) {
      if (this.state.mainNavBar === "active") {
        this.setState({
          mainNavBar: "inactive",
          mainNavMenuVisibility: "active",
          mainNavGameMenu: "active subMenu",
        })
      }
      else {
        console.log('closing time')

        this.resetMenu()

      }

    }

  }



  render(props) {
    return (
      <React.Fragment>
        <header style={{ width: this.props.gameWidth }}>
          {/* 
            Default state for the main nav inactive state 
            It is "visible" by default, and "hidden" when the submenu is "active".
          */}


          <div id="menuBarDefaultDisplay" className={this.state.mainNavBar} /* onClick={this.activateMainMenu} */>


            {/* <div id="menuBarDefaultDisplay" className={this.props.menuBarActive ? "inactive" : "active"} onClick={this.activateMainMenu}> */}

            <MainMenuScore
              currentScore={this.props.currentScore}
              highScore={this.props.highScore}
            />

            {/* <MainMenuSound toggleSound={this.props.toggleSound} soundStatus={this.props.soundStatus} /> */}
            <span id="gameTitle">{this.props.gameTitle}</span>
          </div>


          {/*
          This is the main nav bar.  
          It is "invisible" when inactive, and "visible" when active
        */}
          <div id="menuBarNavBarActive" className={this.state.mainNavMenuVisibility} >
            <nav>

              {/*
                This uses props from the app.js component to define the main nav dropdowns.
              */}
              <ul>
                {this.props.mainMenuItems.map(mainNavItem => (
                  <li
                    onClick={this.toggleMenuDropdown}
                    key={mainNavItem.order}
                    className={"inactive subMenu mainNavItem_" + mainNavItem.top}>{mainNavItem.top}
                  </li>
                ))
                }
              </ul>
              {/* <ul>
              <li onClick={this.toggleMenuDropdown} className={this.state.mainNavGameMenu}>Game</li>                
              <li onClick={this.toggleMenuDropdown} className={this.state.mainNavFileMenu}>File</li>
              <li onClick={this.toggleMenuDropdown} className={this.state.mainNavSpecialMenu}>Special</li>
              <li onClick={this.toggleMenuDropdown} className={this.state.mainNavSoundMenu}>Sound</li>
            </ul> */}
            </nav>
          </div>


          <NavGame resetMenu={this.resetMenu} mainNavGameMenu={this.state.mainNavGameMenu} handleDropDownMenuClick={this.props.handleDropDownMenuClick} />
          <NavFile resetMenu={this.resetMenu} mainNavFileMenu={this.state.mainNavFileMenu} handleDropDownMenuClick={this.props.handleDropDownMenuClick} />
          <NavSpecial resetMenu={this.resetMenu} mainNavSpecialMenu={this.state.mainNavSpecialMenu} handleDropDownMenuClick={this.props.handleDropDownMenuClick} />
          <NavSound resetMenu={this.resetMenu} mainNavSoundMenu={this.state.mainNavSoundMenu} handleDropDownMenuClick={this.props.handleDropDownMenuClick} />


          {/* Clicking this invisible div closes the main menu */}
          <div id="hoverblock" className={this.state.mainNavBar} /* onClick={this.resetMenu}  */></div>

        </header>
      </React.Fragment>
    )
  }
}
