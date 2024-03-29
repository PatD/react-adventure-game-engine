import React, { Component } from 'react';
import KeyboardControls from './KeyboardControls'
import PlaySound from './PlaySound';
import PreloadGameAssets from './PreloadGameAssets'
import Screen from './Screen';
import Modal from './Modal'
import InventoryScreen from './InventoryScreen'
import GameLoader from './GameLoader'
import MainMenuBar from './MainMenuBar'


// Movement Web Workers 🛠 🪚 🧰

// They live outside the src directory because
// Create-React-App tries to merge them and they
// need to remain separate files
const WorkerHandleHeroMovement = new Worker("../workers/WorkerHandleHeroMovement.js");
const WorkerHandleInventoryLocation = new Worker("../workers/WorkerHandleInventoryLocation.js");
const WorkerHandleDisplayObjectLocation = new Worker("../workers/WorkerHandleDisplayObjectLocation.js");

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
      modalConfirmation: "", // text string, occurs optionally when a modal is used as a confirmation and the enter key closes it

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
            active: true,
            selected: true,
            titleDisabled: true
          }, {
            name: "Load Game",
            active: false,
            selected: false,
            titleDisabled: false
          }, {
            name: "Restart",
            active: true,
            selected: false,
            titleDisabled: false
          }, {
            name: "------",
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
              selected: true,
              titleDisabled: true
            },
            {
              name: "Fast",
              active: true,
              selected: false,
              titleDisabled: true
            },
            {
              name: "Normal",
              active: true,
              selected: false,
              titleDisabled: true
            },
            {
              name: "Slow",
              active: true,
              selected: false,
              titleDisabled: true
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
      heroMovementUpdateSpeed: 55,
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
      roomNearbyDisplayObjects:[],
      roomTitleScreen: false,

      // Other game state stuff
      keyPress: "",
      gameAssetPath: "",
      gameLogic: "",
      playfieldX: 0,
      playfieldY: 0,
      pausedgame: false,
      soundOn: true,
      soundClip: '',
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


  // Receives custom code from gameLogic.js (via textinputparser.js or 
  // room change evnets) and processes it!
  handleCustomReturnedCode = (returnedCode) => {
    console.log(returnedCode)
    // By default, don't delay anything...
    let startDelay = 0

    // ...but the developer can pass a delay in the object and we'll use that.
    if (returnedCode.delay !== undefined && typeof returnedCode.delay === 'number') {
      startDelay = returnedCode.delay
    }

    return setTimeout(() => {

      // Flag changes - expects object
      if (returnedCode.flagSet !== undefined) {
        this.handleFlagChange(returnedCode.flagSet)
      }

      // Handle removing an existing items from inventory - expects array
      if (returnedCode.removeItems !== undefined) {
        this.removeFromInventory(returnedCode.removeItems)
      }

      // Score change - expects number
      if (returnedCode.scoreChange !== undefined) {
        this.updateScore(returnedCode.scoreChange)
      }

      // Stop walking hero - expects boolean
      if (returnedCode.halt !== undefined && returnedCode.halt === true) {
        this.haltHero()
      }

      // Handle state changes in app.js.  Expects array of objects
      // This should be the default way to handle any custom game code
      if (returnedCode.newState !== undefined) {
        this.updateAppComponentState(returnedCode.newState);
      }

      // Code can pass some custom js code back, but this isn't a great
      // idea. Game change should be managed through React state.
      if (returnedCode.custFunc !== undefined) {
        returnedCode.custFunc()
      }

    }, startDelay)
  }


  // Runs after the room change - executes any per-room change in gamelogic.js
  // Expects NUMBER
  handleRoomChangeCustomCode = (room) => {
    
    // Only do this if gameLogic.js exists:
    if (typeof self.roomChange === "function") {

      // The new room and the application state are passed to gameLogic.js
      const roomFunc = self.roomChange(room, this.state);

      // roomChange() will return an array of things!

      /* Todo: Make the return the same for roomchange as customTextParser */


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


  toggleMainMenu = () => {
    this.haltHero()
    this.setState({ menuBarActive: this.state.menuBarActive ? false : true })
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
      const soundString = this.state.soundOn ? "Off" : "On";
      return this.handleSubmittedTextModal("Sound is now " + soundString)
    }
    else if (action === 'Restart') {
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
      this.setState({
        modalConfirmation: "loadSaveGame",
        modalTextSlot2: "You are about to load your saved game.",
        modalTextSlot3: "Press ENTER to continue.",
        modalTextSlot4: "Press ESCAPE to cancel.",
      })
      return this.handleSubmittedTextModal("LOAD A SAVED GAME.")
    }

    else {
      // Todo: Add ability to add extra menu commands in gamelogic.js
      return false
    }
  }

  // Helper funciton that updates state from KeyboardControls.js
  handleMainMenuKeyPress = (key) => {
    return this.setState({ keyPress: key })
  }

  // Fires commands after an Enter press in a modal with a "Press Enter to X, Press Escape to Cancel" prompt
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

    else return false

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
  textPopulateStateAndClearParser = (textToParse) => {
    return this.setState({
      submittedText: textToParse,
      textParserValue: ""
    })
  }

  // Updates state as letters are typed into input field
  textParserChange = (keyPress) => {

    // Handle regular characters
    if (typeof keyPress === 'string' && keyPress !== 'Backspace') {
      const newText = this.state.textParserValue + keyPress
      return this.setState({ textParserValue: newText })

    // Handle backspace.
    } else if (typeof keyPress === 'string' && keyPress === 'Backspace') {
      const backspaceText = this.state.textParserValue.slice(0, -1)
      return this.setState({ textParserValue: backspaceText })
    } else {
      return false
    }
  }

  // Handles modal display, including multiple modals in sequence
  // EXPECTS STRING OR OBJECT. JAVASCRIPT!
  handleSubmittedTextModal = (passedText) => {

    // Create a function scoped variable for the width and position
    // from the top of the modal. Set it to the default each time at the
    // start, it may get modified depending on type and passed data
    let makeModalWidth = this.state.modalWidthDefault;
    let makeModalTop = this.state.modalTopDefault;

    // Pause the character's movement when a modal is opened
    this.haltHero();

    // Handle modal display when a string is passed to this function.
    // No support for width/top changing
    if (typeof passedText === "string") {
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

    // Handle modal display when an object is passed to this functin.
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

        // Show the first modal immediately.
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

    if (this.state.inventoryVisable === false) {
      return [
        this.setState({
          inventoryVisable: true,
          pausedgame: true
        }),
        this.haltHero()
      ]
    } else {
      return [
        this.setState({
          inventoryVisable: false,
          pausedgame: false
        })
      ]
    }

  }

  // Add/Edit/Remove - EXPECTS OBJECT 
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

        // Check Hero's position against on-screen display Objects
        WorkerHandleDisplayObjectLocation.postMessage({
          heroPositionX: this.state.heroPositionX,
          heroPositionY: this.state.heroPositionY,
          heroWidth: this.state.heroWidth,
          heroHeight: this.state.heroHeight,
          roomCurrentObjects: this.state.roomCurrentObjects,
        })

      }, this.state.heroMovementUpdateSpeed)



    } else {

      // This else is actually what stops the character.
      return clearInterval(this.movementInterval)
    }
  };


  // Moves hero based on keyboard input - EXPECTS STRING OF KEYPRESS ArrowUp, ArrowDown, ArrowLeft, ArrowRight
  handleHeroMovement = (keypress) => {

      // If hero is moving... and a different movement direction is picked
      if (this.state.heroMoving === "moving" && this.state.heroDirection !== keypress) {
        // Change hero direction and keep hero moving
        this.setState({ heroLastDirection: this.state.heroDirection, heroDirection: keypress, heroMoving: "moving" });
        this.handleHeroPositioning("stop") // stop first
        this.handleHeroPositioning(keypress) // then go
      }
      // If hero is moving and they hit the same arrow key, stop them
      else if (this.state.heroMoving === "moving" && this.state.heroDirection === keypress) {
        this.haltHero();
      }
      // Otherwise, let the hero walk
      else {
        this.handleHeroPositioning(keypress)
        this.setState({ heroLastDirection: this.state.heroDirection, heroDirection: keypress, heroMoving: "moving" });
      }
    
  };




  // Loads a room onto the screen
  // Also fires a roomChange() function in gameLogic.js for custom per-room things
  // EXPECTS NUMBER
  loadRoom = (roomToLoad) => {

    function isRoom(r) {
      return r.Room === roomToLoad;
    }

    // Get the details of the room we're in from state:
    const nextRoom = this.state.rooms.find(isRoom);

    // Since the title screen is a room, check for first. 
    if (nextRoom.titleScreen === true) {
      return [
        this.setState({
          heroAlive: false,
          gameStartRoomNumber: nextRoom.gameStartRoomNumber,
          roomTitleScreen: true,
          roomCurrent: nextRoom.Room,
          roomCurrentName: nextRoom.Name,
          roomCurrentDescription: nextRoom.Description,
        })
      ]
    }


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
      heroAlive: true,
      roomTitleScreen: false,
      roomCurrent: nextRoom.Room,
      roomCurrentObjects: nextRoom.displayObjects,
      roomCurrentName: nextRoom.Name,
      roomExits: nextRoom.roomExits,
      roomMessages: nextRoom.messages,
      roomCurrentDescription: nextRoom.Description,
      roomVisibleInventory: roomInv
    })


    // Check for room custom code in gamelogic
    const roomFunc = self.roomChange(nextRoom.Room, this.state);

    if (roomFunc !== undefined && typeof roomFunc === 'object') {
      return this.handleCustomReturnedCode(roomFunc) 
    }
    else return false 
  }


  /* 
  
  On load, child component GameLoader.js relies on this function to 
  populate the state object with gameplay data. Rooms, inventory items,
  etc. 
 
  This funciton also loads the first room in the game. 
  
  */
  loadGameFile = (game) => {

    // Add check to see if gamelogic is ready for use yet.
    const isCustomFileLoaded = typeof self.roomChange === "function"

    // recursively reload this until done
    if (isCustomFileLoaded === true) {
      console.info("✓ App component loads " + game.title)
      console.info("✓ GameLogic.js has loaded successfully: Proceed with loading the first room") // If true, first room loads right

      // Merge engine defaults with custom game data
      const gameLoadedState = { ...this.state, ...game }

      // Update app.js state with this new data
      this.setState(gameLoadedState)

      // Load the first room, that's the title screen
      this.loadRoom(1)

    } else if (isCustomFileLoaded === false) {
      console.info("App component loads " + game.title)
      console.error("GameLogic.js not loaded successfully.")

      console.log(isCustomFileLoaded)
      window.location.reload()  // Shame, fix this later

    } else {
      return false
    }


  }

  componentDidMount = () => {

    // When game starts, create an event listner for keyboard input. 
    document.addEventListener('keydown', (e) => {
      e.preventDefault()
      this.setState(
        {
          // Keypresses cause a state update
          keyPress: e.key,

          /*  Passes a fresh date to rerender component in case the same key is pressed twice.
              Example - pressing left arrow starts the character moving, but also stops them. 
              This second update to state of 'ArrowLeft' wouldn't re-render the component. */
          keyRefresh: new Date().valueOf()
        })
    })


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


    // Web worker to handle the player's proximity to display objects
    WorkerHandleDisplayObjectLocation.onmessage = (e) => {
      if (this.state.roomNearbyDisplayObjects !== e.data) {
        this.setState({ roomNearbyDisplayObjects: e.data })
      }
    }


  }

  // React lifecycle handler
  componentDidUpdate = (prevState) => {

    // Make game state available for gameLogic.js
    if (prevState !== this.state) {
      window.gameState = this.state;
    }


    // Check for custom code return from gamelogic that's been sent to the global object
    if(window.gameLogicReturn !== undefined && window.gameLogicReturn !== null ){
      this.handleCustomReturnedCode(window.gameLogicReturn)
      window.gameLogicReturn = null
    }

  }



  render() {
    return (
      <React.Fragment>
        
        {/* Loads game CSS and JS. No render changes */}
        <GameLoader loadGameFile={this.loadGameFile} />
        
        {/* Handle all keyboard input. No render changes */}
        <KeyboardControls
          gameStartRoomNumber={this.state.gameStartRoomNumber}
          heroAlive={this.state.heroAlive}
          handleHeroMovement={this.handleHeroMovement}
          handleMainMenuKeyPress={this.handleMainMenuKeyPress}
          hideModal={this.hideModal}
          inventoryVisable={this.state.inventoryVisable}
          keyPress={this.state.keyPress}
          keyRefresh={this.state.keyRefresh}
          loadRoom={this.loadRoom}
          pausedgame={this.state.pausedgame}
          menuBarActive={this.state.menuBarActive}
          modalStatus={this.state.modalStatus}
          roomTitleScreen={this.state.roomTitleScreen}
          textParserChange={this.textParserChange}
          toggleMainMenu={this.toggleMainMenu}
          toggleInventoryScreen={this.toggleInventoryScreen}
        />

        {/* Loads graphic assets into browser cache. No render changes */}
        <PreloadGameAssets
          gameLogic={this.state.gameLogic} />

        <PlaySound 
          gameAssetPath={this.state.gameAssetPath}
          soundOn={this.state.soundOn}
          soundClip={this.state.soundClip} />

        <InventoryScreen
          heroAlive={this.state.heroAlive}
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
          heroAlive={this.state.heroAlive}
          keyRefresh={this.state.keyRefresh}
          keyPress={this.state.keyPress}
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
          roomTitleScreen={this.state.roomTitleScreen} // Boolean - are we at the title screen?
          roomCurrent={this.state.roomCurrent}  // Room number, number
          roomCurrentName={this.state.roomCurrentName}  // This is the room's primary style class, string
          roomCurrentAltStyle={this.state.roomCurrentAltStyle} // Secondary room style class for CSS, string
          roomCurrentObjects={this.state.roomCurrentObjects}
          roomCurrentDescription={this.state.roomCurrentDescription}
          roomExits={this.state.roomExits}
          roomNearbyInventoryItems={this.state.roomNearbyInventoryItems}
          roomNearbyDisplayObjects={this.state.roomNearbyDisplayObjects}
          
          // Hero details
          haltHero={this.haltHero}
          handleHeroPositioning={this.handleHeroPositioning}
          heroAlive={this.state.heroAlive}
          heroDirection={this.state.heroDirection}
          heroMoving={this.state.heroMoving}
          heroPositionX={this.state.heroPositionX}
          heroPositionY={this.state.heroPositionY}
          heroHeight={this.state.heroHeight}
          heroWidth={this.state.heroWidth}
          heroSprite={this.state.heroSprite}

          // Text parser details
          handleCustomReturnedCode={this.handleCustomReturnedCode}
          handleSubmittedTextModal={this.handleSubmittedTextModal}
          inventory={this.state.inventory}
          keyPress={this.state.keyPress}
          submittedText={this.state.submittedText}
          textParserValue={this.state.textParserValue}
          textPopulateStateAndClearParser={this.textPopulateStateAndClearParser}
          textParserChange={this.textParserChange}
          
          // Main Menu status
          menuBarActive={this.state.menuBarActive}

          // Modal
          modalStatus={this.state.modalStatus}
          hideModal={this.hideModal}

          // Doing stuff
          toggleInventoryScreen={this.toggleInventoryScreen}
          updateScore={this.updateScore}
          handleFlagChange={this.handleFlagChange}
          helpText={this.state.helpText}
          addToInventory={this.addToInventory}
          removeFromInventory={this.removeFromInventory}
          inventoryVisable={this.state.inventoryVisable}
          pausedgame={this.state.pausedgame}
          soundOn={this.state.soundOn}
          flags={this.state.flags}
          updateAppComponentState={this.updateAppComponentState}
        />
      </React.Fragment>
    );
  }
}
