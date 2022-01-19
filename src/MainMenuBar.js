import React, { Component } from 'react';
import MainMenuScore from './MainMenuScore.js'

export default class MainMenuBar extends Component {
  constructor() {
    super();

    // Initial state - all menus are closed, and the score and title are displayed to the user
    this.state = {
      mainNavBar: "active", // The main menu is active, no menu options shown
      mainNavMenuVisibility: "inactive", // Shown when user hits escape and can choose menu items.
      mainNavs: [], // handlekeyboardMenu() uses these as reference
      mainNavFirst: "", // Marker for the left-most menu item. 
      mainNavCurrentActive: "", // The submenu that is currenlty open. There can be only 1!
      subNavActiveItems: [],  // Currently open menu
      subNavSelectedItem: "" // currently highlighted item
    };
  }


  handleKeyboardMenu = (key) => {

    // Number: Find currently active main nav in the array, as a number
    const currentNum = this.state.mainNavs.findIndex(i => i == this.state.mainNavCurrentActive)

    // Handle key presses
    if ((key === "ArrowRight") && (this.state.mainNavs.length !== currentNum + 1)) {
      // The the next right-arrow choice is made, open the submenu for it
      const newMenuItems = this.props.mainMenuItems.find(x => x.name === this.state.mainNavs[currentNum + 1])
      const newMenuSelected = newMenuItems.items.find(s => s.selected === true)

      // Reset the subMenu on the way out. Otherwise it keeps the middle seleciton
      return this.setState({
        mainNavCurrentActive: this.state.mainNavs[currentNum + 1],
        subNavActiveItems: newMenuItems.items,
        subNavSelectedItem: newMenuSelected.name
      })
    }
    else if (key === "ArrowLeft" && currentNum !== 0) {
      // The the next left-arrow choice is made, open the submenu for it
      const newMenuItems = this.props.mainMenuItems.find(x => x.name === this.state.mainNavs[currentNum - 1])
      const newMenuSelected = newMenuItems.items.find(s => s.selected === true)

      return this.setState({
        mainNavCurrentActive: this.state.mainNavs[currentNum - 1],
        subNavActiveItems: newMenuItems.items,
        subNavSelectedItem: newMenuSelected.name
      })
    }
    else if (key === "ArrowDown") {

      // Copy of the currently open menu.
      // When a user chnages a selection, we update state with the new object to show what's selected
      const workingSubNavActiveItems = this.state.subNavActiveItems;

      // Number of items in the open sub menu
      const menuCount = this.state.subNavActiveItems.length;

      // Currently selected item:
      const currentSelected = this.state.subNavActiveItems.findIndex(x => x.selected === true);

      if (currentSelected + 2 <= menuCount) {
        // Move down the menu listing
        workingSubNavActiveItems[currentSelected + 1].selected = true;
        workingSubNavActiveItems[currentSelected].selected = false;
      } else if (menuCount > 1) {
        // Handle single item menus, and handle moving back to the top once they're at the bottom
        workingSubNavActiveItems[0].selected = true;
        workingSubNavActiveItems[currentSelected].selected = false;
      }

      // Identify which one is currently selected
      const sel = workingSubNavActiveItems.find(x => x.selected === true)

      // Update state with the selected item for rendering
      return this.setState({
        subNavActiveItems: workingSubNavActiveItems,
        subNavSelectedItem: sel.name
      })

    }
    else if (key === "ArrowUp") {
      // Copy of the currently open menu.
      // When a user chnages a selection, we update state with the new object to show what's selected
      const workingSubNavActiveItems = this.state.subNavActiveItems;

      // Number of items in the open sub menu
      const menuCount = this.state.subNavActiveItems.length;

      // Currently selected item:
      const currentSelected = this.state.subNavActiveItems.findIndex(x => x.selected === true);

      if ((currentSelected - 1 <= menuCount) && (currentSelected > 0)) {
        // Move down the menu listing
        workingSubNavActiveItems[currentSelected - 1].selected = true;
        workingSubNavActiveItems[currentSelected].selected = false;

      } else if (menuCount > 1) {
        // Handle single item menus, and handle moving back to the top once they're at the bottom
        workingSubNavActiveItems[menuCount - 1].selected = true;
        workingSubNavActiveItems[0].selected = false;
      }

      // Identify which one is currently selected
      const sel = workingSubNavActiveItems.find(x => x.selected === true)

      // Update state with the selected item for rendering
      return this.setState({
        subNavActiveItems: workingSubNavActiveItems,
        subNavSelectedItem: sel.name
      })
    }
    else {
      return false
    }
  }

  // Fires when a menu item is chosen, or when menu is closed
  resetMenu = () => {
    return [
      this.setState({
        mainNavBar: "active",
        mainNavMenuVisibility: "inactive",
        mainNavCurrentActive: "",
        subNavActiveItems: [],
      }),
      // Update parent component state
      this.props.updateAppComponentState([{ menuBarActive: false }])
    ]
  }

  openMenu = () => {
    // Engine defaults to opening the leftmost (first) menu, and selecting the first item:
    const firstSubMenu = this.props.mainMenuItems.find(x => x.name === this.state.mainNavFirst)

    // Change any menu option to not selected, then make the first one selected
    if (firstSubMenu.items[0].selected !== true) {
      firstSubMenu.items.forEach(f => {
        f.selected = false
      });
      firstSubMenu.items[0].selected = true;
    }


    // Shows the menu options, hides game title and score
    let activate = {
      mainNavBar: "inactive",
      mainNavMenuVisibility: "active",
      mainNavCurrentActive: this.state.mainNavFirst,
      subNavActiveItems: firstSubMenu.items,
      subNavSelectedItem: firstSubMenu.items[0].name
    }

    // Identify first choice to make active
    this.setState(activate)
  }

  componentDidMount() {
    // Identify main menu items:
    const _mainNavMenuItems = [];
    this.props.mainMenuItems.map(mainNavItem => {
      _mainNavMenuItems.push(mainNavItem.top)
    })

    // Array needed in handleKeyboardMenu()
    const mainNavs = []
    _mainNavMenuItems.forEach((element, index) => {
      mainNavs.push("mainNav" + element + "Menu")
    });


    // Build into object to add to component state
    const menuState = {};
    for (const key of _mainNavMenuItems) {
      let newKey = "mainNav" + [key] + "Menu"
      menuState[newKey] = "inactive subMenu"
    }

    this.setState({
      mainNavs: mainNavs,
      mainNavFirst: "mainNav" + _mainNavMenuItems[0] + "Menu"
    })


    // Enable keyboard movement of menu
    document.addEventListener('keydown', (event) => {

      // Handle arrow keys for movement
      if (
        (this.props.menuBarActive === true && this.state.mainNavMenuVisibility === "active") &&
        (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        return this.handleKeyboardMenu(event.key)
      }

      // Handle Enter key for selection
      else if ((this.props.menuBarActive === true && this.state.mainNavMenuVisibility === "active") &&
        (event.key === 'Enter')) {

        // Is the current menu item disabled?
        const selectedDisabled = this.state.subNavActiveItems.find(o => o.name === this.state.subNavSelectedItem)

        if (this.props.heroAlive === false && (selectedDisabled.active !== true || selectedDisabled.titleDisabled === true )) {
          event.preventDefault()
          return false
        }

        else return [

          // Prevent the default action for the enter key (in this case, sumbitting the text parser or closing the modal)
          event.preventDefault(),

          // Take whatever action is selected
          this.props.handleMainMenuAction(this.state.subNavSelectedItem)
        ]
      }

      // Any other keypress is ignored!
      else return false
    }, false);
  }

  componentDidUpdate(prevProps) {
    // Receives the menuBarActive "active" prop from parent (since that's where the event listener is)
    if (this.props.menuBarActive !== prevProps.menuBarActive) {

      if (this.state.mainNavBar === "active") {
        return this.openMenu()
      }
      else {
        return this.resetMenu()
      }
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


        {/* This is the main nav bar. It is "invisible" when inactive, and "visible" when active */}
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

        {/* Submenu choices rendered here */}
        <ul
          id={"subMenu" + this.state.mainNavCurrentActive}
          className={this.state.mainNavCurrentActive != "" ? "subMenu active" : ""}>
          {this.state.subNavActiveItems.map((subMenu, index) => (
            <li
              key={index}
              
              // ID indicates the currently selected submenu item
              id={subMenu.selected === true ? "selected" : ""}

              // data-table indicates if a menu item should be disabled in the Title screen
              data-title={(subMenu.titleDisabled === true && this.props.heroAlive === false) ? "disabledInTitle" : null}

              // handles if the menu item is selectable or not!
              className={subMenu.active === true ? "enabled" : "disabled"}>{subMenu.name}</li>
          ))}
        </ul>
      </header>
    )
  }
}
