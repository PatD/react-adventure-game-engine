import React, { Component } from 'react';
import mainNavFunctions from './MainMenuHelpers';
import Screen from './Screen';
import Modal from './Modal'
import InventoryScreen from './InventoryScreen'
import GameSelector from './GameSelector'
import MainMenuBar from './MainMenuBar'


// Movement workers
  // They live outside the src directory because
  // Create-React-App tries to merge them and they
  // need to remain seperate files
const WorkerHandleHeroMovement = new Worker("../workers/WorkerHandleHeroMovement.js");
const WorkerHandleInventoryLocation = new Worker("../workers/WorkerHandleInventoryLocation.js");



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
      heroSprite:"",
      

      // Room stuff
      roomCurrent:"",
      roomPrevious:"",
      roomCurrentObjects:"",
      roomVisibleInventory:"",
      roomNearbyInventoryItems:[],

      // Game state stuff
      playfieldX: 0,
      playfieldY: 0,
      pausedgame: false,
      soundStatus: "On",
      textParserValue: "",
      submittedText: "",
      helpText:"Help! I need somebody. Not just anybody!",
      flags:[],
      inventoryVisable: false
    };

    this.toggleSound = this.toggleSound.bind(this);

  }

  // Function to pause the game, invoked by menu item changes usually
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


  
  


  // When parser submits, text is stored in State and input field cleared
  textPopulateStateAndClearParser = (event) =>{
    this.setState({
      submittedText: event.target.elements[0].value,
      textParserValue: ""
    })
  }

  // Updates state as letters are typed into input field
  textParserChange = (event) => {
    if (this.state.pausedgame === false && this.state.inventoryVisable === false) {
      this.setState({
        textParserValue: event.target.value
      });
    }
  }

  // Handles text submission - and usually opens a modal
  handleSubmittedTextModal = (text) => {
    
    this.setState({
      modalClickToClose:true,
      modalText: text,
      modalStatus: "modal display-block",
      pausedgame:true
    })
    this.haltHero()
  }





  // Adds item to inventory
  addToInventory = (addItem) => {

    // Find item in game (not player) Inventory. All inventory items must be in the gamedata.json file at startup.
    const matchedItem = this.state.inventory.findIndex(item => item.Name.toLowerCase() === addItem)

    // Change owned from false to true with setState
    let newInventory = [...this.state.inventory]
    let newRoomInventory = [...this.state.roomVisibleInventory]

    // If the player doesn't have it already, add it:
    if(newInventory[matchedItem].owned === false){
      newInventory[matchedItem] = { ...newInventory[matchedItem], owned: !newInventory[matchedItem].owned }
      newRoomInventory[matchedItem] = { ...newRoomInventory[matchedItem], owned: !newRoomInventory[matchedItem].owned }

      // Update state (and player's inventory screen) with new item
      this.setState({ inventory: newInventory, roomVisibleInventory:newRoomInventory })

    }
  }

  // Remove item from inventory
  // This is a utility function - player doesn't have the ability to drop quest items
  removeFromInventory = (removeItem) => {

    // Find item in game (not player) Inventory. All inventory items must be in the gamedata.json file at startup.
    const matchedItem = this.state.inventory.findIndex(item => item.Name.toLowerCase() === removeItem)

    // Change owned from false to true with setState
    let newInventory = [...this.state.inventory]

    if(newInventory[matchedItem].owned === true){
      newInventory[matchedItem] = { ...newInventory[matchedItem], owned: !newInventory[matchedItem].owned }
      
      // Update state (and player's inventory screen) with new item
      this.setState({ inventory: newInventory })
    }
  }


  // Adventure gamers complete puzzles and quests, and the game should acount for that, 
  // or conditionally change rooms based on a flag status. This function accepts a
  // flag number and changes it's boolean and updates it in state.
  handleFlagChange = (flagNum) => {

    // Find the flag in state
    const flagForTogglin = this.state.flags.map((item, index) => {
      if (item.flag === flagNum) {
        // If it's true, make it false, false make it true
        item.value = item.value === true ? false : true;
      }
      return item;
    });

    // Update state with new value for this flag
    this.setState({ flags: flagForTogglin })

    console.log("Just updated flag # " + flagNum)
  }




  // Show or hide Inventory Screen
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

      this.movementInterval = setInterval(() => {
        
        // Post hero's chosen direction and current deets to worker
        WorkerHandleHeroMovement.postMessage({
          "direction": change, 
          heroPositionX:this.state.heroPositionX,
          heroPositionY:this.state.heroPositionY,
          heroWidth:this.state.heroWidth,
          heroHeight:this.state.heroHeight,        
          heroDirection:this.state.heroDirection,
          heroLastDirection:this.state.heroLastDirection,
          heroPositionCollided:this.state.heroPositionCollided,
          heroMoving:this.state.heroMoving,
          heroMovementDisance: this.state.heroMovementDisance,
          playfieldX:this.state.playfieldX,
          playfieldY:this.state.playfieldY,
          roomCurrentObjects:this.state.roomCurrentObjects,
          roomExits:this.state.roomExits,
        });

      // Check Hero's position against on-screen inventory items
      WorkerHandleInventoryLocation.postMessage({
        heroPositionX:this.state.heroPositionX,
        heroPositionY:this.state.heroPositionY,
        heroWidth:this.state.heroWidth,
        heroHeight:this.state.heroHeight,        
        roomVisibleInventory:this.state.roomVisibleInventory,
      })
       

      }, this.state.heroMovementUpdateSpeed)
    } else {
      
      // This else is actually what stops the character.
      return clearInterval(this.movementInterval)
    }
  };
  


  handleHeroMovement(keypress) {

    // Don't move the hero if the game is paused
    if (this.state.pausedgame === false) {

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



  // Adds event listeners for keyboard use.
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
    
    function isRoom(r) {
      return r.Room === roomToLoad;
    }
    
    const nextRoom = this.state.rooms.find(isRoom);

    // Add exit position for right and bottom room exits
    // since we don't necessarily know the dimensions of
    // the game play area.
    for (let roomExit of nextRoom.roomExits) {
      if(roomExit.exit === "right"){
        roomExit.y = this.state.playfieldX -5
      } else if(roomExit.exit === "bottom"){
        roomExit.x = this.state.playfieldY -5
      }
    }


    // Set position of hero for travel from one room to the next
    if(this.state.heroDirection === "ArrowUp"){
      this.setState({
        heroPositionX: this.state.playfieldY - this.state.heroHeight -5,
      })
    } else if(this.state.heroDirection === "ArrowLeft"){
      this.setState({
        heroPositionY: this.state.playfieldX - this.state.heroWidth -5
      })
    } else if(this.state.heroDirection === "ArrowRight"){
      this.setState({
        heroPositionY: 5,
      })
    } else if(this.state.heroDirection === "ArrowDown"){
      this.setState({
        heroPositionX: 5,
      })
    }

    // Add any inventory items that need to be displayed.
    // Should be ownable, not in inventory already

    const roomInv = this.state.inventory.filter(inv => inv.FoundRoom === nextRoom.Room && inv.owned === false && inv.Visible === true );

    // Set room stage
    this.setState({
      roomCurrent:nextRoom.Room, 
      roomCurrentObjects:nextRoom.displayObjects, 
      roomCurrentName:nextRoom.Name,
      roomExits:nextRoom.roomExits,
      roomMessages:nextRoom.messages,
      roomCurrentDescription:nextRoom.Description,
      roomVisibleInventory:roomInv
    })

  }



  // When a game is loaded, update React State with game data
  loadGameFile = (game) => {
    console.info("App component loads " + game.title)

    const gameLoadedState = { ...this.state, ...game }

    this.setState(gameLoadedState)
    this.loadRoom(2); // change this to be dynamic
  }


  componentDidUpdate(){
    // console.log(this.state)
  }


  componentDidMount() { 

    // When the component mounts, start an event listener for web worker updates.
    WorkerHandleHeroMovement.onmessage = (e) =>{
      if(typeof e.data === "number"){
        this.loadRoom(e.data);   // If a room number is returned, that means the hero has hit an exit wall
      }else if(e.data === "halt"){
        this.haltHero();
      } else if(e.data === "haltCollide"){
        this.setState({heroPositionCollided:true})
        this.haltHero();
      }else{
        this.setState(e.data)
      }   
    }


    // Web worker to handle the player's proximity to on screen inventory items
    WorkerHandleInventoryLocation.onmessage = (e) =>{
      if(this.state.roomNearbyInventoryItems !== e.data){
        this.setState({roomNearbyInventoryItems:e.data})
      }
    }



    // set dimensions for play field
    // const playfield = document.querySelector('main')

    this.setState({
      // playfieldX: playfield.clientHeight,
      // playfieldY: playfield.clientWidth,

      // playfieldX: 640,
      // playfieldY: 420,

    })

    // Listen patiently for keyboard key presses
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
        
        <GameSelector loadGameFile={this.loadGameFile} />


        <InventoryScreen
          inventoryVisable={this.state.inventoryVisable}
          inventory={this.state.inventory} />


        <Modal 
          gameWidth={this.state.playfieldX}
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

       
        <MainMenuBar
          gameWidth={this.state.playfieldX}
          ref="mainMenuRef"
          togglePause={this.togglePause}
          gameTitle={this.state.title}
          handleDropDownMenuClick={this.handleDropDownMenuClick}
          menuActive={true}
          playerScore={0} />
       
        <Screen    
          // Game dimensions
          gameWidth={this.state.playfieldX}
          gameHeight={this.state.playfieldY}
        

          // Room details
          roomCurrent={this.state.roomCurrent}
          roomCurrentName={this.state.roomCurrentName}
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
          
          // Doing stuff
          handleFlagChange={this.handleFlagChange}
          helpText={this.state.helpText}
          hideModal={this.hideModal}
          addToInventory={this.addToInventory}
          removeFromInventory={this.removeFromInventory}
          inventoryVisable={this.state.inventoryVisable}
          pausedgame={this.state.pausedgame}
          togglePause={this.togglePause}
          soundStatus={this.state.soundStatus}
          toggleSound={this.toggleSound} />
        

      </React.Fragment>
    );
  }
}
