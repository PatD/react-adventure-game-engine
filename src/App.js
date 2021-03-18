import React, { Component } from 'react';
import mainNavFunctions from './MainMenuHelpers';
import Screen from './Screen';
import Debug from './Debug'
import Modal from './Modal'
import InventoryScreen from './InventoryScreen'
import GameSelector from './GameSelector'
import MainMenuBar from './MainMenuBar'


export default class App extends Component {
  constructor() {
    super();

    this.state = {

      // Modal
      modalClickToClose:true,
      modalStatus: "modal display-none",
      modalText: "Modal content is here!",
      modalTextSlot2: "",
      modalTextSlot3: "",
      modalTextSlot4: "",
      modalButtonText1:"",
      modalButtonText2:"",

      // Hero stuff
      heroAlive:true,
      heroLastDirection:"",
      heroDirection: "ArrowRight",
      heroMoving: "stopped",
      heroPositionX: 75,
      heroPositionY: 75,
      heroPositionCollided:false,
      heroMovementDisance: 5,
      heroMovementUpdateSpeed: 105,
      heroHeight: 0,
      heroWidth: 0,
      

      // Room stuff
      roomCurrent:"",
      roomPrevious:"",
      roomCurrentObjects:"",


      // Rock stuff
      rockPositionX: 100,
      rockPositionY: 80,
      rockWidth: 100,
      rockHeight: 150,



      // Game state stuff
      playfieldX: 0,
      playfieldY: 0,
      pausedgame: false,
      soundStatus: "On",
      debuggerValue: "This is the debugger window",
      textParserValue: "",
      submittedText: "",
      inventoryVisable: "display-none",

    };

    this.toggleSound = this.toggleSound.bind(this);
  }

  hideModal = () => {
    if(this.state.modalClickToClose === true){
      this.setState({
        modalClickToClose:true,
        modalStatus: "modal display-none",
        modalTextSlot2: "",
        modalTextSlot3: "",
        modalTextSlot4: "",
      });
    } else{
      console.log('Clicking the modal does nothing here')
    }


    
    this.togglePause();
  };

  togglePause = () => {
    if (this.state.pausedgame === false) {
      this.setState({ pausedgame: true });
      this.haltHero();
    } else {
      this.setState({ pausedgame: false });
    }
  }

  toggleSound() {

    if (this.state.soundStatus === "On") {
      this.setState({ soundStatus: "Off" });
    } else {
      this.setState({ soundStatus: "On" });
    }
  }

  updateDebugger(keyCaptured) {
    this.setState({ debuggerValue: "\n Player pressed: " + keyCaptured + "\n " + this.state.debuggerValue })
  }

  modalButtonClick1 = (event) =>{
    if(this.state.modalButtonText1 === "Restart"){
      alert("GAME RESTART")
    }
  }

  modalButtonClick2 = (event) =>{
    if(this.state.modalButtonText1 === "Restart"){
     // alert('CANCEL')
    }
  }



  // Fires when user hits enter on text field
  submitTextParser = event => {
    event.preventDefault();

    if (this.state.pausedgame === false) {

      console.log("Enter key: " + event.target.elements[0].value)

      // Populates the Submitted Text state for processing
      // then clears input field
      this.setState({
        submittedText: event.target.elements[0].value,
        textParserValue: ""
      })

      // Every text entry prompts a modal opening:
      this.togglePause();
      this.handleSubmittedTextModal(event.target.elements[0].value)
    }
    else {
      // If the enter key is pressed, while the modal is open, close the mdoal
      this.hideModal()
    }
  }


  // Update state as letters are typed into input field
  textParserChange = (event) => {
    if (this.state.pausedgame === false) {
      this.setState({
        textParserValue: event.target.value
      });
    }
  }


  handleSubmittedTextModal = (text) => {
    this.setState({
      modalClickToClose:true,
      modalText: "The hero typed " + text + ".",
      modalStatus: "modal display-block"
    })
  }


  toggleInventoryScreen(key) {
    this.updateDebugger(key);
    if (this.state.inventoryVisable === "display-none") {
      this.setState({
        inventoryVisable: "display-block",
        pausedgame: true
      });
      this.haltHero();
      this.updateDebugger("User activates inventory screen\n");
    } else {
      this.setState({
        inventoryVisable: "display-none",
        pausedgame: false
      });
      this.updateDebugger("User deactivates inventory screen\n");
    }
  }

  haltHero = () => {
    this.handleHeroPositioning("stop")
    this.setState({ heroMoving: "stopped" })
  }

  // Handle object collision
  hasCollided = () => {
    let rock = document.getElementById('rock')

    if (this.state.heroPositionY < rock.offsetLeft + rock.clientWidth &&
      this.state.heroPositionY + this.state.heroWidth > rock.offsetLeft &&
      this.state.heroPositionX < rock.offsetTop + rock.clientHeight &&
      this.state.heroPositionX + this.state.heroHeight > rock.offsetTop) {
      return true
    }
    else {
      return false
    }
  }


  // Taking input from keyboard controls, 
  // move hero around the screen and
  // stop hero if they bash into walls and objects
  handleHeroPositioning = (change) => {

    if (change !== "stop") {
      this.movementInterval = setInterval(() => {

        // Handle collision while moving
        if (this.state.heroPositionCollided === false && this.hasCollided() === true && this.state.heroMoving !== "stopped") {
          this.setState({heroPositionCollided:true})
          console.log('🛑 Hero Collided w/object. They were walking ' + this.state.heroDirection + " and before that " + this.state.heroLastDirection);
          return this.haltHero()
        }

        // handle movement after object collision
        else if (this.state.heroLastDirection === "ArrowLeft" && this.state.heroPositionCollided === true ) {
          return this.setState({ heroPositionCollided: false, heroMoving: "moving", heroPositionY: this.state.heroPositionY + this.state.heroMovementDisance })
        }
        else if (this.state.heroLastDirection === "ArrowRight" && this.state.heroPositionCollided === true ) {
          return this.setState({ heroPositionCollided: false, heroMoving: "moving", heroPositionY: this.state.heroPositionY - this.state.heroMovementDisance })
        }
        else if (this.state.heroLastDirection === "ArrowDown" && this.state.heroPositionCollided === true ) {
          return this.setState({ heroPositionCollided: false, heroMoving: "moving", heroPositionX: this.state.heroPositionX - this.state.heroMovementDisance })
        }
        else if (this.state.heroLastDirection === "ArrowUp" && this.state.heroPositionCollided === true ) {
          return this.setState({ heroPositionCollided: false, heroMoving: "moving", heroPositionX: this.state.heroPositionX + this.state.heroMovementDisance })
        }

        // Handle if they're already on the wall
        else if (change === "ArrowRight" && this.state.heroPositionY > this.state.playfieldY - this.state.heroWidth) {
          return this.haltHero();
        }
        else if (change === "ArrowLeft" && this.state.heroPositionY <= 0) {
          return this.haltHero();
        }
        else if (change === "ArrowUp" && this.state.heroPositionX <= 0) {
          return this.haltHero();
        }
        else if (change === "ArrowDown" && this.state.heroPositionX >= this.state.playfieldX - this.state.heroHeight) {
          return this.haltHero();
        }

        // Handle walking
        else if (change === "ArrowRight" && this.state.heroPositionCollided === false && this.state.heroPositionY <= this.state.playfieldY - this.state.heroWidth) { // Needs to account for hero width
          return this.setState({ heroPositionY: this.state.heroPositionY + this.state.heroMovementDisance })
        }
        else if (change === "ArrowLeft" && this.state.heroPositionCollided === false && this.state.heroPositionY >= 0) {
          return this.setState({ heroPositionY: this.state.heroPositionY - this.state.heroMovementDisance })
        }
        else if (change === "ArrowUp" && this.state.heroPositionCollided === false && this.state.heroPositionX >= 0) {
          return this.setState({ heroPositionX: this.state.heroPositionX - this.state.heroMovementDisance })
        }
        else if (change === "ArrowDown" && this.state.heroPositionCollided === false && this.state.heroPositionX <= this.state.playfieldX - this.state.heroHeight) { // Needs to account for hero height
          return this.setState({ heroPositionX: this.state.heroPositionX + this.state.heroMovementDisance })
        }

        else {
          return clearInterval(this.movementInterval)
        }
      }, this.state.heroMovementUpdateSpeed)
    } else {
      
      // This else is actually what stops the character.
      return clearInterval(this.movementInterval)
    }
  };

  handleHeroMovement(keypress) {

    // Don't move the hero if the game is paused
    if (this.state.pausedgame === false) {
      // this.updateDebugger(keypress);

      // If hero is moving and a different movement direction is picked
      if (this.state.heroMoving === "moving" && this.state.heroDirection !== keypress) {
        // Change hero direction and keep hero moving
        this.setState({heroLastDirection:this.state.heroDirection, heroDirection: keypress, heroMoving: "moving" });
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
        this.setState({ heroLastDirection:this.state.heroDirection, heroDirection: keypress, heroMoving: "moving" });
      }
    }
  };


  // Default keyboard configuration for gameplay.
  // Arrow keys move the hero
  // tab key opens inventory, escape opens menu, and 
  // alpha keys get typed into text parser.
  setdefaultKeyboardListners = () => {

    const self = this;
    document.addEventListener('keydown', function (event) {

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        // Handle arrow keys for movement
        event.preventDefault()
        self.handleHeroMovement(event.key);
      }
      else if (event.key === "Escape") {
        // Open main menu when user clicks escape
        self.refs.mainMenuRef.activateMainMenu(event)
        self.refs.mainMenuRef.toggleMenuDropdown(event)
      }


      else if (event.key === 'Tab') {
        // Handle tab key for movement
        event.preventDefault()
        self.toggleInventoryScreen(event.key);
      } else

        self.updateDebugger("User types text text\n");

    }, false);
  }



  // Loads a room onto the screen
  loadRoom = (roomToLoad) => {
    console.log("Currently in room " + roomToLoad)
    
    function isRoom(r) {
      return r.Room === roomToLoad;
    }
    
    var currentRoom = this.state.rooms.find(isRoom);

    this.setState({
      roomCurrent:currentRoom.Room, 
      roomCurrentObjects:currentRoom.Objects, 
      roomCurrentName:currentRoom.Name
    })

  }









  // When a game is loaded, update React State with game data
  loadGameFile = (game) => {
    console.info("App component loads " + game.title)

    const gameLoadedState = { ...this.state, ...game }

    this.setState(gameLoadedState)
    this.loadRoom(2); // change this to be dynamic

  }









  componentDidMount() { 


    // set dimensions for play field
    const playfield = document.querySelector('main')

    this.setState({
      playfieldX: playfield.clientHeight,
      playfieldY: playfield.clientWidth,
      // playfieldGridx: playfield.clientHeight / 48,
      // playfieldGridy: playfield.clientWidth / 64
    })


    this.setdefaultKeyboardListners();

  }





  // Accepts input from main menu
  // then passes the menu item name off to 
  // MainMenuHelpers.js for processing
  handleDropDownMenuClick = (event) => {
    mainNavFunctions.route(this, event.target.innerText)
  }






  // componentDidUpdate(prevProps) {
  //  console.log('updated')
  // }


  render() {
    return (
      <React.Fragment>
        
        <InventoryScreen
          inventoryVisable={this.state.inventoryVisable}
          inventory={this.state.inventory} />

        <header>
          <MainMenuBar
            ref="mainMenuRef"
            togglePause={this.togglePause}
            gameTitle={this.state.title}
            handleDropDownMenuClick={this.handleDropDownMenuClick}
            menuActive={true}
            playerScore={0} />
        </header>

        <Modal 
          hideModal={this.hideModal}
          modalClickToClose={this.state.modalClickToClose}
          modalStatus={this.state.modalStatus}
          modalText={this.state.modalText}
          modalTextSlot2={this.state.modalTextSlot2}
          modalTextSlot3={this.state.modalTextSlot3}
          modalTextSlot4={this.state.modalTextSlot4}
          modalButtonText1={this.state.modalButtonText1}
          modalButtonText2={this.state.modalButtonText2}
          modalButtonClick1={this.modalButtonClick1}
          modalButtonClick2={this.modalButtonClick2} />

        

        <Screen
            rockPositionX={this.state.rockPositionX}
            rockPositionY={this.state.rockPositionY}
            rockWidth={this.state.rockWidth}
            rockHeight={this.state.rockPositionY}


          // Room details
            roomCurrent={this.state.roomCurrent}
            roomCurrentName={this.state.roomCurrentName}
            roomCurrentObjects={this.state.roomCurrentObjects}


          // handleSubmittedText={this.handleSubmittedText}
          haltHero={this.haltHero}
          handleHeroPositioning={this.handleHeroPositioning}
          soundStatus={this.state.soundStatus}
          heroDirection={this.state.heroDirection}
          heroMoving={this.state.heroMoving}
          heroPositionX={this.state.heroPositionX}
          heroPositionY={this.state.heroPositionY}
          heroHeight={this.state.heroHeight}
          heroWidth={this.state.heroWidth}
          submittedText={this.state.submittedText}
          textParserValue={this.state.textParserValue}
          setdefaultKeyboardListners={this.setdefaultKeyboardListners}
          submitTextParser={this.submitTextParser}
          // textParserBlur={this.textParserBlur}
          textParserChange={this.textParserChange}
          // textParserFocus={this.textParserFocus}
          togglePause={this.togglePause}
          toggleSound={this.toggleSound} />

        <Debug debugText={this.state.debuggerValue} />
        
        <GameSelector loadGameFile={this.loadGameFile} />
      </React.Fragment>
    );
  }
}
