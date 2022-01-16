import React, { Component } from 'react';
import PreloadGameAssets from './PreloadGameAssets'
// import MainNavFunctions from './MainNavFunctions';
import Screen from './Screen';
import Modal from './Modal'
import InventoryScreen from './InventoryScreen'
import GameSelector from './GameSelector'
import MainMenuBar from './MainMenuBar'


// Movement workers 🛠 🪚 🧰
// They live outside the src directory because
// Create-React-App tries to merge them and they
// need to remain separate files
const WorkerHandleHeroMovement = new Worker("../workers/WorkerHandleHeroMovement.js");
const WorkerHandleInventoryLocation = new Worker("../workers/WorkerHandleInventoryLocation.js");

export default class App extends Component {
  constructor() {
    super();

    this.state = {

      // Meta
      title: "",
      subTitle: "",
      description: "",
      version: 0,

      // Modal
      modalTextScript: [],
      modalClickToClose: true,
      modalStatus: false,
      modalText: "",
      modalTextSlot2: "",
      modalTextSlot3: "",
      modalTextSlot4: "",
      modalWidthDefault: 560,
      modalTopDefault: 200,
      modalWidth: 560,
      modalTop: 200,
      modalConfirmation: "", // occurs optionally when a modal is used as a confirmation and the enter key closes it

      // Menu state
      menuBarActive: false,
      mainMenuItems: [
        {
          top: "Game",
          name: "mainNavGameMenu",
          order: 1,
          items: [
            {
              name: "Help",
              active: true,
              selected: true
            }, {
              name: "About",
              active: true,
              selected: false
            }
          ]
        }, {
          top: "File",
          name: "mainNavFileMenu",
          order: 2,
          items: [{
            name: "Save Game",
            active: false,
            selected: true
          }, {
            name: "Load Game",
            active: false,
            selected: false
          }, {
            name: "Restart",
            active: true,
            selected: false
          }, {
            name: "------",
            active: false,
            selected: false
          }, {
            name: "Swap Game",
            active: false,
            selected: false
          }]
        }, {
          top: "Speed",
          name: "mainNavSpeedMenu",
          order: 3, items: [
            {
              name: "Fastest",
              active: true,
              selected: true
            },
            {
              name: "Fast",
              active: true,
              selected: false
            },
            {
              name: "Normal",
              active: true,
              selected: false
            },
            {
              name: "Slow",
              active: true,
              selected: false
            }

          ]
        }, {
          top: "Sound",
          name: "mainNavSoundMenu", order: 4, items: [{
            name: "Sound On/Off",
            active: false,
            selected: true
          }]
        }],

      // Inventory
      inventory: [],
      inventoryVisable: false,

      // Hero stuff
      heroAlive: true,
      heroLastDirection: "",
      heroDirection: "ArrowRight",
      heroMoving: "stopped",
      heroPositionX: 75,
      heroPositionY: 75,
      heroPositionCollided: false,
      heroMovementDisance: 5,
      heroMovementUpdateSpeed: 105,
      heroMovementSpeeds: [100, 65, 30, 1],
      heroHeight: 0,
      heroWidth: 0,
      heroSprite: "",

      // Score!
      highScore: 100,
      currentScore: 0,

      // Room stuff
      rooms: [],
      roomExits: [],
      roomCurrent: "",
      roomPrevious: "",
      roomCurrentObjects: [],
      roomVisibleInventory: "",
      roomNearbyInventoryItems: [],

      // Game state stuff
      gameLogic: "",
      playfieldX: 0,
      playfieldY: 0,
      pausedgame: false,
      soundOn: true,
      textParserValue: "",
      submittedText: "",
      helpText: "Default text for the game's help",
      flags: {}
    };
  }

  // Accepts an array of objects for state updates from child components
  updateAppComponentState = (passedState, sequence = 1, pause = 0) => {

    // Check and see if there's a delay on the state change
    let statePause = pause;

    if (passedState[sequence - 1].statePause !== undefined) {
      statePause = passedState[sequence - 1].statePause;
    }

    // Update state
    return setTimeout(() => {

      // if there's a multiple lined text script, set it in state first, then display it
      if (passedState[sequence - 1].modalTextScript !== undefined && passedState[sequence - 1].modalTextScript.length > 0) {
        console.log('multiline script updated')
        this.setState(passedState[sequence - 1])
        this.handleSubmittedTextModal(this.state.modalTextScript)

        // Otherwise, just update state
      } else {
        this.setState(passedState[sequence - 1])
      }


      // Since we may need to execute multiple state changes, recursively, 
      // we need to check and see if we're the last one in the array of objects
      let sequenceLast = false;

      if (passedState.length === sequence) {
        // console.log("This is the last item in the array of objects")
        sequenceLast = true
      }


      if (sequenceLast === false) {
        this.updateAppComponentState(passedState, sequence + 1)
      }

    }, statePause)
  }



  // No glory without sacrifice, no growth without pain
  gameOver = (message) => {

    // Set player status
    this.setState({
      heroAlive: false
    })

    if (message === undefined) {
      const msg = "Game Over. Thank you for playing " + this.state.title + ". You can restart or load a saved game."
      this.handleSubmittedTextModal(msg)
    }

  }

  // Accepts commands from main navigation, then routes them to helper funciton file
  handleMainMenuAction = (action) => {

    // Player has made a selection - close the menu!
    this.setState({ menuBarActive: false })

    // Cycle through built-in functions first
    if (action === 'About') {
      this.setState({
        modalTextSlot2: this.state.subTitle,
        modalTextSlot3: this.state.description,
        modalTextSlot4: "Version: " + this.state.version
      })
      return this.handleSubmittedTextModal(this.state.title)
    }
    else if (action === 'Help') {
      return this.handleSubmittedTextModal(this.state.helpText)
    }
    else if (action === 'Slow') {
      return this.setState({
        heroMovementDisance: 3,
        heroMovementUpdateSpeed: this.state.heroMovementSpeeds[0]
      })
    }
    else if (action === 'Normal') {
      return this.setState({
        heroMovementDisance: 4,
        heroMovementUpdateSpeed: this.state.heroMovementSpeeds[1]
      })
    }
    else if (action === 'Fast') {
      return this.setState({
        heroMovementDisance: 8,
        heroMovementUpdateSpeed: this.state.heroMovementSpeeds[2]
      })
    }
    else if (action === 'Fastest') {
      return this.setState({
        heroMovementDisance: 10,
        heroMovementUpdateSpeed: this.state.heroMovementSpeeds[3]
      })
    }
    else if (action === 'Toggle Sound') {
      this.setState(prevState => ({
        soundOn: !prevState.soundOn
      }))
      const soundString = this.state.soundOn ? "On" : "Off";
      return this.handleSubmittedTextModal("Sound is now " + soundString)
    }

    else if (action === 'Restart') {

      // ask if player wants to restart.  If OK, window.reload, else return false

      this.setState({
        modalConfirmation: "restart",
        modalTextSlot2: "Press ENTER to restart your game, all progress will be lost.",
        modalTextSlot3: "Press ESCAPE to continue this game.",
      })
      return this.handleSubmittedTextModal("RESTART GAME")
    }
    else if (action === 'Save Game') {
      this.setState({
        modalConfirmation: "saveGame",
        modalTextSlot2: "Press ENTER to save your current game to this computer. It will overwrite any existing save.",
        modalTextSlot3: "Press ESCAPE to cancel.",
      })
      return this.handleSubmittedTextModal("SAVE GAME.")
    }

    else if (action === 'Load Game') {

      // Add check for an actual saved game?
      this.setState({
        modalConfirmation: "loadSaveGame",
        modalTextSlot2: "You are about to load your saved game.",
        modalTextSlot3: "Press ENTER to continue.",
        modalTextSlot4: "Press ESCAPE to cancel.",
      })
      return this.handleSubmittedTextModal("LOAD A SAVED GAME.")

    }

    else {

      // Then pass off to gameLogic.js
      return false
    }



  }

  // Routes commands that run when a modal is closed.
  confirmationCommand = (command) => {

    if (command === 'restart') {
      return window.location.reload()
    }

    else if (command === "saveGame") {
      return this.saveGame()
    }

    else if (command === "loadSaveGame") {
      return this.loadSaveGame()
    }


    // Anything not in here is passed to gameLogic.js

  }

  // Closes an open dialog box
  hideModal = (event) => {

    // Check first if a post-enter command has been decreed.
    // This optional command will fire when Enter is pressed
    if (this.state.modalConfirmation !== "" && this.state.modalClickToClose === true && event.key !== 'Escape') {
      return [
        this.confirmationCommand(this.state.modalConfirmation)
      ]
    }

    // Now close the modal
    if (this.state.modalClickToClose === true) {
      return this.setState({
        modalConfirmation: "",
        modalClickToClose: true,
        modalStatus: false,
        modalTextSlot2: "",
        modalTextSlot3: "",
        modalTextSlot4: "",
        pausedgame: false
      });
    }
  }

  saveGame = () => {
    // Remove what's not needed from state before saving. 
    this.setState({
      modalConfirmation: "",
      modalTextSlot2: "",
      modalTextSlot3: "",
      modalTextSlot4: "",
    })

    // Capture the current games state
    const savedState = this.state

    // Get rid of stuff we dom't need when saving
    delete savedState.modalConfirmation
    delete savedState.modalTextSlot2
    delete savedState.modalTextSlot3
    delete savedState.modalTextSlot4
    delete savedState.gameLogic



    return [
      localStorage.setItem(this.state.title, JSON.stringify(savedState)),
      this.handleSubmittedTextModal("Game saved successfully. Press ENTER to continue.")
    ]
  }

  loadSaveGame = () => {

    this.setState({
      modalConfirmation: "",
      modalTextSlot2: "",
      modalTextSlot3: "",
      modalTextSlot4: "",
    })
    const loadedSave = JSON.parse(localStorage.getItem(this.state.title))

    if (loadedSave !== null) {
      return [
        this.setState(loadedSave),
        this.handleSubmittedTextModal("Game loaded successfully. Press ENTER to continue.")
      ]
    }
    else {
      return this.handleSubmittedTextModal("No saved data found on this computer. Press ENTER to continue.")
    }
  }

  // When parser submits, text is stored in State and input field cleared
  textPopulateStateAndClearParser = (event) => {
    return this.setState({
      submittedText: event.target.elements[0].value,
      textParserValue: ""
    })
  }

  // Updates state as letters are typed into input field
  textParserChange = (event) => {

    // Is a value false?
    const checkFalse = (val) => val === false;

    // Only allow text input when these resolve to false
    const toCheck = [
      this.state.pausedgame,
      this.state.inventoryVisable,
      this.state.menuBarActive,
      this.state.modalStatus
    ]

    if (toCheck.every(checkFalse) === true) {
      return this.setState({ textParserValue: event.target.value })
    }
  }

  // Handles text display - and usually opens a modal
  // The type of passed data determines the results.
  handleSubmittedTextModal = (passedText) => {

    // Create a function scoped variable for the width and position
    // from the top of the modal. Set it to the default each time at the
    // start, it may get modified depending on type and passed data
    let makeModalWidth = this.state.modalWidthDefault;
    let makeModalTop = this.state.modalTopDefault;

    this.haltHero();

    // Accepts a quick bit of text
    // No customization of width/top
    if (typeof passedText === "string") {
      // console.log(passedText)
      // console.log(typeof passedText)
      console.log('start handleSubmittedTextModal')
      return [
        this.setState({
          modalClickToClose: true,
          modalText: passedText,
          modalStatus: true,
          pausedgame: true,
          modalWidth: makeModalWidth,
          modalTop: makeModalTop
        })]
    }

    if (typeof passedText === "object") {

      // Check if custom width or distance-from-top is passed
      if (passedText[0].modalWidth !== 'undefined') {
        makeModalWidth = passedText[0].modalWidth
      }
      if (passedText[0].modalTop !== 'undefined') {
        makeModalTop = passedText[0].modalTop
      }

      return [
        // First update the state with the passed object.
        this.setState({ modalTextScript: passedText }),

        // Show the first modal immediately (otherwise you incur a delay on the timer)
        this.setState({
          modalClickToClose: true,
          modalText: passedText[0].modalText,
          modalStatus: true,
          pausedgame: true,
          modalWidth: makeModalWidth,
          modalTop: makeModalTop
        }),

        // Call the next one!
        this.handleSubmittedTextModal(1)
      ]
    }

    if (typeof passedText === "number") {

      // These need to be declared up front to
      // prevent es-lint errors
      let modalChecker, modalShower;

      // Smell for custom widths, heights
      if (this.state.modalTextScript[passedText] !== undefined && this.state.modalTextScript[passedText].modalWidth !== 'undefined') {
        makeModalWidth = this.state.modalTextScript[passedText].modalWidth
      }
      if (this.state.modalTextScript[passedText] !== undefined && this.state.modalTextScript[passedText].modalTop !== 'undefined') {
        makeModalTop = this.state.modalTextScript[passedText].modalTop
      }

      return [
        // Check to detect the state of the modal. If it's closed, we can open the next modal! 
        modalChecker = setInterval(() => {
          if (this.state.modalStatus === false) {
            return modalShower();
          }
        }, 200),


        modalShower = () => {
          // Stop our timer that waits for user to hit enter
          clearInterval(modalChecker)

          // Show the modal
          this.setState({
            modalClickToClose: true,
            modalText: this.state.modalTextScript[passedText].modalText,
            modalStatus: true,
            pausedgame: true,
            modalWidth: makeModalWidth,
            modalTop: makeModalTop
          })

          if (passedText + 1 < this.state.modalTextScript.length) {
            this.handleSubmittedTextModal(passedText + 1)
          }
        }
      ]

    }
  }

  // Update Player Score - EXPECTS NUMBER
  updateScore = (points) => {
    let newScore = this.state.currentScore + points
    return this.setState({ currentScore: newScore })
  }

  // Adds item to inventory - EXPECTS STRING
  addToInventory = (addItem) => {

    // Find item in game (not player) Inventory. All inventory items must be in the gamedata.json file at startup.
    const matchedItem = this.state.inventory.findIndex(item => item.Name.toLowerCase() === addItem)

    // Change owned from false to true with setState
    let newInventory = [...this.state.inventory]
    let newRoomInventory = [...this.state.roomVisibleInventory]

    // If the player doesn't have it already, add it:
    if (newInventory[matchedItem].owned !== true) {
      console.log('add to inventory!')

      newInventory[matchedItem].owned = true

      // Update state (and player's inventory screen) with new item
      return this.setState({ inventory: newInventory, roomVisibleInventory: newRoomInventory })

    }
  }

  // Remove item(s) from inventory - EXPECTS ARRAY
  removeFromInventory = (removeItem) => {

    return removeItem.forEach(item => {

      // Find item in game (not player) Inventory. All inventory items must be in the gamedata.json file at startup.
      const matchedItem = this.state.inventory.findIndex(invItem => invItem.Name.toLowerCase() === item.toLowerCase())

      // Create a copy of the current state's Inventory
      let newInventory = [...this.state.inventory]

      // For the matching item, change owned status to false
      newInventory[matchedItem].owned = false;

      // And availability to false, so they can't immediately get it again
      newInventory[matchedItem].available = false;

      // Update state with the new inventory
      this.setState({ inventory: newInventory })
    })
  }

  // Show or hide Inventory Screen
  toggleInventoryScreen = () => {

    // Is a value false?
    const checkFalse = (val) => val === false;

    // Only allow inventory toggle when these resolve to false
    const toCheck = [
      this.state.pausedgame,
      this.state.inventoryVisable,
      this.state.menuBarActive,
      this.state.modalStatus
    ]

    if (toCheck.every(checkFalse) === true) {
      return [
        this.setState({
          inventoryVisable: true,
          pausedgame: true
        }),
        this.haltHero()
      ]
    } else {
      return this.setState({
        inventoryVisable: false,
        pausedgame: false
      })
    }
  }

  // Add/Edit/Remove flag changes
  handleFlagChange = (flagChange) => {

    /* EXPECTS OBJECT 
    {
      "hasDanced": true,
      "bananaPhone": false,
    } 
    */

    let updateFlags = {
      ...this.state.flags, // Existing Flags
      ...flagChange        // New or updated flags
    }

    this.setState({ flags: updateFlags })
  }

  // Stop the hero in their tracks
  haltHero = () => {
    this.handleHeroPositioning("stop")
    this.setState({ heroMoving: "stopped" })
  }

  // Taking input from keyboard controls, 
  // move hero around the screen and
  // stop hero if they bash into walls and objects

  // inputs are change type ... direction or stop
  // outputs are function like this.halthero() or setstate
  handleHeroPositioning = (change) => {
    
    if (change !== "stop") {

      // Check hitbox size?

      // check for collision before moving

      this.movementInterval = setInterval(() => {

        // Post hero's chosen direction and current details to worker
        WorkerHandleHeroMovement.postMessage({
          "direction": change,
          heroPositionX: this.state.heroPositionX,
          heroPositionY: this.state.heroPositionY,
          heroWidth: this.state.heroWidth,
          heroHeight: this.state.heroHeight,
          heroDirection: this.state.heroDirection,
          heroLastDirection: this.state.heroLastDirection,
          heroPositionCollided: this.state.heroPositionCollided,
          heroMoving: this.state.heroMoving,
          heroMovementDisance: this.state.heroMovementDisance,
          playfieldX: this.state.playfieldX,
          playfieldY: this.state.playfieldY,
          roomCurrentObjects: this.state.roomCurrentObjects,
          roomExits: this.state.roomExits,
        });

        // Check Hero's position against on-screen inventory items
        WorkerHandleInventoryLocation.postMessage({
          heroPositionX: this.state.heroPositionX,
          heroPositionY: this.state.heroPositionY,
          heroWidth: this.state.heroWidth,
          heroHeight: this.state.heroHeight,
          roomVisibleInventory: this.state.roomVisibleInventory,
        })

      }, this.state.heroMovementUpdateSpeed)


    
    } else {

      // This else is actually what stops the character.
      return clearInterval(this.movementInterval)
    }
  };


  handleHeroMovement = (keypress) => {

    // Don't move the hero if the game is paused
    if (this.state.pausedgame === false && this.state.menuBarActive === false) {

      // If hero is moving and a different movement direction is picked
      if (this.state.heroMoving === "moving" && this.state.heroDirection !== keypress) {
        // Change hero direction and keep hero moving
        this.setState({ heroLastDirection: this.state.heroDirection, heroDirection: keypress, heroMoving: "moving" });
        this.handleHeroPositioning("stop") // stop first
        this.handleHeroPositioning(keypress) // then go
      }
      // If they're moving and they hit the same direciton key, stop them
      else if (this.state.heroMoving === "moving" && this.state.heroDirection === keypress) {
        this.haltHero();
      }
      // Otherwise, let the hero walk
      else {
        this.handleHeroPositioning(keypress)
        this.setState({ heroLastDirection: this.state.heroDirection, heroDirection: keypress, heroMoving: "moving" });
      }
    }
  };

  // Adds event listeners for key presses.
  // Game engine is scoped for arrow keys to move character, tab key for inventory, and escape key for main menu
  setdefaultKeyboardListners = () => {
    return document.addEventListener('keydown', (event) => {

      // "Any key" can close the inventory screen, we start with that
      if (this.state.inventoryVisable === true) {
        return [
          event.preventDefault(),
          this.toggleInventoryScreen()
        ]
      }

      // Handle Enter key for modals where Enter is the confirmation
      else if (event.key === 'Enter') {
        /* 
          Maybe not a good idea? There's a submit event that uses the enter key on screen.js
        */
      }

      // This opens the inventory screen
      else if (this.state.inventoryVisable === false && event.key === 'Tab') {
        return [
          event.preventDefault(),
          this.toggleInventoryScreen()
        ]
      }

      // Handle Escape key to close modal dialog box
      else if (event.key === "Escape" && this.state.inventoryVisable === false && this.state.modalStatus === true) {
        return [
          event.preventDefault(),
          this.hideModal(event)
        ]
      }

      // Handle Escape key to toggle main menu
      else if (event.key === "Escape" && this.state.inventoryVisable === false && this.state.modalStatus === false) {
        return [
          event.preventDefault(),
          this.haltHero(),
          this.setState({ menuBarActive: this.state.menuBarActive ? false : true })
        ]
      }

      // Handle arrow keys for movement
      else if (
        (this.state.inventoryVisable === false && this.state.pausedgame === false) &&
        (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        return [
          event.preventDefault(),
          this.handleHeroMovement(event.key)
        ]
      }

      // Any other keypress is ignored here!
      else {
        return false
      }
    }, false);
  }


  // Loads a room onto the screen
    // Also fires a roomChange() functio in gameLogic.js for custom per-room things
  loadRoom = (roomToLoad) => {

    function isRoom(r) {
      return r.Room === roomToLoad;
    }

    const nextRoom = this.state.rooms.find(isRoom);

    // Add exit position for right and bottom room exits
    // since we don't necessarily know the dimensions of
    // the game play area.
    for (let roomExit of nextRoom.roomExits) {
      if (roomExit.exit === "right") {
        roomExit.y = this.state.playfieldX - 5
      } else if (roomExit.exit === "bottom") {
        roomExit.x = this.state.playfieldY - 5
      }
    }


    // Set position of hero for travel from one room to the next
    if (this.state.heroDirection === "ArrowUp") {
      this.setState({
        heroPositionX: this.state.playfieldY - this.state.heroHeight - 5,
      })
    } else if (this.state.heroDirection === "ArrowLeft") {
      this.setState({
        heroPositionY: this.state.playfieldX - this.state.heroWidth - 5
      })
    } else if (this.state.heroDirection === "ArrowRight") {
      this.setState({
        heroPositionY: 5,
      })
    } else if (this.state.heroDirection === "ArrowDown") {
      this.setState({
        heroPositionX: 5,
      })
    }

    // Add any inventory items that need to be displayed.
    // Should be ownable and not in inventory already

    const roomInv = this.state.inventory.filter(inv => inv.FoundRoom === nextRoom.Room && inv.owned === false && inv.Visible === true);

    // Set room stage
    this.setState({
      roomCurrent: nextRoom.Room,
      roomCurrentObjects: nextRoom.displayObjects,
      roomCurrentName: nextRoom.Name,
      roomExits: nextRoom.roomExits,
      roomMessages: nextRoom.messages,
      roomCurrentDescription: nextRoom.Description,
      roomVisibleInventory: roomInv
    })


    // Execute any custom room logic as soon as the room loads
    // This might check a flag or read inventory status and change the look of the room.
    // It's technically (hopefully? Oof, batching) a second React state update.

    // Only do this if gameLogic.js exists:
    if (typeof self.roomChange === "function") {

      // The new room and the application state are passed to gameLogic.js
      const roomFunc = self.roomChange(nextRoom.Room, this.state);

      // roomChange() will return an array of things!

      /* 
        [
          00, // delay before firing
          {}, // updates for state in app.js 
          "halt" // optional, stops the character
        ]
      */

      if (roomFunc !== undefined && typeof roomFunc === 'object') {

        setTimeout(() => {
          this.setState(roomFunc[1]);

          // roomChange() array might pass back a halt to stop the player
          if (roomFunc.indexOf('halt') !== -1) {
            this.haltHero()
          }

        }, roomFunc[0])
      }

    }
  }


  // When a game is loaded, update React State with game data
  loadGameFile = (game) => {
    console.info("App component loads " + game.title)

    const gameLoadedState = { ...this.state, ...game }

    this.setState(gameLoadedState)

    this.loadRoom(2); // change this to be dynamic
  }

  componentDidMount = () => {

    // When the component mounts, start an event listener for web worker updates.
    WorkerHandleHeroMovement.onmessage = (e) => {

      // Update state based on returned value
      requestAnimationFrame(() => {
        if (typeof e.data === "number") {
          this.loadRoom(e.data);   // If a room number is returned, that means the hero has hit an exit wall
        } else if (e.data === "halt") {
          this.haltHero();
        } else if (e.data === "haltCollide") {
          this.setState({ heroPositionCollided: true })
          this.haltHero();
        } else {
          this.setState(e.data)
        }
      });
    }


    // Web worker to handle the player's proximity to on screen inventory items
    WorkerHandleInventoryLocation.onmessage = (e) => {
      if (this.state.roomNearbyInventoryItems !== e.data) {
        this.setState({ roomNearbyInventoryItems: e.data })
      }
    }

    // Set event listener keyboard key presses
    this.setdefaultKeyboardListners();
  }

  componentDidUpdate = (prevState) => {

    // Make game state available for gameLogic.js
    if (prevState !== this.state) {
      window.gameState = this.state;
    }

  }

  render() {
    return (
      <React.Fragment>

        <InventoryScreen
          inventoryVisable={this.state.inventoryVisable}
          inventory={this.state.inventory} />

        <Modal
          modalWidth={this.state.modalWidth}
          modalTop={this.state.modalTop}
          hideModal={this.hideModal}
          modalClickToClose={this.state.modalClickToClose}
          modalStatus={this.state.modalStatus}
          modalText={this.state.modalText}
          modalTextSlot2={this.state.modalTextSlot2}
          modalTextSlot3={this.state.modalTextSlot3}
          modalTextSlot4={this.state.modalTextSlot4}
        />


        <MainMenuBar
          menuBarActive={this.state.menuBarActive}
          mainMenuItems={this.state.mainMenuItems}
          currentScore={this.state.currentScore}
          highScore={this.state.highScore}
          gameWidth={this.state.playfieldX}
          gameTitle={this.state.title}
          handleMainMenuAction={this.handleMainMenuAction}
          updateAppComponentState={this.updateAppComponentState} />

        <Screen
          // Game dimensions
          gameWidth={this.state.playfieldX}
          gameHeight={this.state.playfieldY}
          gameLogic={this.state.gameLogic}

          // Room details
          roomCurrent={this.state.roomCurrent}  // Room number, number
          roomCurrentName={this.state.roomCurrentName}  // This is the room's primary style class, string
          roomCurrentAltStyle={this.state.roomCurrentAltStyle} // Secondary room style class for CSS, string
          roomCurrentObjects={this.state.roomCurrentObjects}
          roomCurrentDescription={this.state.roomCurrentDescription}
          roomExits={this.state.roomExits}
          roomNearbyInventoryItems={this.state.roomNearbyInventoryItems}

          // Hero details
          haltHero={this.haltHero}
          handleHeroPositioning={this.handleHeroPositioning}
          heroDirection={this.state.heroDirection}
          heroMoving={this.state.heroMoving}
          heroPositionX={this.state.heroPositionX}
          heroPositionY={this.state.heroPositionY}
          heroHeight={this.state.heroHeight}
          heroWidth={this.state.heroWidth}
          heroSprite={this.state.heroSprite}

          // Text parser details
          inventory={this.state.inventory}
          submittedText={this.state.submittedText}
          textParserValue={this.state.textParserValue}
          textPopulateStateAndClearParser={this.textPopulateStateAndClearParser}
          setdefaultKeyboardListners={this.setdefaultKeyboardListners}
          submitTextParser={this.submitTextParser}
          textParserChange={this.textParserChange}
          handleSubmittedTextModal={this.handleSubmittedTextModal}

          // Main Menu status
          menuBarActive={this.state.menuBarActive}

          // Modal
          modalStatus={this.state.modalStatus}

          // Doing stuff
          toggleInventoryScreen={this.toggleInventoryScreen}
          updateScore={this.updateScore}
          handleFlagChange={this.handleFlagChange}
          helpText={this.state.helpText}
          hideModal={this.hideModal}
          addToInventory={this.addToInventory}
          removeFromInventory={this.removeFromInventory}
          inventoryVisable={this.state.inventoryVisable}
          pausedgame={this.state.pausedgame}
          soundOn={this.state.soundOn}
          flags={this.state.flags}
          updateAppComponentState={this.updateAppComponentState}
        />

        <br />
        <GameSelector loadGameFile={this.loadGameFile} />

        <PreloadGameAssets
          gameLogic={this.state.gameLogic} />

      </React.Fragment>
    );
  }
}
