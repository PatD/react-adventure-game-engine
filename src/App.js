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
      submittedText:""
    };

    this.toggleSound = this.toggleSound.bind(this);
    // this.textParserBlur = this.textParserBlur.bind(this);
    // this.textParserChange = this.textParserChange.bind(this);
   // this.submitTextParser = this.submitTextParser.bind(this);

  }
  

  toggleSound(){

    if(this.state.soundStatus === "On"){
      this.setState({ soundStatus: "Off"});
    } else{
      this.setState({ soundStatus: "On"});
    }
  }

  updateDebugger(keyCaptured){
    // console.log(this.state)
    // console.log("hi")
    this.setState({ debuggerValue: "\n Player pressed: " + keyCaptured + "\n " +  this.state.debuggerValue  })
  }

  
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

  // Text parser
  textParserBlur = event => {
    console.log("parser blurred")
  }

  textParserChange = event => {
    console.log("parser changed")

    this.setState({
      textParserValue: event.target.value
    });

  }
  textParserFocus = event =>{
    console.log("parser focused")
  }

  

  componentDidMount() {

    const self = this;
    document.addEventListener('keydown', function (event) {

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
     //   console.info("Direction Arrow:" + event.key)
        self.updateDebugger(event.key);
      } else {
        console.info(event.key)
        // Set focus on parser
       // console.log(self.state)
        self.updateDebugger("User types text text\n");
        

      }

    }, false);
  }

  render() { 
    return (
      <React.Fragment>
        <section id="gameUI">
          <Screen 
            submitTextParser={this.submitTextParser}
            // clearInputFieldWhenClicked={this.state.clearInputFieldWhenClicked}
            // textParser={this.state.textParser}
            textParserValue={this.state.textParserValue}
            textParserBlur={this.textParserBlur}
            textParserChange={this.textParserChange}
            textParserFocus={this.textParserFocus}
            // submitTextParser={this.state.submitTextParser}
            // updateInputTextValue={this.updateInputTextValue}
            toggleSound={this.toggleSound} 
            soundStatus={this.state.soundStatus} />
        </section>
        <InventoryScreen />
        <Debug debugText={this.state.debuggerValue}  />
      </React.Fragment>
    );
  }
}

export default App;
