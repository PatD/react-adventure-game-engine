console.info('Custom Game Logic File Loaded!')

/*
    Each gameLogic.js file should have a roomChange() function
    It acts as a routing tool.  Player enters a room, the room
    checks itself to see if there's a custom function associated
    with it, and that function fires if it does.

    Expects the new room and current state to be passed to it.
*/
function roomChange(roomNumber, state) {
    console.log(roomNumber)
    if (roomNumber !== "undefined") { // <-- This check is here because React fires this on load, and sometimes state isn't ready yet

        switch (roomNumber) {
            /*
            // Examples
            case 2: {
                return roomChangetwo(roomNumber, state)
            }
            
            case 3: {
                return roomChangeThree(state)
            }
            */
            // Not every room change needs a custom function:
            default: {
                // ... so roomChange() quietly ends
                return console.log('No custom room change for ' + roomNumber);
            }
        }
    }
}


// Each gameLogic.js file should have a customTextParser() function
// That accepts text input and the props from screen.js

// Handles custom text input from text parser. Expects props to be passed to it.   
// All commands are routed through here for matching
// And either an updated state is returned, or a way to 
// run the built-in commands like look or get
function customTextParser(textForParsing, props) {

    console.log('Command passing through gameLogic.js')

    switch (textForParsing.join(' ')) {

        /* 
        // Examples:

        case 'party':{
            return customParty(props)
        }
        case 'get taco':
        case 'take taco': {
            return customGetTaco(props)
        }
        case 'dance':
        case 'dance dance': {
            return justDance(props)
        }
        case 'eat taco': {
            return customEatTaco(props)
        }
        */

        // Not every text parse change needs a custom function:
        default: {
            // ... so customTextParser() returns false and the built-in text parser runs
            // console.log('No match in gamelogic.js, so passing back to run through game engine commands')
            return false
        }
    }
}
