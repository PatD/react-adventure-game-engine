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
    const garbageWords = [" ", "my", "the", "at", "to", "of", "a", "for", "all", "some", "i", "next", "with", "around", "through", "on", "in"];

    // Create an array of the essential - hopefully just a verb and a noun
    const textForParsing = makeWordArray.filter(item => !garbageWords.includes(item))

    // Breaks user input into an array and puts in state
    this.setState({ textForParsing });



    // Everything has to lead to custom scripts, and maybe back to this



    // Verb gauntlet

    // Assume these verbs are in most games.  Additional support provided from customVerbs in gamedata.json
    // "use","change", "search",  "hold","press", "throw", "push","pull","eat","turn","inventory","look","open","examine","close","inventory","save","restart","restore","inspect","get","pick","drop","talk","read"

    if (textForParsing.includes('look')) { // ✔️
      this.verbLook(textForParsing)
    } else if (textForParsing.includes('use')) {
      this.use(textForParsing)
    } else if (textForParsing.includes('help')) { // ✔️
      this.getHelp(textForParsing)
    } else if (textForParsing.includes('get') || textForParsing.includes('take') || textForParsing.includes('grab') ) { // ✔️
      this.getObject(textForParsing)
    } else if(window.gameLogic){
      this.handleCustomGameLogic(textForParsing)
    } else {
      this.handleUnsure() // ✔️
    }

  }

  // Support for custom verbs
  handleCustomGameLogic = (textForParsing) =>{
    window.gameLogic.handleCustomVerbs(textForParsing, this.props)
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
  
    // Array without the word 'get'
    const trimmedGet = textForParsing.slice(1).join(' ')
    console.log(trimmedGet)
    console.log(this.props.roomNearbyInventoryItems)
    console.log(this.props.roomNearbyInventoryItems.includes(trimmedGet))

    // Array of Inventory Items the hero already has
    const heroInventoryOwnedMatch = this.props.inventory.filter(item => item.Name.toLowerCase() === trimmedGet && item.owned === true);
    
    // Array of Inventory Items the hero doesn't have
    const heroInventoryNotOwnedMatch = this.props.inventory.filter(item => item.Name.toLowerCase() === trimmedGet && item.owned === false);
    

    // If they just type 'get'
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

    // If the hero wants to get an item, doesn't own it, and it's in the game, but it isn't in this room:
    else if (heroInventoryOwnedMatch.length === 0 && heroInventoryNotOwnedMatch.length === 1 && this.props.roomCurrent !== heroInventoryNotOwnedMatch[0].FoundRoom) {
      return this.props.handleSubmittedTextModal("You can't get that here.")
    }

    // Do we have it already?
    else if(heroInventoryOwnedMatch.length === 1){
      return this.props.handleSubmittedTextModal("You already have the " + heroInventoryOwnedMatch[0].Name)
    }

    // Hero isn't close enough to the item to get it
    else if(this.props.roomNearbyInventoryItems.includes(trimmedGet) === false && heroInventoryOwnedMatch.length === 0 && heroInventoryNotOwnedMatch.length === 1 && this.props.roomCurrent === heroInventoryNotOwnedMatch[0].FoundRoom){
      return this.props.handleSubmittedTextModal("You need to be closer to the " + trimmedGet + ".")
    }

    // If the hero wants to get an item, and it's in the game, and it's in the room!
    else if (this.props.roomNearbyInventoryItems.includes(trimmedGet) === true && heroInventoryOwnedMatch.length === 0 && heroInventoryNotOwnedMatch.length === 1 && this.props.roomCurrent === heroInventoryNotOwnedMatch[0].FoundRoom) {
      // Update inventory state in app.js to repflect this.
      this.props.addToInventory(trimmedGet)

      // Is it on the screen?  Set state to account for this.
      // this.props.takeObjectOffScreen(trimmedGet)

      return this.props.handleSubmittedTextModal("You got the " +  heroInventoryNotOwnedMatch[0].Name + ".")
    }

    // If the user asks to get thing it never can.
    else{
      return this.props.handleSubmittedTextModal("That's not something you can get in this game")
    }  
  }





  // Handles the player typing the word 'look'
  // Passes a response back to app.js handleSubmittedTextModal
  verbLook = (textForParsing) => {

     // Array of user input without the word 'look'
     const trimmedLook = textForParsing.slice(1).join(' ')

     // Array of Inventory Items the hero already has
     const heroInventoryOwnedMatch = this.props.inventory.filter(item => item.Name.toLowerCase() === trimmedLook && item.owned === true);
     
     // Array of Inventory Items the hero doesn't have
     const heroInventoryNotOwnedMatch = this.props.inventory.filter(item => item.Name.toLowerCase() === trimmedLook && item.owned === false);
     
     // Array of Display Objects the hero could be glancing at
     const displayObjectMatch = this.props.roomCurrentObjects.filter(item => item.Name.toLowerCase() === trimmedLook);
    
    // Check to see if the user just typed 'look' or 'look room' 
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

    // Looking at an error message here, got nothing
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
        <section id="gameUI" style={{width:this.props.gameWidth, height:this.props.gameHeight}}>
          <main className={this.props.roomCurrentName}>

            <RoomExits
              roomExits={this.props.roomExits}
              roomCurrentName={this.props.roomCurrentName} />

            <DisplayObjects
              roomCurrent={this.props.roomCurrent}
              inventory={this.props.inventory}
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