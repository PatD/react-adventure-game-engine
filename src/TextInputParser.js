import React, { Component } from 'react';

export default class TextInputParser extends Component {
  constructor() {
    super();
    this.state = {
      prevSubmittedText:"",
      wordArray:[]
    }
  }





  // Input text parsing
  handleTextParsing(){
  //  if(this.props.submittedText.length>0 && this.state.prevSubmittedText !== this.props.submittedText){
    // this.setState({prevSubmittedText:""})
  
  if(this.props.submittedText.length !==""){
   
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

  

  componentDidMount(){
    this.searchInput.focus();
  }

  componentDidUpdate(prevProps) {
    this.searchInput.focus();


    // If the App component submitted text is determined to not match the last submitted text, start parsing
    // Weird because Submit function is in parent component.
    // Have to have the submit function do this owrk, not componentupdate

    if(this.state.prevSubmittedText !== this.props.submittedText){
    //  this.handleTextParsing() 
    } 

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
