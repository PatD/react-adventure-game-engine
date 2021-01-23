import React, { Component } from 'react';

// On click clear default value
// On enter, save input text



class TextInputParser extends Component {

  inputTextValue = React.createRef();

  // componentDidMount(){
  //   console.log('mounted')

  //   window.onkeydown = function(event){ 
  //     console.log(this.inputTextValue)
  //     this.inputTextValue.focus();

  //   }

  // }


  getDefaultCursor(){
    return "_"
  }
  
  // When user hits enter in the parser
  getInputValueText = event => {
    event.preventDefault();
    console.log(this.inputTextValue.current.value);
    alert("You just typed: " + this.inputTextValue.current.value)
    this.inputTextValue.current.value = this.getDefaultCursor()
    this.inputTextValue.current.blur()
  }

  // User clicks into the input field
  clearInputField = event => {
    event.preventDefault();
    console.log("clicked")
    this.inputTextValue.current.value = ""
  }





  render() {
    return (<form onSubmit={this.getInputValueText}>
                <input 
                  onClick={this.clearInputField}
                  type="text"
                  ref={this.inputTextValue} 
                  defaultValue={this.getDefaultCursor()} />
              </form>);
  }
}

export default TextInputParser;