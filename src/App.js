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
      heroDirection: "ArrowRight",
      heroMoving: "stopped",
      heroPositionX: 75,
      heroPositionY: 75,
      heroPositionCollided:false,
      heroMovementDisance: 5,
      heroMovementUpdateSpeed: 125,
      heroHeight: 0,
      heroWidth: 0,
      
      
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

  hasCollided = () => {
     // Handle object collision.  Refactor into passable objects
      if (this.state.heroPositionX < this.state.rockPositionX + this.state.rockWidth &&
      this.state.heroPositionX + this.state.heroWidth > this.state.rockPositionX &&
      this.state.heroPositionY < this.state.rockPositionY + this.state.rockHeight &&
      this.state.heroPositionY + this.state.heroHeight > this.state.rockPositionY) {
      // collision detected!
      // console.log('bump')
      // return this.haltHero()
      //this.haltHero();
      //  return this.setState({heroPositionCollided:true})
      return true
    } 
    else{
      // console.log('no harm')
      // return this.setState({heroPositionCollided:false})
      return false
    }
  }


  // Taking input from keyboard controls, 
  // move hero around the screen and
  // stop hero if they bash into walls.
  handleHeroPositioning = (change) => {
    if (change !== "stop") {
      this.movementInterval = setInterval(() => {

        if(this.hasCollided() === true && this.state.heroMoving !== "stopped"){
          this.haltHero()
        }
        // const heroRect = document.getElementById('hero')
        // const rainbowRect = document.getElementById('rock')

        // var heroBlock = {
        //   "X":this.state.heroPositionX,
        //   "Y":this.state.heroPositionY,
        //   "Height":this.state.heroHeight,
        //   "Width":this.state.heroWidth,
        //   "fromLeft":heroRect.offsetLeft,
        //   "fromTop":heroRect.offsetTop
        // }

        // var rockBlock = {
        //   "X":this.state.rockPositionX,
        //   "Y":this.state.rockPositionY,
        //   "Height":this.state.rockHeight,
        //   "Width":this.state.rockWidth,
        //   "fromLeft":rainbowRect.offsetLeft,
        //   "fromTop":rainbowRect.offsetTop
        // }

        // console.log(rockBlock)
        // // console.log(heroBlock)
  
        
        // // Handle object collision.  Refactor into passable objects
        // if (this.state.heroPositionX < this.state.rockPositionX + this.state.rockWidth &&
        //   this.state.heroPositionX + this.state.heroWidth > this.state.rockPositionX &&
        //   this.state.heroPositionY < this.state.rockPositionY + this.state.rockHeight &&
        //   this.state.heroPositionY + this.state.heroHeight > this.state.rockPositionY) {
        //   // collision detected!
        //   console.log('bump')
        //   // return this.haltHero()
        //   //this.haltHero();
        //  //  return this.setState({heroPositionCollided:true})
        // } 
        // else{
        //   console.log('no harm')
        //  // return this.setState({heroPositionCollided:false})
        // }


        // if (this.state.heroPositionCollided === true && this.state.heroMoving === "stopped"){
        //   console.log('We are stuck')
        // }





        
        // allow for movement for any key but currently facing like arrowup
        

          // if(this.state.heroPositionCollided === false && this.state.heroPositionX + this.state.heroWidth > this.state.rockPositionX && this.state.heroPositionX < this.state.rockPositionX + this.state.rockWidth && this.state.heroPositionY + this.state.heroHeight > this.state.rockPositionY && this.state.heroPositionY < this.state.rockPositionY + this.state.rockHeight) {
          //   console.log('hit')
          // } 
          // else {
          //  console.log('not')
          // }


        // var rows = 128;
        // var cols = 256;


        console.log(this.hasCollided())


        // Handle if they're already on the wall
        if (change === "ArrowRight" && this.state.heroPositionY > this.state.playfieldY - this.state.heroWidth) {
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
        if (change === "ArrowRight" && this.state.heroPositionY <= this.state.playfieldY - this.state.heroWidth) { // Needs to account for hero width
          return this.setState({ heroPositionY: this.state.heroPositionY + this.state.heroMovementDisance })
        }
        else if (change === "ArrowLeft" && this.state.heroPositionY >= 0) {
          return this.setState({ heroPositionY: this.state.heroPositionY - this.state.heroMovementDisance })
        }
        else if (change === "ArrowUp" && this.state.heroPositionX >= 0) {
          return this.setState({ heroPositionX: this.state.heroPositionX - this.state.heroMovementDisance })
        }
        else if (change === "ArrowDown" && this.state.heroPositionX <= this.state.playfieldX - this.state.heroHeight) { // Needs to account for hero height
          return this.setState({ heroPositionX: this.state.heroPositionX + this.state.heroMovementDisance })
        }
        else {
          return clearInterval(this.movementInterval)
        }
      }, this.state.heroMovementUpdateSpeed)
    } else {

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
        this.setState({ heroDirection: keypress, heroMoving: "moving" });
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
        this.setState({ heroDirection: keypress, heroMoving: "moving" });
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


  // When a game is loaded, update React State with game data
  loadGameFile = (game) => {
    console.log("App component loads " + game.title)
    const gameLoadedState = { ...this.state, ...game }
    this.setState(gameLoadedState)
  }


  componentDidMount() { 

    // set dimensions for play field
    const playfield = document.querySelector('main')

    this.setState({
      playfieldX: playfield.clientHeight,
      playfieldY: playfield.clientWidth,
      playfieldGridx: playfield.clientHeight / 48,
      playfieldGridy: playfield.clientWidth / 64
    })


    this.setdefaultKeyboardListners();
  }





  // Accepts input from main menu
  // then passes the menu item name off to 
  // MainMenuHelpers.js for processing
  handleDropDownMenuClick = (event) => {
    mainNavFunctions.route(this, event.target.innerText)
  }


  checkForCollisions() {

    // if (this.state.heroMoving === "moving") {
    //   // console.log(this.state.heroPositionX + "," + this.state.heroPositionY)

    //   if (this.state.heroPositionX < this.state.rockPositionX + this.state.rockWidth &&
    //     this.state.heroPositionX + this.state.heroWidth > this.state.rockPositionX &&
    //     this.state.heroPositionY < this.state.rockPositionY + this.state.rockHeight &&
    //     this.state.heroPositionY + this.state.heroHeight > this.state.rockPositionY) {
    //     // collision detected!

    //     console.log('bump')

    //   }

    // }

  }



  componentDidUpdate(prevProps) {
   this.checkForCollisions()
  }


  render() {
    return (
      <React.Fragment>
        <InventoryScreen
          inventoryVisable={this.state.inventoryVisable} />
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
          modalButtonClick2={this.modalButtonClick2}
          />

        

        <Screen

            rockPositionX={this.state.rockPositionX}
            rockPositionY={this.state.rockPositionY}
            rockWidth={this.state.rockWidth}
            rockHeight={this.state.rockPositionY}

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
