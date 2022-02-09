import React from 'react';

// Act as a relay for all keyboard presses in the game.

/* Consider this needs to support:

    1. Hero movement
    2. Inventory screen (tab)
    3. Text parser
    4. Main menu arrows/selctions
    5. Dialog box confirmation
    6. Escape for dialog box, menu
    7. "Any key" to close menu
*/

// There's an event listener in app.js that captures the keystroke and saves it in state. 
// That keystroke is passed here, where it's processed.

const KeyboardControls = (props) => {

    const keysForTypingInput = 'abcdefghijklmnopqrstuvwxyz01234567890.,-=_+`~!@#$%^&*()?'.split("")

    React.useEffect(() => {

        // Handles user pressing any key while inventory is open
        if (props.heroAlive === true && props.inventoryVisable === true && props.roomTitleScreen === false && props.menuBarActive === false){
            return props.toggleInventoryScreen()
        }

        // Handle user hitting enter at the title screen, starts the game
        else if (
            (props.keyPress === 'Enter') && 
            (props.heroAlive === false && props.roomTitleScreen === true && props.modalStatus === false && props.menuBarActive === false)) {

            if (props.gameStartRoomNumber !== undefined) {
                // This lets the developer specify the starting room number in gamedata.json
                return props.loadRoom(props.gameStartRoomNumber)

            } else {
                // But if they dont't specify, Room #2 is loaded for safety
                return props.loadRoom(2)
            }
        }

        // Handle Inventory screen toggling
        else if (
            (props.keyPress === 'Tab') && 
            (props.inventoryVisable === false && props.roomTitleScreen === false && props.modalStatus === false && props.menuBarActive === false)) {
            return props.toggleInventoryScreen()
        }

        // Handle Escape key to close modal dialog box
        else if (
            (props.keyPress === "Escape") && 
            (props.inventoryVisable === false && props.modalStatus === true)) {
            return props.hideModal(props.keyPress)
        }

        // Handle Escape key to toggle main menu
        else if (
            (props.keyPress === "Escape") && 
            (props.inventoryVisable === false && props.modalStatus === false)) {
            return props.toggleMainMenu()
        }
        
        // Hero movement - Handle arrow keys
        else if (
            (props.keyPress === 'ArrowDown' || props.keyPress === 'ArrowUp' || props.keyPress === 'ArrowLeft' || props.keyPress === 'ArrowRight') && 
            (props.menuBarActive === false && props.heroAlive === true && props.roomTitleScreen === false && props.inventoryVisable === false && props.pausedgame === false)){
            return props.handleHeroMovement(props.keyPress)
        }
    
        // Main menu - Handle arrow keys
        else if (
            (props.keyPress === 'ArrowDown' || props.keyPress === 'ArrowUp' || props.keyPress === 'ArrowLeft' || props.keyPress === 'ArrowRight') && 
            (props.menuBarActive === true && props.inventoryVisable === false)){
            return props.handleMainMenuKeyPress(props.keyPress)
        }
        
        // Handle Enter key for selection in menu boxes
        else if (
            (props.keyPress === 'Enter') &&
            (props.menuBarActive === true && props.inventoryVisable === false)) {

            // Not needed, handled by props.handleMainMenuAction()
            
            return false
        }

        
        // Handle Enter key for open dialogs
        else if (
            (props.keyPress === 'Enter') &&
            (props.modalStatus === true && props.menuBarActive === false && props.inventoryVisable === false)) {
                return props.hideModal(props.keyPress)
        }


        // Handle Enter key for text submission
        else if(
            (props.keyPress === 'Enter') &&
            (props.modalStatus === false && props.menuBarActive === false && props.inventoryVisable === false)){
            return console.log('submit enter')
        }


        // Handle letters, spaces, backspaces
        else if(
            (keysForTypingInput.includes(props.keyPress) === true || props.keyPress === ' ' || props.keyPress === 'Backspace') &&
            (props.roomTitleScreen === false && props.modalStatus === false && props.menuBarActive === false && props.inventoryVisable === false)){

            return props.textParserChange(props.keyPress)
        }



        // Any other keypress is ignored here!
        else {
            return false
        }




    }, [props.keyPress, props.keyRefresh])

    return null

};


export default KeyboardControls;
