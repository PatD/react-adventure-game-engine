import React, { Component } from 'react';

export default class TextInputParser extends Component {
  constructor() {
    super();
    this.state = {
      // Previous text submitted.  
      prevSubmittedText:"",
      wordArray:[]
    }
  }





  // Input text parsing
  handleTextParsing(){
    if(this.props.submittedText.length>0 && this.state.prevSubmittedText !== this.props.submittedText){
      console.log("User submitted this text: " + this.props.submittedText)
      
      const wordArray = this.props.submittedText.split(/\s+/);

      // Breaks user input into an array and puts in state
      this.setState({wordArray});

      // In this component, record this as the previous state, so we can check it next time.
      this.setState({prevSubmittedText:this.props.submittedText});

      // Verb gauntlet
      
      // Assume these verbs are in most games.  Additional support provided from customVerbs in gamedata.json
      //  "help","push","pull","eat","turn","inventory","look","open","examine","close","inventory","save","restart","restore","inspect","get","pick","drop","talk","read"

      if(wordArray.includes('look')){
        this.verbLook(wordArray)
      } else if(wordArray.includes('help')){
          this.help(wordArray)
      } else if (wordArray.includes('push')){
          this.push(wordArray)
      } else{
          return console.log('wut')
      }

    }
  }

  verbLook = (wordArray) =>{
    console.log(wordArray)
  
    // What inventory items can be looked at?
      // Loop through this.props.inventory and read 'Description' if 'owned' is true
  
    // What displayobjects in current room can be looked at?
      // Loop through this.props.roomCurrentObjects and if it has a Description that isn't "" or null

    // If just "look" is typed, read the room Description from this.roomCurrentDescription
  
  
  
  }















  componentDidMount(){
    this.searchInput.focus();
  }

  componentDidUpdate() {
    this.searchInput.focus();
    this.handleTextParsing()
  }

  render(props) {
    return (
      <input
        spellCheck="false"
        autoComplete="false"
        type="text"
        placeholder="_"
        ref={inputEl => (this.searchInput = inputEl)}
        onChange={this.props.textParserChange}
        value={this.props.textParserValue}
      />
    );
  }
}
