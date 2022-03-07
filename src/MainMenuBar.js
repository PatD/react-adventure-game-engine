import React, { useState, useEffect } from "react";
import MainMenuScore from './MainMenuScore.js'

// Handles main menu

const MainMenuBar = (props) => {

  // Initial state - all menus are closed, and the score and title are displayed to the user
  const [mainNavBar, setMainNavBar] = useState("active")              // The main menu is active, no menu options shown
  const [mainNavMenuVisibility, setMainNavMenuVisibility] = useState("inactive") // Shown when user hits escape and can choose menu items.
  const [mainNavs, setMainNavs] = useState([])                         //  handlekeyboardMenu() uses these as reference
  const [mainNavFirst, setMainNavFirst] = useState("")                 // The left-most menu item. 
  const [mainNavCurrentActive, setMainNavCurrentActive] = useState("")  // The submenu that is currenlty open. There can be only 1!
  const [subNavActiveItems, setSubNavActiveItems] = useState([])        // Currently open menu
  const [subNavSelectedItem, setSubNavSelectedItem] = useState("")      // currently highlighted item

  // Routes key commands to move around the main menu.
  const handleKeyboardMenu = (key) => {

    // Number: Find currently active main nav in the array, as a number
    const currentNum = mainNavs.findIndex(i => i == mainNavCurrentActive)

    // Handle direcitons presses
    if ((key === "ArrowRight") && (mainNavs.length !== currentNum + 1)) {
      // The the next right-arrow choice is made, open the submenu for it
      const newMenuItems = props.mainMenuItems.find(x => x.name === mainNavs[currentNum + 1])
      const newMenuSelected = newMenuItems.items.find(s => s.selected === true)

      // Reset the subMenu on the way out. Otherwise it keeps the middle seleciton
      return [
        setMainNavCurrentActive(mainNavs[currentNum + 1]),
        setSubNavActiveItems(newMenuItems.items),
        setSubNavSelectedItem(newMenuSelected.name)
      ]
    }
    else if (key === "ArrowLeft" && currentNum !== 0) {
      // The the next left-arrow choice is made, open the submenu for it
      const newMenuItems = props.mainMenuItems.find(x => x.name === mainNavs[currentNum - 1])
      const newMenuSelected = newMenuItems.items.find(s => s.selected === true)

      return [
        setMainNavCurrentActive(mainNavs[currentNum - 1]),
        setSubNavActiveItems(newMenuItems.items),
        setSubNavSelectedItem(newMenuSelected.name)
      ]
    }
    else if (key === "ArrowDown") {

      // Copy of the currently open menu.
      // When a user chnages a selection, we update state with the new object to show what's selected
      const workingSubNavActiveItems = subNavActiveItems;

      // Number of items in the open sub menu
      const menuCount = subNavActiveItems.length;

      // Currently selected item:
      const currentSelected = subNavActiveItems.findIndex(x => x.selected === true);

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
      return [
        setSubNavActiveItems(workingSubNavActiveItems),
        setSubNavSelectedItem(sel.name)
      ]
    }
    else if (key === "ArrowUp") {
      // Copy of the currently open menu.
      // When a user chnages a selection, we update state with the new object to show what's selected
      const workingSubNavActiveItems = subNavActiveItems;

      // Number of items in the open sub menu
      const menuCount = subNavActiveItems.length;

      // Currently selected item:
      const currentSelected = subNavActiveItems.findIndex(x => x.selected === true);

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
      return [
        setSubNavActiveItems(workingSubNavActiveItems),
        setSubNavSelectedItem(sel.name)
      ]
    }
    else if (key === 'Enter') {

      // Is the current menu item disabled?
      const selectedDisabled = subNavActiveItems.find(o => o.name === subNavSelectedItem)

      if (props.heroAlive === false && (selectedDisabled.active !== true || selectedDisabled.titleDisabled === true)) {
        return false
      }

      else
        return props.handleMainMenuAction(subNavSelectedItem)
    }

    else {
      return false
    }
  }

  // Fires when a menu item is chosen, or when menu needs to be closed
  const resetMenu = () => {
    return [
      setMainNavBar("active"),
      setMainNavMenuVisibility("inactive"),
      setMainNavCurrentActive(""),
      setSubNavActiveItems([]),

      // Update parent component state
      props.updateAppComponentState([{ menuBarActive: false }])
    ]
  }

  // Fires when the escap key is pressed and the main menu needs to be opened
  const openMenu = () => {

    // Engine defaults to opening the leftmost (first) menu, and selecting the first item:
    const firstSubMenu = props.mainMenuItems.find(x => x.name === mainNavFirst)

    // Change any menu option to not selected, then make the first one selected
    if (firstSubMenu !== undefined && firstSubMenu.items[0].selected !== true) {
      firstSubMenu.items.forEach(f => {
        f.selected = false
      });
      firstSubMenu.items[0].selected = true;
    }


    // Shows the menu options, hides game title and score
    if (firstSubMenu !== undefined) {
      return [
        setMainNavBar("inactive"),
        setMainNavMenuVisibility("active"),
        setMainNavCurrentActive(mainNavFirst),
        setSubNavActiveItems(firstSubMenu.items),
        setSubNavSelectedItem(firstSubMenu.items[0].name)
      ]
    } else {
      return false
    }
  }


  // Build the menu choices when the component mounts
  useEffect(() => {

    // Identify main menu items:
    const _mainNavMenuItems = [];
    props.mainMenuItems.map(mainNavItem => {
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

    return [
      setMainNavs(mainNavs),
      setMainNavFirst("mainNav" + _mainNavMenuItems[0] + "Menu")
    ]

  }, []);


  // Listens for the Escape key change that toggles the main menu.
  // Receives the menuBarActive "active" prop from parent (since that's where the event listener is)
  useEffect(() => {

    if (mainNavBar === "active") {
      return openMenu()
    }
    else {
      return resetMenu()
    }
  }, [props.menuBarActive]);


  // Listens for arrow key and enter key presses when the meni is open.
  useEffect(() => {
    if (mainNavBar !== "active") {
      // console.log(props.keyPress)
      handleKeyboardMenu(props.keyPress)
    }
  }, [props.keyPress, props.keyRefresh])


  return (
    <React.Fragment>
      <header style={{ width: props.gameWidth }}>
        <div id="menuBarDefaultDisplay" className={mainNavBar}>
          <MainMenuScore
            currentScore={props.currentScore}
            highScore={props.highScore}
          />

          <span id="gameTitle">{props.gameTitle}</span>
        </div>


        {/* This is the main nav bar. It is "invisible" when inactive, and "visible" when active */}
        <div id="menuBarNavBarActive" className={mainNavMenuVisibility} >
          <ul>
            {props.mainMenuItems.map(main => (
              <li
                className={mainNavCurrentActive === "mainNav" + main.top + "Menu" ? "active" : "inactive"}
                key={main.order}
              >{main.top}</li>
            ))}
          </ul>
        </div>

        {/* Submenu choices rendered here */}
        <ul
          id={"subMenu" + mainNavCurrentActive}
          className={mainNavCurrentActive != "" ? "subMenu active" : ""}>
          {subNavActiveItems.map((subMenu, index) => (
            <li
              key={index}

              // ID indicates the currently selected submenu item
              id={subMenu.selected === true ? "selected" : ""}
            
              // data-title indicates if a menu item should be disabled in the Title screen
              data-title={(subMenu.titleDisabled === true && props.heroAlive === false) ? "disabledInTitle" : null}


              // handles if the menu item is selectable or not!
              className={subMenu.active === true ? "enabled" : "disabled"}>{subMenu.name}
              
            </li>
          ))}
        </ul>
      </header>

    </React.Fragment>)

};

export default React.memo(MainMenuBar);
