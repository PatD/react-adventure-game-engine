console.info('Custom Game Logic File Loaded!')

/*
    Each gameLogic.js file should have a roomChange() function
    It acts as a routing tool.  Player enters a room, the room
    checks itself to see if there's a custom function associated
    with it, and that function fires if it does.

    Expects the new room and current state to be passed to it.
*/
function roomChange(roomNumber, state) {
    if (roomNumber !== "undefined") { // <-- This check is here because React fires this on load, and sometimes state isn't ready yet

        switch (roomNumber) {
            case 2: {
                return roomChangetwo(roomNumber, state)
            }
            case 3: {
                return roomChangeThree(state)
            }

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
    // console.log(textForParsing)
    // console.log(props)
    console.log('Command passing through gameLogic.js')

    switch (textForParsing.join(' ')) {
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
        case 'talk sarah': {
            return customTalkSarah(props)
        }
        case 'talk ted': {
            return customTalkTed(props)
        }

        // Not every text parse change needs a custom function:
        default: {
            // ... so customTextParser() returns false and the built-in text parser runs
            console.log('No match in gamelogic.js, so passing back to run through game engine commands')
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
    const hasTacoYet = state.inventory.find(({ Name }) => Name === 'Taco')

    // If they have the taco, and we haven't shown this message to them yet, 
    // return an update to state that opens the message modal
    if (hasTacoYet.owned === true && state.flags.hasTacoMessageShown === false) {

        // We'll be updating our flags object in state, by 
        // setting hasTacoMessageShown to true
        const stateFlags = state.flags;
        stateFlags.hasTacoMessageShown = true;

        // roomChange() - which calls all custom room functions -returns an array of objects
        return [
            // First item is a number. The delay in ms before state change.
            2000,

            // Second item is always state updates      
            {
                flags: stateFlags,
                modalClickToClose: true,
                modalText: "As the player returns to the room, he finds the TACO has gone missing!",
                modalTextSlot2: "Upon checking his own pockets, he finds the taco there, safe and sound. Of course, he now some real regret about having a pocket-taco.",
                modalStatus: true,
                pausedgame: true,
            },

            // Third item is whether to stop the player or not use haltHero() [Optional]
            "halt"
        ]
    } else {
        return
    }

}


function customTalkTed(props) {
    return [
        0,
        true,
        {
            modalClickToClose: true,
            modalText: "Ted looks at you after you say hello, and then says he is quite busy playing 'Breath of the Wild' and doesn't have time to chat.",
            modalStatus: true,
            pausedgame: true,
        },

        {
            customFunc: function () {
                //getHelp()
            }
        }
    ]
}

/* Custom text parser functions */
function customTalkSarah(props) {
    return [
        0,
        true,
        {
            modalClickToClose: true,
            modalText: "Sarah tells you about Tom Nook, who is definitely not a racoon and instead a tanuki. Sarah waves and says have a fun time in your adventure.",
            modalStatus: true,
            pausedgame: true,
        },

        {
            customFunc: function () {
                //getHelp()
            }
        }
    ]
}

function justDance(props) {

    // Has the player danced already?
    if (props.flags.hasDanced !== true || props.flags.hasDanced === undefined) {
        return {
            // How long to wait before starting, in ms
            "delay": 0, 
            "stateChangeDelay":3000,
            "scoreChange": 3,
            "flagSet": {
                "hasDanced": true,
                "bananaPhone": true,
            },

            // Halt
            "halt": true,

            // Array of state changegs
            "newState": [{
                modalClickToClose: true,
                modalText: "You have been diagnosed with a fever.",
                modalTextSlot2: "DANCE FEVER!",
                modalStatus: true,
                pausedgame: true,
            },
            {
                modalTop:150
            }],

            "custFunc": function () {
                console.log("CUSTOM")
            }
        }

    } else {
        return {
            // Array of state changegs
            "newState": [{
                modalClickToClose: true,
                modalText: "Dancing once is sufficient, thank you very much",
                modalStatus: true,
                pausedgame: true,
            }]
        }
    }

}

function customEatTaco(props) {

    // Does the player have the item?
    const hasTaco = props.inventory.find(p => p.Name === "Taco");

    if (hasTaco.owned === false) {
        return {
            "newState": [{
                modalClickToClose: true,
                modalText: "You would love a taco right now, but you don't have it.",
                modalStatus: true,
                pausedgame: true,
            }]
        }
        
    } else {
        // should this return an array of arrays that get looped through, to simulate state change?
        return {
            // How long to wait before starting, in ms
            "delay": 0, 
            "scoreChange": 1,
            "flagSet": {
                "tacoEaten": true,
            },

            // Halt
            "halt": true,

            // Array of state changegs
            "newState": [{
                modalClickToClose: true,
                modalText: "You decide to eat the taco",
                modalTextSlot2: "It was DELICOUS!",
                modalStatus: true,
                pausedgame: true,
            }],

            "custFunc": function () {
                console.log("CUSTOM")
            }
        }

    }
}

function customGetTaco(props) {

    // Get the status of the taco

    // This tells us if the user is near the item in the game
    const tacoStatus = props.roomNearbyInventoryItems.indexOf('taco');
    const tacoHas = props.inventory.find(t => t.Name === "Taco")

    if (tacoHas.owned === false) {
        return false
    } else {
        return [
            // First item is a number. The delay in ms before state change.
            0,

            // Second item is a halt command. Repalce with false if player shouldn't halt
            true,

            // third item is always state updates      
            {
                modalTextScript: [
                    {
                        modalText: "Wait, you distinctly remember taking the taco before.",
                        modalWidth: 600,
                        modalTop: 100
                    },
                    {
                        modalText: "Why would you try to get it again?",
                        modalWidth: 300,
                        modalTop: 200,
                    },
                    {
                        modalText: "Burrito. You'd rather have a burrito",
                        modalWidth: 200,
                        modalTop: 350,
                    }
                ]
            },

            {
                customFunc: function () {
                    //getHelp()

                }
            }

        ]
    }
}