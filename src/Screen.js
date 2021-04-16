import React, { Component } from 'react';
import TextInputParse from './TextInputParser'
import Hero from './Hero'
import DisplayObjects from './DisplayObjects'
import RoomExits from './RoomExits'

export default class Screen extends Component {



  // Fires when user hits enter on text field
  submitTextParser = event => {

    event.preventDefault();

    if (this.props.pausedgame === false && this.props.inventoryVisable === false) {
      console.log("Submitted event new text")

      this.handleTextParsing(event)
      
      // Populates the Submitted Text state for processing then clears input field
      this.props.textPopulateStateAndClearParser(event);

      

    }
    else {
      // If the enter key is pressed, while the modal is open, close the modal
      console.log('Submitted event modal closed')
      this.props.hideModal()

  
    }

  }




 // Input text parsing
 handleTextParsing(event){
      console.log(event.target.elements[0].value,)
      // Lowercase everything
      const makeLowerCase = event.target.elements[0].value.toLowerCase()

      // Take each word the user inputs and add to an array
      const makeWordArray = makeLowerCase.split(/\s+/);

      // Remove unneeded words and chars
      const garbageWords = [" ","","the","at","to","of","a","for","all","some","i","next","with","around","through","on","in"];

      // An array of the essential - hopefully just a verb and a noun
      const textForParsing = makeWordArray.filter(item => !garbageWords.includes(item))      

      // Breaks user input into an array and puts in state
      this.setState({textForParsing});

      // In this component, record this as the previous state, so we can check it next time.
      // this.setState({prevSubmittedText:this.props.submittedText});
      

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

      console.log(heroInventoryOwned)
      console.log(heroInventoryNotOwned)
      


      
      return this.props.handleSubmittedTextModal("Looking an a thing ")

    }
    

  
    // What displayobjects in current room can be looked at?
      // Loop through this.props.roomCurrentObjects and if it has a Description that isn't "" or null

    } 




  render(props) {
    // Since the hero sprite is base64, add it as a style stag:
    const heroSpriteCSS = `#hero {background-Image:` + this.props.heroSprite + `}`

    return (
      <React.Fragment>
        <style>
          {heroSpriteCSS}
        </style>
        <section id="gameUI">
          <main className={this.props.roomCurrentName}>

            <RoomExits
              roomExits={this.props.roomExits}
              roomCurrentName={this.props.roomCurrentName} />

            <DisplayObjects
              roomCurrentName={this.props.roomCurrentName}
              roomCurrentObjects={this.props.roomCurrentObjects} />

            <Hero
              heroHeight={this.props.heroHeight}
              heroWidth={this.props.heroWidth}
              heroPositionX={this.props.heroPositionX}
              heroPositionY={this.props.heroPositionY}
              heroDirection={this.props.heroDirection}
              heroMoving={this.props.heroMoving}
              heroSprite={this.props.heroSprite}
            />

          </main>
          <footer>
            <form onSubmit={this.submitTextParser}>
              <TextInputParse
                sendToChildFunct={this.sendToChildFunct}
                customVerbs={this.props.customVerbs}
                inventory={this.props.inventory}
                textParserChange={this.props.textParserChange}
                textParserValue={this.props.textParserValue}
                heroPositionX={this.props.heroPositionX}
                heroPositionY={this.props.heroPositionY}
                roomCurrentName={this.props.roomCurrentName}
                roomCurrentObjects={this.props.roomCurrentObjects} 
                roomCurrentDescription={this.props.roomCurrentDescription}
                submittedText={this.props.submittedText}
                handleSubmittedTextModal={this.props.handleSubmittedTextModal}
              />
            </form>
          </footer>
        </section>
      </React.Fragment>)
  }
}