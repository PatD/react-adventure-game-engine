import React, { Component } from 'react';
import TextInputParse from './TextInputParser'
import Hero from './Hero'
import DisplayObjects from './DisplayObjects'
import RoomExits from './RoomExits'


export class Screen extends Component {

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

  // Handles custom code returned from gamelogic.js - Expects object 
  handleCustomReturnedCode(returnedCode){

    // By default, don't delay anything...
    let startDelay = 0
    
    // ...but the developer can pass a delay in the object and we'll use that.
    if(returnedCode.delay !== undefined && typeof returnedCode.delay === 'number'){
      startDelay = returnedCode.delay
    }

    return setTimeout(() => {
    
      // Flag changes - expects object
      if(returnedCode.flagSet !== undefined){
        this.props.handleFlagChange(returnedCode.flagSet)
      }

      // Handle removing an existing items from inventory - expects array
      if(returnedCode.removeItems !== undefined){
        this.props.removeFromInventory(returnedCode.removeItems)
      }

      // Score change - expects number
      if(returnedCode.scoreChange !== undefined){
        this.props.updateScore(returnedCode.scoreChange)
      }

      // Stop walking hero - expects boolean
      if(returnedCode.halt !== undefined && returnedCode.halt === true){
        this.props.haltHero()
      }

      // Handle state changes in app.js.  Expects array of objects
      // This should be the default way to handle any custom game code
      if(returnedCode.newState !== undefined){
        this.props.updateAppComponentState(returnedCode.newState);
      }

      // Code can pass some custom js code back, but this isn't a great
      // idea. Game change should be managed through React state.
      if(returnedCode.custFunc !== undefined){
        returnedCode.custFunc()
      }
  
    }, startDelay)
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



  // Check for custom per-game commands in  gameLogic.js first.    

    // Only do this if gameLogic.js exists:
    if (typeof self.customTextParser === "function") { 
      
      // Run the text through the custom text gauntlet
      const customTextCheck = self.customTextParser(textForParsing,this.props)
      
      // if false is returned, that means no match, and just run it through the built-in commands
      if (customTextCheck === false){
        return this.handleBuiltInText(textForParsing);

      } else {
        // Otherwise run it through our custom-code handler which updates state
        return this.handleCustomReturnedCode(customTextCheck)
      }
    }
    else {
      // In case the developer hasn't included a custom game file, just run through the built-in:
      return this.handleBuiltInText(textForParsing)
    }
  }

  // Build in verbs for all games
  handleBuiltInText = (textForParsing) =>{
    if(textForParsing.includes('inventory')){
      this.props.updateAppComponentState({
        inventoryVisable: true,
        pausedgame: true
      })
    } else if (textForParsing.includes('look')) { // ✔️
      this.verbLook(textForParsing)
    } else if (textForParsing.includes('talk')){
      this.verbTalk(textForParsing)
    } else if (textForParsing.includes('use')) {
      this.use(textForParsing)
    } else if (textForParsing.includes('help')) { // ✔️
      this.getHelp(textForParsing)
    } else if (textForParsing.includes('get') || textForParsing.includes('take') || textForParsing.includes('grab') ) { // ✔️
      this.verbGet(textForParsing)
    } else {
      this.handleUnsure() // ✔️
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

  // Handle hero getting a game item
  // Returns a response back to props.handleSubmittedTextModal
  verbGet = (textForParsing) =>{
  
    // Array: Passed words without the word 'get'
    const trimmedGet = textForParsing.slice(1).join(' ')

    // Array of objs: Inventory Items the hero already has that matches this query
    const heroInventoryOwnedMatch = this.props.inventory.filter(item => item.Name.toLowerCase() === trimmedGet && item.owned === true);
    
    // Array of objs: Inventory Items the hero doesn't have that matches this query
    const heroInventoryNotOwnedMatch = this.props.inventory.filter(item => item.Name.toLowerCase() === trimmedGet && item.owned === false);
    
    // Array of obs: Inventory item, regardless of ownership
    const inventoryMatch = this.props.inventory.filter(item => item.Name.toLowerCase() === trimmedGet);

    // Result: Tell the user a message if they type just 'get' 
    if (JSON.stringify(textForParsing) === '["get"]' || JSON.stringify(textForParsing) === '["take"]' || JSON.stringify(textForParsing) === '["grab"]') {
      return this.props.handleSubmittedTextModal("You'll need to be more specific than that.")
    }

    // Result: Players asks to get a thing that doens't exist
    else if(inventoryMatch.length === 0){
      return this.props.handleSubmittedTextModal("You can't get that in this game.")
    }

    // Result: Tell the player nope, because the item is flagged us unavailable.
    else if(inventoryMatch[0].available === false){
      return this.props.handleSubmittedTextModal("Sorry, you can't get the " + heroInventoryNotOwnedMatch[0].Name + ".")
    }

    // Result: If the hero wants to get an item, doesn't own it, and it's in the game, but it isn't in this room:
    else if (heroInventoryOwnedMatch.length === 0 && heroInventoryNotOwnedMatch.length === 1 && this.props.roomCurrent !== heroInventoryNotOwnedMatch[0].FoundRoom) {
      return this.props.handleSubmittedTextModal("You can't get that here.")
    }

    // Result: Tell user they have it already
    else if(heroInventoryOwnedMatch.length === 1){
      return this.props.handleSubmittedTextModal("You already have the " + heroInventoryOwnedMatch[0].Name)
    }

    // Result: Tell here they aren't close enough to the item to get it
    else if(this.props.roomNearbyInventoryItems.includes(trimmedGet) === false && heroInventoryOwnedMatch.length === 0 && heroInventoryNotOwnedMatch.length === 1 && this.props.roomCurrent === heroInventoryNotOwnedMatch[0].FoundRoom){
      return this.props.handleSubmittedTextModal("You need to be closer to the " + trimmedGet + ".")
    }

    // Result: If the hero wants to get an item, and it's in the game, and it's in the room!
    else if (this.props.roomNearbyInventoryItems.includes(trimmedGet) === true && heroInventoryOwnedMatch.length === 0 && heroInventoryNotOwnedMatch.length === 1 && this.props.roomCurrent === heroInventoryNotOwnedMatch[0].FoundRoom) {
      // Update inventory state in app.js to repflect this.
      this.props.addToInventory(trimmedGet)
      return this.props.handleSubmittedTextModal("You got the " +  heroInventoryNotOwnedMatch[0].Name + ".")
     }

    // Error: If the user asks to get thing it never can.
    else{
      return this.props.handleSubmittedTextModal("That's not something you can get in this game")
    }  
  }

  // Hero talks to another thing
  verbTalk = (textForParsing) => {

    // String: user input without the word 'talk'
    const trimmedVerb = textForParsing.slice(1).join(' ')
  
    // Array: NPCs in the room
    const npcDisplayObjectMatch = this.props.roomCurrentObjects.filter(item => item.NPC === true);   

    // Array: Names of of any NPCs in the room
    const npcNames = []
    npcDisplayObjectMatch.filter(item => npcNames.push(item.Name))
    
    // Object: NPC that matches passed verb
    const matchNPCdefaultText = npcDisplayObjectMatch.find(npc => npc.Name === trimmedVerb)
 

    // Handle: User typed just 'talk' or 'ask' and there's nobody around  
    if(npcNames.length === 0 && textForParsing.length === 1){
      return this.props.handleSubmittedTextModal("You shout into the void, but no one hears you.")
    }

    // Handle: User says only 'talk' or 'ask' but there are mulitple NPCs.  
    if(npcDisplayObjectMatch.length > 0 && textForParsing.length === 1){
      return this.props.handleSubmittedTextModal("There's more than one person here. Who are you talking to?")
    }

    // Handle: Talking to a thing that isn't an NPC 
    if(textForParsing.length > 1 && npcNames.includes(trimmedVerb) === false){
      return this.props.handleSubmittedTextModal("You try your best to talk to the " + trimmedVerb + " but it's not alive." )
    }

    // Handle: Talking to an NPC with default text in gamedata.json
    if(textForParsing.length > 1 && npcNames.includes(trimmedVerb) === true && matchNPCdefaultText.NPCdefaultText !== undefined){
      return this.props.handleSubmittedTextModal(matchNPCdefaultText.NPCdefaultText)
    }

    // If there's an NPC in the room who doesn't say much
    if(textForParsing.length > 1 && npcNames.includes(trimmedVerb) === true && matchNPCdefaultText.NPCdefaultText === undefined){
      return this.props.handleSubmittedTextModal("You try to talk, but they don't have much to say in response right now.")
    }

    // Handle Error
    else {
      return this.props.handleSubmittedTextModal("Sometimes it's more important to pay attention to what's not said.")
    }
  }

  // Handles the player typing the word 'look'
  // Returns a response back to props.handleSubmittedTextModal
  verbLook = (textForParsing) => {

     // Array: User input without the word 'look'
     const trimmedLook = textForParsing.slice(1).join(' ')

     // Array: Inventory Items the hero already has
     const heroInventoryOwnedMatch = this.props.inventory.filter(item => item.Name.toLowerCase() === trimmedLook && item.owned === true);
     
     // Array: Inventory Items the hero doesn't have
     const heroInventoryNotOwnedMatch = this.props.inventory.filter(item => item.Name.toLowerCase() === trimmedLook && item.owned === false);
     
     // Array: Current room's objects the hero could be near
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
        
        {/* Per game logic is injected here  */}
        <script script={this.props.gameLogic}></script>

        <style>
          {heroSpriteCSS}
        </style>
        <section id="gameUI" style={{width:this.props.gameWidth, height:this.props.gameHeight}}>
          <main className={this.props.roomCurrentName + " " + this.props.roomCurrentAltStyle} >

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

export default React.memo(Screen);