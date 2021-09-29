import React, { Component } from 'react';
import MainMenuScore from './MainMenuScore.js'

export default class MainMenuBar extends Component {
  constructor() {
    super();

    // Initial state - all menu items are closed, and the score and title are displayed to the user
    this.state = {
      mainNavBar: "active", // The main menu is active, no menu options shown
      mainNavMenuVisibility: "inactive", // Shown when user hits escape and can choose menu items.
      mainNavSource: {}, // Dynamic list of main menu choices, passed down as props
      mainNavFirst: "", // Marker for the left-most menu item. 
      mainNavCurrentActive: "", // The submenu that is currenlty open. There can be only 1!
      subNavActiveItems: []
    };
  }


  // Handle L - R subnav changes w
  moveMenuKeyboard = (key) => {

    // Array: Main nav top level choices
    const mainNavs = Object.keys(this.state.mainNavSource)

    // Number: Find currently active item in the array, as a number
    const currentNum = mainNavs.findIndex(i => i == this.state.mainNavCurrentActive)

    // Handle key presses
    if ((key === "ArrowRight") && (mainNavs.length !== currentNum + 1)) {

      // The the next right-arrow choice is made, open the submenu for it
      const newMenuItems = this.props.mainMenuItems.find(x => x.name === mainNavs[currentNum + 1])
      return this.setState({
        mainNavCurrentActive: mainNavs[currentNum + 1],
        subNavActiveItems: newMenuItems.items
      })
    }

    if (key === "ArrowLeft" && currentNum !== 0) {

      // The the next left-arrow choice is made, open the submenu for it
      const newMenuItems = this.props.mainMenuItems.find(x => x.name === mainNavs[currentNum - 1])
      return this.setState({
        mainNavCurrentActive: mainNavs[currentNum - 1],
        subNavActiveItems: newMenuItems.items
      })
    }


    // What is the currently open menu?  Select the first item

    // console.log('On ' +this.state.mainNavCurrentActive )

    const currentSubMenuChoices = this.props.mainMenuItems.filter(choices => choices.name === this.state.mainNavCurrentActive)

    if (key === "ArrowDown") {
      console.log('On ' + this.state.mainNavCurrentActive)
      //return this.setState({mainNavCurrentActive:mainNavs[currentNum - 1]})
    }

    if (key === "ArrowUp") {
      console.log('On ' + this.state.mainNavCurrentActive)
      //return this.setState({mainNavCurrentActive:mainNavs[currentNum - 1]})
    }
    // console.log(currentSubMenuChoices[0].items)

    // on selection, copy this to state!  Add a selected field in this local version of state, and use that to generate the sub menu?


  }


  // Fires when a menu item is chosen, or when menu is closed
  resetMenu = () => {
    const resetState = this.state.mainNavSource;
    return [
      this.setState({
        mainNavBar: "active",
        mainNavMenuVisibility: "inactive",
        mainNavCurrentActive: "",
        subNavActiveItems: []
      }),

      // Return the menu to what it was
      this.setState(resetState),

      // Update parent component state
      this.props.updateAppComponentState([{ menuBarActive: false }])
    ]
  }

  componentDidMount() {
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
      mainNavSource: menuState,
      // Add marker for left-most item
      mainNavFirst: "mainNav" + _mainNavMenuItems[0] + "Menu"
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

    // Receives the menuBarActive "active" prop from parent (since that's where the event listener is)
    if (this.props.menuBarActive !== prevProps.menuBarActive) {
      if (this.state.mainNavBar === "active") {

        const firstMenu = this.state.mainNavFirst;
        const firstSubMenu = this.props.mainMenuItems.find(x => x.name === firstMenu)

        // Shows the menu options, hides game title and score
        let activate = {
          mainNavBar: "inactive",
          mainNavMenuVisibility: "active",
          mainNavCurrentActive: this.state.mainNavFirst,
          subNavActiveItems: firstSubMenu.items
        }

        // Identify first choice to make active
        this.setState(activate)
      }
      else this.resetMenu()
    }
  }

  render(props) {
    return (
      <header style={{ width: this.props.gameWidth }}>
        <div id="menuBarDefaultDisplay" className={this.state.mainNavBar}>
          <MainMenuScore
            currentScore={this.props.currentScore}
            highScore={this.props.highScore}
          />

          <span id="gameTitle">{this.props.gameTitle}</span>
        </div>


        {/*
          This is the main nav bar.  
          It is "invisible" when inactive, and "visible" when active
          */}
        <div id="menuBarNavBarActive" className={this.state.mainNavMenuVisibility} >
          <ul>
            {this.props.mainMenuItems.map(main => (
              <li
                className={this.state.mainNavCurrentActive === "mainNav" + main.top + "Menu" ? "active" : "inactive"}
                key={main.order}
              >{main.top}</li>
            ))}
          </ul>
        </div>

        {/* Submenu content loaded here */}
        <ul
          id={"subMenu" + this.state.mainNavCurrentActive}
          className={this.state.mainNavCurrentActive != "" ? "subMenu active" : "inactive"}>
          {this.state.subNavActiveItems.map((subMenu, index) => (
            <li
              key={index} 
              onClick={this.handleMenuClick} 
              className={subMenu.active === true ? "enabled":"disabled"}>{subMenu.name}</li>
          ))}
        </ul>
      </header>
    )
  }
}
