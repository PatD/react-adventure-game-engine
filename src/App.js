import React, { Component } from 'react';
import Screen from './Screen';
import Debug from './Debug'
import InventoryScreen from './InventoryScreen'
import GameSelector from './GameSelector'
import MainMenuBar from './MainMenuBar'


export default class App extends Component {
  constructor() {
    super();

    this.state = {
      pausedgame:false,
      soundStatus: "On",
      debuggerValue: "This is the debugger window",
      textParserValue:"",
      submittedText:"",
      inventoryVisable:"display-none",
      heroDirection:"ArrowRight",
      heroMoving:"stopped",
      heroPositionX:150,
      heroPositionY:150,
      heroMovementDisance:5,
      heroMovementUpdateSpeed:125,
      heroHeight:0,
      heroWidth:0,
      playfieldX:0,
      playfieldY:0
    };

    this.toggleSound = this.toggleSound.bind(this);
  }
  
  togglePause = () =>{
    if(this.state.pausedgame === false){
      this.setState({ pausedgame: true});
      this.haltHero();
    } else{
      this.setState({ pausedgame: false});
    }
  }

  toggleSound(){

    if(this.state.soundStatus === "On"){
      this.setState({ soundStatus: "Off"});
    } else{
      this.setState({ soundStatus: "On"});
    }
  }

  updateDebugger(keyCaptured){
    this.setState({ debuggerValue: "\n Player pressed: " + keyCaptured + "\n " +  this.state.debuggerValue  })
  }

  // Text parser
  submitTextParser = event => {
    event.preventDefault();
    console.log("enter key pressed:")
    console.log(event.target.elements[0].value)

    // Populates the Submitted Text state for processing
    this.setState({ submittedText: event.target.elements[0].value  })

    // // Updates debugger
    // this.setState({ debuggerValue: "\n Player submitted some text"  })

    // Clears input field
    this.setState({ textParserValue: ""  })
  }


  textParserChange = (event) => {
   // console.log("parser changed")
    this.setState({
      textParserValue: event.target.value
    });
  }

  toggleInventoryScreen(key){
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

  haltHero(){
    this.handleHeroPositioning("stop")
    this.setState({heroMoving:"stopped"})    
  }

  // Taking input from keyboard controls, 
  // move hero around the screen and
  // stop hero if they bash into walls.
  handleHeroPositioning(change){
    if(change !== "stop"){
      this.movementInterval = setInterval(() => {
  
      // Handle if they're already on the wall
        if(change === "ArrowRight" && this.state.heroPositionY > this.state.playfieldY - this.state.heroWidth){ 
          return this.haltHero();
        } 
        else if(change === "ArrowLeft" && this.state.heroPositionY <= 0){
          return this.haltHero();
        } 
        else if(change === "ArrowUp" && this.state.heroPositionX <= 0){
          return this.haltHero();
        } 
        else if(change === "ArrowDown" && this.state.heroPositionX >= this.state.playfieldX - this.state.heroHeight){
          return this.haltHero();
        } 

      // Handle walking
        if(change === "ArrowRight" && this.state.heroPositionY <= this.state.playfieldY - this.state.heroWidth){ // Needs to account for hero width
          return this.setState({heroPositionY:this.state.heroPositionY + this.state.heroMovementDisance})
        } 
        else if(change === "ArrowLeft" && this.state.heroPositionY >= 0){
          return this.setState({heroPositionY:this.state.heroPositionY - this.state.heroMovementDisance})
        } 
        else if(change === "ArrowUp" && this.state.heroPositionX >= 0){
          return this.setState({heroPositionX:this.state.heroPositionX - this.state.heroMovementDisance})
        } 
        else if(change === "ArrowDown" && this.state.heroPositionX <= this.state.playfieldX - this.state.heroHeight){ // Needs to account for hero height
          return this.setState({heroPositionX:this.state.heroPositionX + this.state.heroMovementDisance})
        } 
        else {
          return clearInterval(this.movementInterval)    
        }
      },this.state.heroMovementUpdateSpeed)
    } else{
      return clearInterval(this.movementInterval)
    }    
  };



  handleHeroMovement(keypress){
    
    // Don't move the hero if the game is paused
    if(this.state.pausedgame === false){  
      this.updateDebugger(keypress);

      // If hero is moving and a different movement direction is picked
      if(this.state.heroMoving === "moving" && this.state.heroDirection !== keypress){
        // Change hero direction and keep hero moving
        this.setState({heroDirection:keypress,heroMoving:"moving"});
        this.handleHeroPositioning("stop") // stop first
        this.handleHeroPositioning(keypress) // then go
      }
      // If they're moving and they hit the same direciton key, stop them
      else if(this.state.heroMoving === "moving" && this.state.heroDirection === keypress) {
        this.haltHero();     
      } 
      // Otherwise, let the hero walk
      else {
        this.handleHeroPositioning(keypress)
        this.setState({heroDirection:keypress,heroMoving:"moving"});
      }
    }
  };
  

  // Default keyboard configuration for gameplay.
  // Arrow keys move the hero
  // tab key opens inventory, escape opens menu, and 
  // alpha keys get typed into text parser.
  setdefaultKeyboardListners(){

    const self = this;
    document.addEventListener('keydown', function (event) {

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        // Hanlde arrow keys for movement
        event.preventDefault()
        self.handleHeroMovement(event.key);

      } else if(event.key === 'Tab'){
        // Handle tab key for movement
        event.preventDefault()
        self.toggleInventoryScreen(event.key);
      } else 
      
        self.updateDebugger("User types text text\n");

    }, false);
  }


  // When a game is loaded, update React State with game data
  loadGameFile =(game) =>{
    console.log("App component loads " + game.title)
    const gameLoadedState = {...this.state,...game}   
    this.setState(gameLoadedState)
  }

  componentDidMount() {
    // set dimensions for play field
    const playfield = document.querySelector('main')
    
    this.setState({
      playfieldX: playfield.clientHeight, 
      playfieldY: playfield.clientWidth,
    })
    

    this.setdefaultKeyboardListners();
  }

  // Accepts input from main menu
  handleDropDownMenuClick = (event) =>{
    console.log(event.target.innerText)
  }


  render() { 
    return (
      <React.Fragment>
        <InventoryScreen 
          inventoryVisable={this.state.inventoryVisable} /> 
        <header>
        <MainMenuBar 
            gameTitle={this.state.title}
            handleDropDownMenuClick={this.handleDropDownMenuClick}
            menuActive={true} 
            playerScore={0}  />
        </header>
          <Screen 
            soundStatus={this.state.soundStatus}
            heroDirection={this.state.heroDirection}
            heroMoving={this.state.heroMoving}
            heroPositionX={this.state.heroPositionX}
            heroPositionY={this.state.heroPositionY}
            submittedText={this.state.submittedText}
            textParserValue={this.state.textParserValue}
            setdefaultKeyboardListners={this.setdefaultKeyboardListners}
            submitTextParser={this.submitTextParser}
            // textParserBlur={this.textParserBlur}
            textParserChange={this.textParserChange}
            // textParserFocus={this.textParserFocus}
            togglePause={this.togglePause}
            toggleSound={this.toggleSound} />
        
        <Debug debugText={this.state.debuggerValue}  />
        <GameSelector loadGameFile={this.loadGameFile} />
      </React.Fragment>
    );
  }
}
 
