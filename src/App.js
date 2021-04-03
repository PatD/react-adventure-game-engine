import React, { Component } from 'react';
import mainNavFunctions from './MainMenuHelpers';
import Screen from './Screen';
import Debug from './Debug'
import Modal from './Modal'
import InventoryScreen from './InventoryScreen'
import GameSelector from './GameSelector'
import MainMenuBar from './MainMenuBar'

const WorkerHandleHeroMovement = new Worker("../workers/WorkerHandleHeroMovement.js");


export default class App extends Component {
  constructor() {
    super();

    this.state = {

      // Modal
      modalClickToClose:true,
      modalStatus: false,
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



      // Game state stuff
      playfieldX: 0,
      playfieldY: 0,
      pausedgame: false,
      soundStatus: "On",
      debuggerValue: "This is the debugger window",
      textParserValue: "",
      submittedText: "",

      inventoryVisable: false,
      

    };

    this.toggleSound = this.toggleSound.bind(this);

  }

  

  hideModal = () => {
    if(this.state.modalClickToClose === true){
      this.setState({
        modalClickToClose:true,
        modalStatus: false,
        modalTextSlot2: "",
        modalTextSlot3: "",
        modalTextSlot4: "",
      });
    } else{
      console.log('Clicking the modal does nothing here')
    }
    this.setState({ pausedgame: false });
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

    if (this.state.pausedgame === false && this.state.inventoryVisable === false) {

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
    if (this.state.pausedgame === false && this.state.inventoryVisable === false) {
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
    if (this.state.inventoryVisable === false) {
      this.setState({
        inventoryVisable: true,
        pausedgame: true
      });
      this.haltHero();
    } else {
      this.setState({
        inventoryVisable: false,
        pausedgame: false
      });
    }
  }



  haltHero = () => {
    this.handleHeroPositioning("stop")
    this.setState({ heroMoving: "stopped" })
  }




  // Check for object or wall collision

  
  hasCollided = () => {
    // console.time('collisioncheck')
   
    let checkForCollision = (dispObj) =>{
      if (this.state.heroPositionY < dispObj.y + dispObj.width &&
        this.state.heroPositionY + this.state.heroWidth > dispObj.y &&
        this.state.heroPositionX < dispObj.x + dispObj.height &&
        this.state.heroPositionX + this.state.heroHeight > dispObj.x) {
        return true
      }
      else {
        return false
      }
    }

    // At each step, loop through objects and see if we've collided
    for (const [key, dispObj] of Object.entries(this.state.roomCurrentObjects)) {
        if(checkForCollision(dispObj) === true && dispObj.colide === true && key){
          return true
        }
    }

    // At each step, loop through room exits and see if we're exiting
    for (const [key, roomEx] of Object.entries(this.state.roomExits)) {
      if(checkForCollision(roomEx) === true && key){
        console.log('Room Exit hit')
        this.loadRoom(roomEx.goto)
        return false
      }
    }

    // console.timeEnd('collisioncheck');
  }




  // Taking input from keyboard controls, 
  // move hero around the screen and
  // stop hero if they bash into walls and objects

  // inputs are change type ... direction or stop
  // outputs are function like this.halthero() or setstate

  handleHeroPositioning = (change) => {

    if (change !== "stop") {

      this.movementInterval = setInterval(() => {
        
        // Post hero's chosen direction and current deets to worker
        WorkerHandleHeroMovement.postMessage({
          "direction": change, 
          hasCollided:this.hasCollided(),
          heroPositionX:this.state.heroPositionX,
          heroPositionY:this.state.heroPositionY,
          heroWidth:this.state.heroWidth,
          heroHeight:this.state.heroHeight,        
          heroDirection:this.state.heroDirection,
          heroLastDirection:this.state.heroLastDirection,
          heroPositionCollided:this.state.heroPositionCollided,
          heroMoving: this.state.heroMoving,
          heroMovementDisance: this.state.heroMovementDisance,
          playfieldY:this.state.playfieldY,
          playfieldX:this.state.playfieldX
        });


      }, this.state.heroMovementUpdateSpeed)
    } else {
      
      // This else is actually what stops the character.
      return clearInterval(this.movementInterval)
    }
  };


/*


  handleHeroPositioning = (change) => {

    if (change !== "stop") {

      this.movementInterval = setInterval(() => {
        
        WorkerHandleHeroMovement.postMessage({
          "direction": change, 
          heroX:this.state.heroPositionX,
          heroY:this.state.heroPositionY,
          heroWidth:this.state.heroWidth,
          heroHeight:this.state.heroHeight        
        
        });

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


*/



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


      // Since "any key" can close the inventory screen, we start with that
      if(self.state.inventoryVisable === true){
        event.preventDefault()
        self.toggleInventoryScreen(event.key);
      } 
      // This opens the inventory screen
      else if(self.state.inventoryVisable === false && event.key === 'Tab'){
        event.preventDefault()
        self.toggleInventoryScreen(event.key);
      }

      // Handle Escape key to toggle menu
      else if (event.key === "Escape" && self.state.inventoryVisable === false) {
        self.refs.mainMenuRef.activateMainMenu(event)
        self.refs.mainMenuRef.toggleMenuDropdown(event)
      }

      // Handle arrow keys for movement
      else if (
        (self.state.inventoryVisable === false && self.state.pausedgame === false) && 
        (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {        
        event.preventDefault()
        self.handleHeroMovement(event.key);
      }
       else

        console.log("User types text");

    }, false);
  }



  // Loads a room onto the screen
  loadRoom = (roomToLoad) => {
    // console.log("We're in room " + roomToLoad)
    // console.log("Botom edge " + this.state.playfieldX)
    // console.log("right edge " + this.state.playfieldY)

    
    function isRoom(r) {
      return r.Room === roomToLoad;
    }
    
    var nextRoom = this.state.rooms.find(isRoom);


    // console.log(nextRoom.starting)
    // console.log(nextRoom)

    

    // Set starting postiiong
    if(nextRoom.starting === "top"){

      this.setState({
        heroDirection: "ArrowDown",
        heroPositionY: 0,
      })

    } else if(nextRoom.starting === "left"){

      this.setState({
        heroDirection: "ArrowRight",
        heroPositionY: 0,
      })

    } else if(nextRoom.starting === "right"){
     
      this.setState({
        heroDirection: "ArrowLeft",
        heroPositionY: this.state.playfieldY,
      })

    } else if(nextRoom.starting === "bottom"){

      this.setState({
        heroDirection: "ArrowUp",
        heroPositionX: this.state.playfieldX,
      })
    }


    // Set room structure
    this.setState({
      roomCurrent:nextRoom.Room, 
      roomCurrentObjects:nextRoom.displayObjects, 
      roomCurrentName:nextRoom.Name,
      roomExits:nextRoom.roomExits
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

    // When the component mounts, start an event listener for web worker updates
    WorkerHandleHeroMovement.onmessage = (e) =>{
      console.log("Returned from worker:")
      console.log(e.data)

      if(e.data === "halt"){
        this.haltHero();
      } else if(e.data === "haltCollide"){
        this.setState({heroPositionCollided:true})
        this.haltHero();
      }else{
        this.setState(e.data)
      }
      
    }


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
         
          // Room details
            roomCurrent={this.state.roomCurrent}
            roomCurrentName={this.state.roomCurrentName}
            roomCurrentObjects={this.state.roomCurrentObjects}
            roomExits={this.state.roomExits}

          
          haltHero={this.haltHero}
          handleHeroPositioning={this.handleHeroPositioning}
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
          soundStatus={this.state.soundStatus}
          toggleSound={this.toggleSound} />

        <Debug debugText={this.state.debuggerValue} />
        
        <GameSelector loadGameFile={this.loadGameFile} />
      </React.Fragment>
    );
  }
}
