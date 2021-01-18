import React, { Component } from 'react';

// On click clear default value
// On enter, save input text

const textParser = (
    <React.Fragment>
      <input defaultValue="_"></input>
    </React.Fragment>
)

class TextInputParser extends Component {
  render() {
    return textParser
  }
}

export default TextInputParser;