import React, { useEffect } from 'react';

const TextInputParser = (props) => {

  // Fires when user hits Enter on text field
  const submitTextParser = () => {

    if (props.textParserValue !== "") {
      return [
        handleTextParsing(props.textParserValue),

        // Populates the Submitted Text state in app.js for processing, then clears input field
        props.textPopulateStateAndClearParser(props.textParserValue)
      ]

    }
  }

  // Input that has been input into parser
  const handleTextParsing = (textToParse) => {

    // Lowercase everything
    const makeLowerCase = textToParse.toLowerCase()

    // Take each word the user inputs and add to an array
    const makeWordArray = makeLowerCase.split(/\s+/);

    // Remove unneeded words and chars
    const garbageWords = [" ", "my", "the", "at", "to", "of", "a", "for", "all", "some", "i", "next", "with", "around", "through", "on", "in"];

    // Create an array of the essential - hopefully just a verb and a noun
    const textForParsing = makeWordArray.filter(item => !garbageWords.includes(item))


    // Check for custom per-game commands in  gameLogic.js first.    

    // Only do this if gameLogic.js exists:
    if (typeof self.customTextParser === "function") {

      // Run the text through the custom text gauntlet
      const customTextCheck = self.customTextParser(textForParsing, props) 

      // if false is returned, that means no match, and just run it through the built-in commands
      if (customTextCheck === false) {
        return handleBuiltInText(textForParsing);

      } else {
        // Otherwise run it through our custom-code handler which updates state
        return props.handleCustomReturnedCode(customTextCheck)
      }
    }
    else {
      // In case the developer hasn't included a custom game file, just run through the built-in:
      return handleBuiltInText(textForParsing)
    }
  }

  // Routes text input for build in verbs, common amoung games
  const handleBuiltInText = (textForParsing) => {

    /*
    quit
    restart
    restore
    save
    game
    pause
    slow
    normal
    fast
    fastest
    */
    if (textForParsing.includes('inventory') || textForParsing.includes('inv')) {
      return props.toggleInventoryScreen()
    } else if (textForParsing.includes('look') || textForParsing.includes('examine')) {
      return verbLook(textForParsing)
    } else if (textForParsing.includes('talk')) {
      return verbTalk(textForParsing)
    } else if (textForParsing.includes('use') || textForParsing.includes('activate') || textForParsing.includes('start')) {
      return verbUse(textForParsing)
    } else if (textForParsing.includes('help')) {
      return props.handleSubmittedTextModal(props.helpText)
    } else if (textForParsing.includes('get') || textForParsing.includes('take') || textForParsing.includes('grab')) {
      return verbGet(textForParsing)
    } else {
      return props.handleSubmittedTextModal("I don't understand what you typed. Try something else.") // TODO: The "I don't know" error message should be a text string in app.js
    }
  }

  // Built-in logic for the user typing "get"
  const verbGet = (textForParsing) => {

    // Array: Passed words without the word 'get'
    const trimmedGet = textForParsing.slice(1).join(' ')

    // Array of objs: Inventory Items the hero already has that matches this query
    const heroInventoryOwnedMatch = props.inventory.filter(item => item.Name.toLowerCase() === trimmedGet && item.owned === true);

    // Array of objs: Inventory Items the hero doesn't have that matches this query
    const heroInventoryNotOwnedMatch = props.inventory.filter(item => item.Name.toLowerCase() === trimmedGet && item.owned === false);

    // Array of obs: Inventory item, regardless of ownership
    const inventoryMatch = props.inventory.filter(item => item.Name.toLowerCase() === trimmedGet);

    // Result: Tell the user a message if they type just 'get' 
    if (JSON.stringify(textForParsing) === '["get"]' || JSON.stringify(textForParsing) === '["take"]' || JSON.stringify(textForParsing) === '["grab"]') {
      return props.handleSubmittedTextModal("You'll need to be more specific than that.")
    }

    // Result: Players asks to get a thing that doens't exist
    else if (inventoryMatch.length === 0) {
      return props.handleSubmittedTextModal("You can't get that in this game.")
    }

    // Result: Tell the player nope, because the item is flagged us unavailable.
    else if (inventoryMatch[0].available === false) {
      return props.handleSubmittedTextModal("Sorry, you can't get the " + heroInventoryNotOwnedMatch[0].Name + ".")
    }

    // Result: If the hero wants to get an item, doesn't own it, and it's in the game, but it isn't in this room:
    else if (heroInventoryOwnedMatch.length === 0 && heroInventoryNotOwnedMatch.length === 1 && props.roomCurrent !== heroInventoryNotOwnedMatch[0].FoundRoom) {
      return props.handleSubmittedTextModal("You can't get that here.")
    }

    // Result: Tell user they have it already
    else if (heroInventoryOwnedMatch.length === 1) {
      return props.handleSubmittedTextModal("You already have the " + heroInventoryOwnedMatch[0].Name)
    }

    // Result: Tell here they aren't close enough to the item to get it
    else if (props.roomNearbyInventoryItems.includes(trimmedGet) === false && heroInventoryOwnedMatch.length === 0 && heroInventoryNotOwnedMatch.length === 1 && props.roomCurrent === heroInventoryNotOwnedMatch[0].FoundRoom) {
      return props.handleSubmittedTextModal("You need to be closer to the " + trimmedGet + ".")
    }

    // Result: If the hero wants to get an item, and it's in the game, and it's in the room!
    else if (props.roomNearbyInventoryItems.includes(trimmedGet) === true && heroInventoryOwnedMatch.length === 0 && heroInventoryNotOwnedMatch.length === 1 && props.roomCurrent === heroInventoryNotOwnedMatch[0].FoundRoom) {
      // Update inventory state in app.js to repflect this.
      props.addToInventory(trimmedGet)
      return props.handleSubmittedTextModal("You got the " + heroInventoryNotOwnedMatch[0].Name + ".")
    }

    // Error: If the user asks to get thing it never can.
    else {
      return props.handleSubmittedTextModal("That's not something you can get in this game")
    }
  }

  // Built-in logic for the user typing "talk"
  const verbTalk = (textForParsing) => {

    // String: user input without the word 'talk'
    const trimmedVerb = textForParsing.slice(1).join(' ')

    // Array: NPCs in the room
    const npcDisplayObjectMatch = props.roomCurrentObjects.filter(item => item.NPC === true);

    // Array: Names of of any NPCs in the room
    const npcNames = []
    npcDisplayObjectMatch.filter(item => npcNames.push(item.Name))

    // Object: NPC that matches passed verb
    const matchNPCdefaultText = npcDisplayObjectMatch.find(npc => npc.Name === trimmedVerb)

    // Handle: User typed just 'talk' or 'ask' and there's nobody around  
    if (npcNames.length === 0 && textForParsing.length === 1) {
      return props.handleSubmittedTextModal("You shout into the void, but no one hears you.")
    }

    // Handle: User says only 'talk' or 'ask' but there are mulitple NPCs.  
    if (npcDisplayObjectMatch.length > 0 && textForParsing.length === 1) {
      return props.handleSubmittedTextModal("There's more than one person here. Who are you talking to?")
    }

    // Handle: Talking to a thing that isn't an NPC 
    if (textForParsing.length > 1 && npcNames.includes(trimmedVerb) === false) {
      return props.handleSubmittedTextModal("You try your best to talk to the " + trimmedVerb + " but it's not alive.")
    }

    // Handle: Talking to an NPC with default text in gamedata.json
    if (textForParsing.length > 1 && npcNames.includes(trimmedVerb) === true && matchNPCdefaultText.NPCdefaultText !== undefined) {
      return props.handleSubmittedTextModal(matchNPCdefaultText.NPCdefaultText)
    }

    // If there's an NPC in the room who doesn't say much
    if (textForParsing.length > 1 && npcNames.includes(trimmedVerb) === true && matchNPCdefaultText.NPCdefaultText === undefined) {
      return props.handleSubmittedTextModal("You try to talk, but they don't have much to say in response right now.")
    }

    // Handle Error
    else {
      return props.handleSubmittedTextModal("Sometimes it's more important to pay attention to what's not said.")
    }
  }

  // Built-in logic for the user typing "look"
  const verbLook = (textForParsing) => {


    // Array: User input without the word 'look'
    const trimmedLook = textForParsing.slice(1).join(' ')

    // Array: Inventory Items the hero already has
    const heroInventoryOwnedMatch = props.inventory.filter(item => item.Name.toLowerCase() === trimmedLook && item.owned === true);

    // Array: Inventory Items the hero doesn't have
    const heroInventoryNotOwnedMatch = props.inventory.filter(item => item.Name.toLowerCase() === trimmedLook && item.owned === false);

    // Array: Current room's objects the hero could be near
    const displayObjectMatch = props.roomCurrentObjects.filter(item => item.Name.toLowerCase() === trimmedLook);

    // Check to see if the user just typed 'look' or 'look room' 
    let roomLooking = function () {

      if (JSON.stringify(textForParsing) === '["look"]' || JSON.stringify(textForParsing) === '["look","room"]' || JSON.stringify(textForParsing) === '["look","around"]') {
        return true
      } else {
        return false
      }
    }

    // ...then read the room Description from this.roomCurrentDescription
    if (roomLooking() === true) {
      // If there's no description provided, give a generic answer
      if (props.roomCurrentDescription === "" || props.roomCurrentDescription === " " || props.roomCurrentDescription === null || props.roomCurrentDescription === "undefined") {
        return props.handleSubmittedTextModal("There's not much to see here.")
        // Otherwise pass the room's description to the modal
      } else {
        return props.handleSubmittedTextModal(props.roomCurrentDescription)
      }
    }

    // If the item can be owned, but isn't yet, give one kind of message
    else if (heroInventoryNotOwnedMatch.length === 1) {
      return props.handleSubmittedTextModal("You're not ready to look at this yet.")
    }

    // Otherwise read the description of it
    else if (heroInventoryOwnedMatch.length === 1) {
      return props.handleSubmittedTextModal(heroInventoryOwnedMatch[0].Description)
    }

    // look at items in the room
    else if (displayObjectMatch.length === 1) {
      return props.handleSubmittedTextModal(displayObjectMatch[0].Description)
    }

    // Looking at an error message here, got nothing
    else {
      return props.handleSubmittedTextModal("That's not something you can look at in this game")
    }
  }

  // Built-in logic for the user typing "use"
  const verbUse = (textForParsing) => {

    // Array: User input without the word 'look'
    const trimmedUse = textForParsing.slice(1).join(' ')

    // Array: Inventory Items the hero already has
    //  const heroInventoryOwnedMatch = props.inventory.filter(item => item.Name.toLowerCase() === trimmedUse && item.owned === true);

    // Array: Inventory Items the hero doesn't have
    // const heroInventoryNotOwnedMatch = props.inventory.filter(item => item.Name.toLowerCase() === trimmedUse && item.owned === false);

    // Array: Current room's objects the hero could be near
    // const displayObjectMatch = props.roomCurrentObjects.filter(item => item.Name.toLowerCase() === trimmedUse);

    // Result: Tell the user a message if they type just 'use' 
    if (JSON.stringify(textForParsing) === '["use"]' || JSON.stringify(textForParsing) === '["activate"]' || JSON.stringify(textForParsing) === '["start"]') {
      return props.handleSubmittedTextModal("You'll need to be more specific than that.")
    }

    // Most USE scenarios have to be handled in gamelogic.

    // Error: If the user asks to use/do/activate a thing it never can.
    else {
      return props.handleSubmittedTextModal("That's not something you can do in this game")
    }
  }

  // Check for a prop of EnterSubmit, then pass to submitTextParser()
  useEffect(() => {
    if (props.keyPress === "EnterSubmit") {
      submitTextParser()
    }
  }, [props.keyPress]);

  return (
    <footer>
      <form>
        <input
          spellCheck="false"
          autoComplete="false"
          type="text"
          placeholder="_"
          onChange={props.textParserChange}
          value={props.textParserValue}
        />
      </form>
    </footer>
  );
}

export default React.memo(TextInputParser);
