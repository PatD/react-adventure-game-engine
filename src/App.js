import React, { Component } from 'react';
import Screen from './Screen';
import Debug from './Debug'
import InventoryScreen from './InventoryScreen'


// import HandleKeyPresses from './HandleKeyPresses'


class App extends Component {
  constructor() {
    super();

    this.state = {
      soundStatus: "On",
      debuggerValue: "This is the debugger window",
      textParserValue:"",
      submittedText:"",
      inventoryVisable:"display-none",
      heroDirection:"ArrowRight",
      heroMoving:"stopped"
    };

    this.toggleSound = this.toggleSound.bind(this);
    // this.setdefaultKeyboardListners = this.setdefaultKeyboardListners.bind(this)
    // this.setModalKeyboardListeners = this.setModalKeyboardListeners.bind(this)
  }
  
  handleHeroStopStart(event){

    if(this.state.heroMoving === "stopped"){
      this.setState({heroMoving:"moving"})
    } else{
      this.setState({heroMoving:"stopped"})
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

    // Updates debugger
    this.setState({ debuggerValue: "\n Player submitted some text"  })

    // Clears input field
    this.setState({ textParserValue: ""  })
  }
  
  textParserBlur = event => {
 //   console.log("parser blurred")
  }
  textParserChange = event => {
   // console.log("parser changed")

    this.setState({
      textParserValue: event.target.value
    });

  }
  textParserFocus = event =>{
 //   console.log("parser focused")
  }
  toggleInventoryScreen = event => {
    if (this.state.inventoryVisable === "display-none") {
      this.setState({ inventoryVisable: "display-block" })
      this.updateDebugger("User activates inventory screen\n");
    } else {
      this.setState({ inventoryVisable: "display-none" })
      this.updateDebugger("User deactivates inventory screen\n");
      // this.setdefaultKeyboardListners();
    }
  }


  

  // Default keyboard configuration for gameplay
  // In normal game mode, arrow keys move the hero
  // tab key opens inventory, escape opens menu, and 
  // alpha keys get typed into text parser.
  setdefaultKeyboardListners(){

    const self = this;
    document.addEventListener('keydown', function (event) {

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        // Hanlde arrow keys for movement
        event.preventDefault()
        self.updateDebugger(event.key);
        self.setState({heroDirection: event.key})
        self.handleHeroStopStart(event.key);

      } else if(event.key === 'Tab'){
        // Handle tab key for movement
        event.preventDefault()
        self.updateDebugger(event.key);
        self.toggleInventoryScreen();

      } else 
      
        self.updateDebugger("User types text text\n");

    }, false);
  }



  componentDidMount() {
    this.setdefaultKeyboardListners();
  }

  render() { 
    return (
      <React.Fragment>
        <InventoryScreen inventoryVisable={this.state.inventoryVisable} /> 
        <section id="gameUI">
          <Screen 
            heroDirection={this.state.heroDirection}
            heroMoving={this.state.heroMoving}
            submittedText={this.state.submittedText}
            setdefaultKeyboardListners={this.setdefaultKeyboardListners}
            submitTextParser={this.submitTextParser}
            textParserValue={this.state.textParserValue}
            textParserBlur={this.textParserBlur}
            textParserChange={this.textParserChange}
            textParserFocus={this.textParserFocus}
            toggleSound={this.toggleSound} 
            soundStatus={this.state.soundStatus} />
        </section>
        <Debug debugText={this.state.debuggerValue}  />
      </React.Fragment>
    );
  }
}

export default App;
