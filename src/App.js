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
      textParser:"_",
      submittedText:""
    };

    this.toggleSound = this.toggleSound.bind(this);
    this.submitTextParser = this.submitTextParser.bind(this);

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

  
  submitTextParser(event){
    event.preventDefault();
    console.log("enter key ")
    console.log(event.target.elements[0].value)
    this.setState({ submittedText: event.target.elements[0].value  })
    this.setState({ debuggerValue: "\n Player submitted some text"  })
  }

  //  // // User clicks into the input field
  // clearInputFieldWhenClicked(event){
  //   event.preventDefault();
  //   console.log("clicked")
  //   this.setState({textParser:""})
  // }


  // updateInputTextValue(passedText){
  //   if(passedText.current){
  //     console.log(passedText.current.value)
  //     console.log('new text' + passedText.current.value)
  //   }
   
    
  // }
  

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
          <Screen submitTextParser={this.submitTextParser}
            // clearInputFieldWhenClicked={this.state.clearInputFieldWhenClicked}
            textParser={this.state.textParser}
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
