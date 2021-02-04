import React, { Component } from 'react';

// On click clear default value
// On enter, save input text



class TextInputParser extends Component {

  // inputTextValue = React.createRef();

  componentDidMount(){
   
    console.log('mounted')
    // this.inputTextValue.current.value ="_"


    // window.onkeydown = function(event){ 
    //   console.log(this.inputTextValue)
    //   this.inputTextValue.focus();

    // }

  }

  

  // getDefaultCursor(){
  //   return "_"
  // }
  
  // // When user hits enter in the parser
  // getInputValueText = event => {
  //   event.preventDefault();
  //   console.log(this.inputTextValue.current.value);
  //   alert("You just typed: " + this.inputTextValue.current.value)
  //   this.inputTextValue.current.value = this.getDefaultCursor()
  //   this.inputTextValue.current.blur()
  // }

  // User clicks into the input field
  // clearInputField = event => {
  //   event.preventDefault();
  //   console.log("User has clicked input field")
  //   this.inputTextValue.current.value =""
  // }


  componentDidUpdate() {
    this.searchInput.focus();
  //  console.log(prevProps)
  //  console.log(this.inputTextValue)

  //  if(this.inputTextValue.current.value !== '_'){
  //   this.inputTextValue.current.value = '_'
  //  }
  } 


  // blurTextParser = event => {
  //   console.log("User has tabbed/clicked away from input field")
  //   this.inputTextValue.current.value = "_"
  // }


  render(props) {
    return (<input
                onFocus={this.props.textParserFocus}
                onBlur={this.props.textParserBlur}
                spellCheck="false"
                autoComplete="false"
                // onFocus="this.value='_'"
                // onSubmit={this.formSubmit}
                // onFocus={this.clearInputField}
                // onInputCapture={this.clearInputField}
                type="text"
                placeholder="_"
                ref={inputEl => (this.searchInput = inputEl)} 
                // defaultValue={this.props.textParser}
                // value={this.props.textParserValue}
                onChange={this.props.textParserChange}
                value={this.props.textParserValue} 
                />
          );
  }
}

export default TextInputParser;