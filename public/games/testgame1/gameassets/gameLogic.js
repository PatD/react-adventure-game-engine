console.info('✓ Custom gameLogic.js file loaded!')


/*
    Each gameLogic.js file should have a roomChange() function
    that acts as a routing tool. Player enters a room, the room
    checks itself to see if there's a custom function associated
    with it, and that function fires if it does.

    Expects the new room number and current state to be passed to it.
*/
function roomChange(roomNumber, state) {
    console.log("Gamelogic.js detects new room: " + roomNumber)
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
// That accepts text input and props

// All commands are routed through here for matching
// and either an updated state is returned to app.js, or the command
// is sent back to the app for matching with built in verbs like look or get.

function customTextParser(textForParsing, props) {
    // console.log(textForParsing)
    // console.log(props)
    console.log('Text input passing through gameLogic.js, looking for match.')

    switch (textForParsing.join(' ')) {
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
        case 'talk sarah': {
            return customTalkSarah(props)
        }
        case 'talk ted': {
            return customTalkTed(props)
        }
        case 'open airlock':{
            return customOpenAirlock(props)
        }

        // Not every text parse change needs a custom function:
        default: {
            // ... so customTextParser() returns false and the built-in text parser runs
            console.log('No match found in gamelogic.js. Passing text input back to run through game engine built-in commands')
            return false
        }
    }
}







/*  These are custom room change functions, called by roomChange()  */
 function roomChangetwo(roomNumber) {
    // Use roomnumber check to clearinterval
    checkForDoomPit = () => {
        if(window.gameState.roomNearbyDisplayObjects.includes('doom vortex') === true){
            console.log('Doom checker true')
            clearInterval(doomPitInterval)

            // Global state update:
            return window.gameLogicReturn = {
                    // How long to wait before starting, in ms
                    "delay": 0, 
                    "scoreChange": 9,
                    "flagSet": {
                        "diedByPortal": true,
                    },
                    // Remove 
                    //"removeItems":["Taco","Wallet"],

                    // Halt
                    "halt": true,


                    // Array of state changegs
                    "newState": [{
                        modalClickToClose: true,
                        modalTextScript: [
                            {
                                modalText: "You fall into the doom portal, and unfortunatly that's a one way trip.",
                            },
                            {
                                modalText: "Thank you for playing " + window.gameState.title,
                            },
                            {
                                modalText: "Game over. You can RESTART or LOAD a saved game.",
                            }
                        ],
                        modalStatus: true,
                        pausedgame: true,
                        heroAlive: false
                        
                    }
                    ]
                }   
        }    
    }
    let doomPitInterval = setInterval(checkForDoomPit, 100);
    
    
    
    // if(window.gameState.roomNearbyDisplayObjects.includes('doom vortex') === true){
    //     return console.log('room')
    // }




    // function waitForCondition(conditionObj) {
    //     return new Promise(resolve => {
    //       var start_time = Date.now();
          
    //       function checkFlag() {
    //         if (conditionObj.arg == conditionObj.test) {
    //           console.log('met');

    //           return {
    //             // How long to wait before starting, in ms
    //             "delay": 0, 
    //             "scoreChange": 9,
    //             "flagSet": {
    //                 "diedByPortal": true,
    //             },
    //             // Remove 
    //             //"removeItems":["Taco","Wallet"],
    
    //             // Halt
    //             "halt": true,
    
    //             // Array of state changegs
    //             "newState": [{
    //                 modalClickToClose: true,
    //                 modalText: "You are sucked into the portal of doom!",
    //                 modalTextSlot2: "GAME OVER!",
    //                 modalStatus: true,
    //                 pausedgame: true,
    //                 heroAlive:false
    //             }]
    //         }  

    //           resolve();
    //         } else if (Date.now() > start_time + 3000) {
    //           console.log('not met, time out');
    //           resolve();
    //         } else {
    //           return window.setTimeout(checkFlag, 1000); 
    //         }
    //       }
    //       return checkFlag();
    //     });
    //   }
      
    //   async function run() {
    //     console.log('before');
    //     return await waitForCondition({arg: '1', test: '1'})
    //     console.log('after');
        
    //   }
    //   return run();

/*

    let heroHit = false;

    const checkForDoomPit = () => {
        if(window.gameState.roomNearbyDisplayObjects.includes('doom vortex') === true){
            clearInterval(doomPitInterval)
            heroHit = true
            console.log('hit!')
            return {
                // How long to wait before starting, in ms
                "delay": 0, 
                "scoreChange": 9,
                "flagSet": {
                    "diedByPortal": true,
                },
                // Remove 
                //"removeItems":["Taco","Wallet"],
    
                // Halt
                "halt": true,
    
                // Array of state changegs
                "newState": [{
                    modalClickToClose: true,
                    modalText: "You are sucked into the portal of doom!",
                    modalTextSlot2: "GAME OVER!",
                    modalStatus: true,
                    pausedgame: true,
                    heroAlive:false
                }]
            }  
        }
    }
    return doomPitInterval = setInterval(checkForDoomPit, 100);



    const returnStateUpdate = () =>{
        console.log('hi')
        return {
            // How long to wait before starting, in ms
            "delay": 0, 
            "scoreChange": 9,
            "flagSet": {
                "diedByPortal": true,
            },
            // Remove 
            //"removeItems":["Taco","Wallet"],

            // Halt
            "halt": true,

            // Array of state changegs
            "newState": [{
                modalClickToClose: true,
                modalText: "You are sucked into the portal of doom!",
                modalTextSlot2: "GAME OVER!",
                modalStatus: true,
                pausedgame: true,
                heroAlive:false
            }]
        }  
    }



    // Check for the player's proximity to an object, and take action

    // const checkForDoomPit = () =>{
    //    return new Promise((resolve, reject) => {
    //         if(window.gameState.roomNearbyDisplayObjects.includes('doom vortex') === true){
    //             clearInterval(doomPitInterval)
    //             resolve('my dude') 
    //         }
    //     })
    //     .then((res) => {
    //         return returnStateUpdate()})
    //     .catch((err) => clearInterval(doomPitInterval))
    // }


    // doomPitInterval = setInterval(checkForDoomPit, 100);
    

    //  checkForDoomPit = () => {
    //     if(window.gameState.roomNearbyDisplayObjects.includes('doom vortex') === true){
    //         console.log('Doom checker true')
    //         clearInterval(doomPitInterval)
    //             return {
    //                 // How long to wait before starting, in ms
    //                 "delay": 0, 
    //                 "scoreChange": 9,
    //                 "flagSet": {
    //                     "diedByPortal": true,
    //                 },
    //                 // Remove 
    //                 //"removeItems":["Taco","Wallet"],

    //                 // Halt
    //                 "halt": true,

    //                 // Array of state changegs
    //                 "newState": [{
    //                     modalClickToClose: true,
    //                     modalText: "You are sucked into the portal of doom!",
    //                     modalTextSlot2: "GAME OVER!",
    //                     modalStatus: true,
    //                     pausedgame: true,
    //                     heroAlive:false
    //                 }]
    //             }   
    //     }    
    // }
    // let doomPitInterval = setInterval(checkForDoomPit, 100);



    // If there's a match, game-over the player
    // updateDeathpit = () =>{
    //     // console.log(window.gameState.heroPositionY)
       
    //     if((window.gameState.heroPositionY >= 320 && window.gameState.heroPositionY < 380) && 
    //     (window.gameState.heroPositionX >= 140 && window.gameState.heroPositionX < 200)){
    //         console.log('hit')

    //         return {
    //             // How long to wait before starting, in ms
    //             "delay": 0, 
    //             "scoreChange": 9,
    //             "flagSet": {
    //                 "diedByPortal": true,
    //             },
    //             // Remove 
    //             //"removeItems":["Taco","Wallet"],
    
    //             // Halt
    //             "halt": true,
    
    //             // Array of state changegs
    //             "newState": [{
    //                 modalClickToClose: true,
    //                 modalText: "You are sucked into the portal of doom!",
    //                 modalTextSlot2: "GAME OVER!",
    //                 modalStatus: true,
    //                 pausedgame: true,
    //                 heroAlive:false
    //             }]
    //         }
    //     } else{
    //         requestAnimationFrame(updateDeathpit)
    //     }

    // }

    // return requestAnimationFrame(updateDeathpit)
*/
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

        return {
            // How long to wait before starting, in ms
            "delay": 2000, 
            
            "scoreChange": 3,

            "flagSet": {
                "hasDanced": true,
                "bananaPhone": true,
                "missingTaco":true
            },

            // Halt
            "halt": true,

            // Array of state changegs
            "newState": [{
                modalClickToClose: true,
                modalText: "As the player returns to the room, he finds the TACO has gone missing!",
                modalTextSlot2: "Upon checking his own pockets, he finds the taco there, safe and sound. Of course, he now some real regret about having a pocket-taco.",
                modalStatus: true,
                pausedgame: true,
            }]
        }

    } else {
        return
    }

}

/* Custom text parser functions */
function customOpenAirlock(props) {
    console.log(props)
    if(props.roomCurrentName === 'Airlock'){
        return {
            "delay": 0, 
            "scoreChange": 9,
            "flagSet": {
                "airlockOpen": true,
            },
    
            // Halt
            "halt": true,
    
            // Array of state changegs
            "newState": [
                {
                    roomCurrentAltStyle: "airlockOpen",
                    statePause:500
                },
                
                {
                modalClickToClose: true,
                modalTextScript: [
                    {
                        modalText: "The airlock opens and you feel a slight breeze.",
                    },
                    {
                        modalText: "The hum of the machines gets a lot quieter without air in the room to help transfer the sound.",
                    },
                ],
                modalWidth: 500,
                modalTop: 450,
                modalStatus: true,
                pausedgame: true,
            },
            {
                statePause:5000
            },
            ]
        }
    } else {
        return {
            "newState": [
                {
                modalClickToClose: true,
                modalText: "You need to be closer to an airlock to open it.",
                modalStatus: true,
                pausedgame: true,
            }
        ]
    }
}
}






function customParty(props) {
    return {
        "delay": 2, 
        "scoreChange": 34,
        "flagSet": {
            "partyAlltheTime": true,
        },

        // Halt
        "halt": true,

        // Array of state changegs
        "newState": [
            {
                roomCurrentAltStyle: "partyrock",
                statePause:50
            },
            
            {
            modalClickToClose: true,
            modalTextScript: [
                {
                    modalText: "Party rock is in the house TONIGHT",
                    modalWidth: 600,
                    modalTop: 100
                },
                {
                    modalText: "Everybody just have a good time",
                    modalWidth: 300,
                    modalTop: 200,
                }
            ],
            modalStatus: true,
            pausedgame: true,
        },
        {
            roomCurrentAltStyle: " ",
            statePause:5000
        },
        ]
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

    // Example of a custom command that also checks and sets a flag

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
                heroDirection:"ArrowDown"
            },
            {
                heroPositionX: props.heroPositionX - 5,
                heroPositionY: props.heroPositionY - 5,
                heroDirection:"ArrowUp",
                statePause:500
            },
            {
                heroPositionX: props.heroPositionX + 15,
                heroPositionY: props.heroPositionY + 15,
                heroDirection:"ArrowRight",
                statePause:500
            },
            {
                heroPositionX: props.heroPositionX + 25,
                heroPositionY: props.heroPositionY + 25,
                heroDirection:"ArrowLeft",
                statePause:500
            },
            {
                heroPositionX: props.heroPositionX - 5,
                heroPositionY: props.heroPositionY - 5,
                heroDirection:"ArrowUp",
                statePause:500
            },
            {
                heroPositionX: props.heroPositionX + 15,
                heroPositionY: props.heroPositionY + 15,
                heroDirection:"ArrowRight",
                statePause:500
            },
            {
                heroPositionX: props.heroPositionX + 25,
                heroPositionY: props.heroPositionY + 25,
                heroDirection:"ArrowLeft",
                statePause:500
            },
        ],

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

    if (hasTaco.owned === false && props.flags.tacoEaten === undefined) {
        return {
            "halt": true,
            "newState": [{
                modalClickToClose: true,
                modalText: "You would love a taco right now, but you don't have it.",
                modalStatus: true,
                pausedgame: true,
            }]
        }

    } else if(hasTaco.owned === false && props.flags.tacoEaten === true && hasTaco.available === false){
        return {
            "halt": true,
            "newState": [{
                modalClickToClose: true,
                modalText: "YOU ALREADY ATE IT",
                modalStatus: true,
                pausedgame: true,
            }]
        }
    } else {
        // should this return an array of arrays that get looped through, to simulate state change?
       
        console.log(props.inventory.find(p => p.Name === "Taco"))
       
        return {
            // How long to wait before starting, in ms
            "delay": 0, 
            "scoreChange": 1,
            "flagSet": {
                "tacoEaten": true,
            },
            // Remove 
            "removeItems":["Taco","Wallet"],

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
    const tacoHas = props.inventory.find(t => t.Name === "Taco")

    // If the player doesn't have the taco, use the game-engine taco message
    if (tacoHas.owned === false || props.flags.hasSeenTacoMessage === true) {
        return false
    } else {
        // If they already have the taco, one time show them a silly message
        return {
            "delay": 0, 
            "scoreChange": 4,
            "flagSet": {
                "hasSeenTacoMessage": true,
            },

            // Halt
            "halt": true,

            // Array of state changegs
            "newState": [{
                modalClickToClose: true,
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
                ],
                modalStatus: true,
                pausedgame: true,
            }],
            }        
    }
}