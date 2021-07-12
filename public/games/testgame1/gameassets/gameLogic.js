console.info('Custom Game Logic File Loaded!')

/*
    Each gameLogic.js file should have a roomChange() function
    It acts as a routing tool.  Player enters a room, the room
    checks itself to see if there's a custom function associated
    with it, and that function fires if it does.

    Expects the new room and current state to be passed to it.
*/
function roomChange(roomNumber,state) {
    if(roomNumber !== "undefined"){ // <-- This check is here because React fires this on load, and sometimes state isn't ready yet

        switch (roomNumber){
            case 2:{
                return roomChangetwo(roomNumber, state)
            }
            case 3:{
                return roomChangeThree(state)
            }

            // Not every room change needs a custom function:
            default:{
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
function customTextParser(textForParsing,props){
    console.log(textForParsing)
    console.log(props)


    switch (textForParsing.join(' ')){
        case 'derp dance':
        case 'dance dance':{
            return console.log('Dance x2@')
        }
        case 'eat taco':{
            return customEatTaco(props)
        }

        // Not every text parse change needs a custom function:
        default:{
            // ... so customTextParser() returns false and the built-in text parser runs
            return false
        }
    }
}







/*  Custom room change functions */

// This is a custom function example, just for this game.  The switch statement in roomChange() summons it.
function roomChangetwo(roomNumber, state) {
    console.log("We're in a new room,  " + roomNumber)
}


// This is a custom function example that checks if an item (the taco) is in 
// player inventory and returns a message.
function roomChangeThree(state) {
    console.log("Custom event for ROOM 3")

    // Since state is passsed to this function, 
    // we can see if the player has the inventory item in their posession
    const hasTacoYet = state.inventory.find( ({ Name }) => Name === 'Taco')
    
    // If they have the taco, and we haven't shown this message to them yet, 
    // return an update to state that opens the message modal
    if(hasTacoYet.owned === true && state.flags.hasTacoMessageShown === false){     
        
        // We'll be updating our flags object in state, by 
        // setting hasTacoMessageShown to true
        const stateFlags = state.flags;
        stateFlags.hasTacoMessageShown = true;

        // roomChange() - which calls all custom room functions -returns an array of objects
        return  [
        // First item is a number. The delay in ms before state change.
            2000,

        // Second item is always state updates      
            {
                flags:stateFlags,
                modalClickToClose:true,
                modalText: "As the player returns to the room, he finds the TACO has gone missing!",
                modalTextSlot2: "Upon checking his own pockets, he finds the taco there, safe and sound. Of course, he now some real regret about having a pocket-taco.",
                modalStatus: "modal display-block",
                pausedgame:true,
            },
          
        // Third item is whether to stop the player or not use haltHero() [Optional]
            "halt" 
        ]
    } else{
        return
    }
    
}


/* Custom text parser functions */

function customEatTaco(props) {

    return [
        // First item is a number. The delay in ms before state change.
        0,

        // Second item is always state updates      
        {
            modalClickToClose: true,
            modalText: "You decide to eat the taco, the smell was too delicous.",
            modalStatus: "modal display-block",
            pausedgame: true,
        },

        // Third item is whether to stop the player or not use haltHero() [Optional]
        "halt",


        {
            customFunc: function(){
                alert('hi')
            }
        }

    ]
}
