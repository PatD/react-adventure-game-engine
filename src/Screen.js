import React, { Component } from 'react';
import TextInputParse from './TextInputParser'
import Hero from './Hero'
import DisplayObjects from './DisplayObjects'
import RoomExits from './RoomExits'

export default class Screen extends Component {


  // Fires when user hits Enter on text field
  submitTextParser = event => {

    event.preventDefault();

    if (this.props.pausedgame === false && this.props.inventoryVisable === false && event.target.elements[0].value !== "") {

      this.handleTextParsing(event)

      // Populates the Submitted Text state for processing then clears input field
      this.props.textPopulateStateAndClearParser(event);

    }
    else {
      // If the enter key is pressed, while the modal is open, close the modal
      this.props.hideModal()
    }
  }




  // Input text parsing
  handleTextParsing(event) {

    // Lowercase everything
    const makeLowerCase = event.target.elements[0].value.toLowerCase()

    // Take each word the user inputs and add to an array
    const makeWordArray = makeLowerCase.split(/\s+/);

    // Remove unneeded words and chars
    const garbageWords = [" ", "", "my", "the", "at", "to", "of", "a", "for", "all", "some", "i", "next", "with", "around", "through", "on", "in",".",",","!","?"];

    // Create an array of the essential - hopefully just a verb and a noun
    const textForParsing = makeWordArray.filter(item => !garbageWords.includes(item))

    // Breaks user input into an array and puts in state
    this.setState({ textForParsing });


    // Verb gauntlet

    // Assume these verbs are in most games.  Additional support provided from customVerbs in gamedata.json
    // "use","change","take", "search", "help", "hold","press", "throw", "push","pull","eat","turn","inventory","look","open","examine","close","inventory","save","restart","restore","inspect","get","pick","drop","talk","read"

    if (textForParsing.includes('look')) {
      this.verbLook(textForParsing)
    } else if (textForParsing.includes('use')) {
      this.use(textForParsing)
    } else if (textForParsing.includes('help')) {
      this.getHelp(textForParsing)
    } else if (textForParsing.includes('get') || textForParsing.includes('take') || textForParsing.includes('grab') ) {
      this.getObject(textForParsing)
    } else {
      this.handleUnsure()
    }

  }


  // For when we just don't have any idea what the person typed:
  handleUnsure = () => {
    return this.props.handleSubmittedTextModal("I don't understand what you typed. Try something else.")
  }


  // If the user begs for help
  getHelp = () =>{
    return this.props.handleSubmittedTextModal(this.props.helpText)
  }


  // Hero picks up an object.
  getObject = (textForParsing) =>{

    // If they just type get
    let justGet = function () {
      if (JSON.stringify(textForParsing) === '["get"]' || JSON.stringify(textForParsing) === '["take"]' || JSON.stringify(textForParsing) === '["grab"]') {
        return true
      } else {
        return false
      }
    }

    if (justGet() === true) {
      return this.props.handleSubmittedTextModal("You'll need to be more specific than that.")
    }
  
    if (justGet() === false) {

      // Do we have it already?

      // Array without the word 'get'
      const trimmedGet = textForParsing.slice(1).join(' ')

      // Split what is owned and what isn't
      const heroInventoryOwned = this.props.inventory.filter(item => item.owned === true);
      const heroInventoryNotOwned = this.props.inventory.filter(item => item.owned === false);

      // Tell the hero they already got it
      heroInventoryOwned.forEach(item => {
        const lowerName = item.Name.toLowerCase()
        if (lowerName === trimmedGet) {
          return this.props.handleSubmittedTextModal("You already have that!")
        }
      })

      // If the hero wants to get an item, and it's in the game, but it isn't in this room:
      heroInventoryNotOwned.forEach(item => {
        const lowerName = item.Name.toLowerCase()
        if (lowerName === trimmedGet && this.props.roomCurrent !== item.FoundRoom) {
          return this.props.handleSubmittedTextModal("You can't get that here.")
        }
      })

      // If the hero wants to get an item, and it's in the game, and it's in the room!
      heroInventoryNotOwned.forEach(item => {
        const lowerName = item.Name.toLowerCase()
        if (lowerName === trimmedGet && this.props.roomCurrent === item.FoundRoom) {

          // Update inventory state in app.js to repflect this.
          this.props.addToInventory(trimmedGet)

          return this.props.handleSubmittedTextModal("You got the " + item.Name + ".")
        }
      })



      // If the item can be owned, but isn't yet, give one kind of message
      // heroInventoryNotOwned.forEach(item => {
      //   const lowerName = item.Name.toLowerCase()
      //   if (lowerName === trimmedGet) {
      //     return this.props.handleSubmittedTextModal("You're not ready to look at this yet.")
      //   }
      // })


    
    }

    // return this.props.handleSubmittedTextModal("Not sure what you're trying to get.")

    // If it's not a getable thing


    

    // Is it in this room?

    // We can get it, and we need to add to player inventory

  }





  // Handles the player typing the word 'look'
  // Passes a response back to app.js handleSubmittedTextModal
  verbLook = (textForParsing) => {

     // Array without the word 'look'
     const trimmedLook = textForParsing.slice(1).join(' ')

     // Array of Inventory Items the hero already owns
     const heroInventoryOwnedMatch = this.props.inventory.filter(item => item.Name.toLowerCase() === trimmedLook && item.owned === true);
     
     // Array of Inventory Items the hero doesn't own
     const heroInventoryNotOwnedMatch = this.props.inventory.filter(item => item.Name.toLowerCase() === trimmedLook && item.owned === false);
     
     // Array of Display Objects the hero is glancing at
     const displayObjectMatch = this.props.roomCurrentObjects.filter(item => item.Name.toLowerCase() === trimmedLook);
    
    // Check to see if the user just typed look or look room 
    let roomLooking = function(){
      if(JSON.stringify(textForParsing) === '["look"]' || JSON.stringify(textForParsing) === '["look","room"]' || JSON.stringify(textForParsing) === '["look","around"]'){
        return true
      } else {
        return false
      }
    }

    // ...then read the room Description from this.roomCurrentDescription
    if (roomLooking() === true) {
      // If there's no description provided, give a generic answer
      if (this.props.roomCurrentDescription === "" || this.props.roomCurrentDescription === " " || this.props.roomCurrentDescription === null || this.props.roomCurrentDescription === "undefined") {
        return this.props.handleSubmittedTextModal("There's not much to see here.")
        // Otherwise pass the room's description to the modal
      } else {
        return this.props.handleSubmittedTextModal(this.props.roomCurrentDescription)
      }
    }

    // If the item can be owned, but isn't yet, give one kind of message
    else if(heroInventoryNotOwnedMatch.length === 1){
      return this.props.handleSubmittedTextModal("You're not ready to look at this yet.")
    }
    
    // Otherwise read the description of it
    else if(heroInventoryOwnedMatch.length === 1){
      return this.props.handleSubmittedTextModal(heroInventoryOwnedMatch[0].Description)
    }

    // look at items in the room
    else if(displayObjectMatch.length === 1){      
      return this.props.handleSubmittedTextModal(displayObjectMatch[0].Description)
    }

    // Looking at an error message here
    else{
      return this.props.handleSubmittedTextModal("That's not something you can look at in this game")
    }  
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