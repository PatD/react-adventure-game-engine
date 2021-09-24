import React, { Component } from 'react';
import MainMenuScore from './MainMenuScore.js'
import NavGame from './navs/Game.js'
// import NavFile from './navs/File.js'
// import NavSound from './navs/Sound.js'
import NavSpecial from './navs/Special.js'


export default class MainMenuBar extends Component {
  constructor() {
    super();

    // Initial state - all menu items are closed, and the score and title are displayed to the user
    this.state = {
      mainNavBar: "active", // The main menu is active, no menu options shown
      mainNavSource:{}, // Dynamic list of main menu choices
      mainNavMenuVisibility: "inactive", // Shown when user hits escape and can choose menu items.
      mainNavFirst:"", // Marker for the left-most menu item. 
    };
  }


  // Mouse Click to open main menu
  activateMainMenu = (event) => {
    /*
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
    else this.resetMenu()
    */
  }




  toggleMenuDropdown = (event) => {
    event.preventDefault();

    console.log(event.target.innerText)

    // Close menus

      // identify any ones in state that have 'submenu' and set to active

    this.setState({
      mainNavGameMenu: "inactive subMenu",
      mainNavFileMenu: "inactive subMenu",
      // mainNavSoundMenu: "inactive subMenu",
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

    const resetState = this.state.mainNavSource;
    return [

      // Put the menu back together
      this.setState({
        mainNavBar: "active",
        mainNavMenuVisibility: "inactive"
      }),

      this.setState(resetState),
      this.props.updateAppComponentState([{ menuBarActive: false }])
    ]
  }


  componentDidMount(){
      // Set state for dynamic menu generation

      // Identify main menu items:
      const _mainNavMenuItems = [];
      const getMenuItems = this.props.mainMenuItems.map(mainNavItem => {
        _mainNavMenuItems.push(mainNavItem.top)
      })

      // Build into object to add to component state
      const menuState = {};
      for (const key of _mainNavMenuItems) {
          let newKey = "mainNav" + [key] + "Menu"
          menuState[newKey] = "inactive subMenu"
      }

      // Add the dynamically generated top-level menu chocies to the nav bar
      this.setState(menuState)

      this.setState({
        // And add a backup of all menus, closed
        mainNavSource:menuState, 
        // Add marker for left-most item
        mainNavFirst:"mainNav" + _mainNavMenuItems[0] + "Menu"
      })


      // Also, enable keyboard movement of menu
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

    if (this.props.menuBarActive !== prevProps.menuBarActive) {
      if (this.state.mainNavBar === "active") {

        const firstMenu = this.state.mainNavFirst;
        

        let activate = {
          
          mainNavBar: "inactive",
          mainNavMenuVisibility: "active"
        }
        activate[firstMenu] = "active"

        console.log(activate)
        // Identify first choice to make active
        this.setState(activate)
      }
      else this.resetMenu()
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
              <ul>
                {this.props.mainMenuItems.map(main => (
                  <li
                    onClick={this.toggleMenuDropdown}
                    key={main.order}
                    className={"inactive subMenu mainNavItem_" + main.top}>{main.top}
                  </li>
                ))
                }
              </ul>
            </nav>
          </div>


          {
            /* Sub manus */
          }

            {this.props.mainMenuItems.map(subMenu => (
              <ul key={subMenu.order} className={"manNav" + subMenu.top + "Menu inactive subMenu"}>
                {
                  subMenu.items.map(item => {
                    return <li onClick={this.handleMenuClick} key={item.name}>{item.name}</li>
                  })
                }
              </ul>
            ))
            }


          {/* <ul className={this.state.mainNavFileMenu}>
              <li onClick={this.handleMenuClick}>Save Game</li>
              <li onClick={this.handleMenuClick}>Load Game</li>
              <li onClick={this.handleMenuClick}>Restart</li>
              <li> ----------- </li>
              <li onClick={this.handleMenuClick}>Swap Game</li>
          </ul> */}
          {/* <NavGame resetMenu={this.resetMenu} mainNavGameMenu={this.state.mainNavGameMenu} handleDropDownMenuClick={this.props.handleDropDownMenuClick} /> */}
          {/* <NavFile resetMenu={this.resetMenu} mainNavFileMenu={this.state.mainNavFileMenu} handleDropDownMenuClick={this.props.handleDropDownMenuClick} /> */}
          {/* <NavSpecial resetMenu={this.resetMenu} mainNavSpecialMenu={this.state.mainNavSpecialMenu} handleDropDownMenuClick={this.props.handleDropDownMenuClick} /> */}
          {/* <NavSound resetMenu={this.resetMenu} mainNavSoundMenu={this.state.mainNavSoundMenu} handleDropDownMenuClick={this.props.handleDropDownMenuClick} /> */}


          {/* Clicking this invisible div closes the main menu */}
          <div id="hoverblock" className={this.state.mainNavBar} /* onClick={this.resetMenu}  */></div>

        </header>
      </React.Fragment>
    )
  }
}
