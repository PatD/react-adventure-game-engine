import React, { Component } from 'react';
import Screen from './Screen';
import Debug from './Debug'
import InventoryScreen from './InventoryScreen'

// import HandleKeyPresses from './HandleKeyPresses'



class App extends Component {
  constructor() {
    super();

    this.state = {
      debuggerValue: "This is the debugger window"
    };

  }
  
  updateDebugger(keyCaptured){
    console.log(this.state)
    console.log("hi")
    this.setState({ debuggerValue: "\n Player pressed: " + keyCaptured + "\n " +  this.state.debuggerValue  })
  }


  

  componentDidMount() {

    const self = this;
    document.addEventListener('keydown', function (event) {

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        console.info("Direction Arrow:" + event.key)
        self.updateDebugger(event.key);
      } else {
        console.info(event.key)
        // Set focus on parser
        console.log(self.state)
        self.setState({debuggerValue: "my text"})
      }

    }, false);
  }

  render() { 
    return (
      <React.Fragment>
        <section id="gameUI">
          <Screen />
        </section>
        <InventoryScreen />
        <Debug debugText={this.state.debuggerValue}  />
      </React.Fragment>
    );
  }
}

export default App;
