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
  
      // Lowercase everything
      const makeLowerCase = this.props.submittedText.toLowerCase()

      // Take each word the user inputs and add to an array
      const makeWordArray = makeLowerCase.split(/\s+/);

      // Remove unneeded words and chars
      const garbageWords = [" ","","the","at","to","of","a","for","all","some","i","next","with","around","through","on","in"];

      // An array of the essential - hopefully just a verb and a noun
      const textForParsing = makeWordArray.filter(item => !garbageWords.includes(item))      

      // Breaks user input into an array and puts in state
      this.setState({textForParsing});

      // In this component, record this as the previous state, so we can check it next time.
      this.setState({prevSubmittedText:this.props.submittedText});

      // Verb gauntlet
      
      // Assume these verbs are in most games.  Additional support provided from customVerbs in gamedata.json
      //  "help","push","pull","eat","turn","inventory","look","open","examine","close","inventory","save","restart","restore","inspect","get","pick","drop","talk","read"

      if(textForParsing.includes('look')){
        this.verbLook(textForParsing)
      } else if(textForParsing.includes('help')){
          this.help(textForParsing)
      } else if (textForParsing.includes('push')){
          this.push(textForParsing)
      } else{
         this.handleUnsure()
      }

    }
  }

  // For when we just don't have any idea what the person typed:
  handleUnsure = () =>{
    return this.props.handleSubmittedTextModal("I don't understand what you typed. Try something else.")
  }

  // Handles the player typing the word 'look'
  verbLook = (textForParsing) => {

    // If just "look" (or 'look room' is typed, 
    // then read the room Description from this.roomCurrentDescription
    if(JSON.stringify(textForParsing) === '["look"]' || JSON.stringify(textForParsing) === '["look","room"]'){
      if(this.props.roomCurrentDescription === "" || this.props.roomCurrentDescription === " " || this.props.roomCurrentDescription === null || this.props.roomCurrentDescription === "undefined"){
        return this.props.handleSubmittedTextModal("There's not much to see here")
      } else{
        return this.props.handleSubmittedTextModal(this.props.roomCurrentDescription)
      }
    }

    // What inventory items can be looked at?
    // Loop through this.props.inventory and read 'Description' if 'owned' is true

    if(textForParsing.length > 1 && JSON.stringify(textForParsing) !== '["look","room"]'){
      console.log(textForParsing[1])
      const heroInventoryOwned = this.props.inventory.filter(item => item.owned === true);
      const heroInventoryNotOwned = this.props.inventory.filter(item => item.owned === false);

      


      
      return this.props.handleSubmittedTextModal("Looking an a thing ")

    }
    

  
    // What displayobjects in current room can be looked at?
      // Loop through this.props.roomCurrentObjects and if it has a Description that isn't "" or null

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
