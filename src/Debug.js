import React, { Component } from 'react';


const debuggerUI = (
  <div> 
    <textarea defaultValue='Debugging goes here'></textarea>
  </div>
)

class Debug extends Component {
  render() {
    return debuggerUI
  }
}

export default Debug;