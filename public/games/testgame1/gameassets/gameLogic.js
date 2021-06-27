console.log('Custom Game Logic File Loaded!')


// Each gameLogic file should have a roomChange() function
// that accepts the number and the current state. 
function roomChange(roomNumber,state) {
    if(roomNumber !== "undefined"){

        // This switch statement routes based on your own logic.
        // Each custom function should return an array of objects, 
        // where the first object is whatever changes in state
        switch (roomNumber){
            case 2:{
                return roomChangetwo(roomNumber, state)
            }
            case 3:{
                return roomChangeThree(state)
            }
            // Not every room change needs a custom function:
            default:{
                return console.log('No custom room change for ' + roomNumber);
            }
        }
    }
}



// This is a custom function example, just for this game.  The switch statement in roomChange() summons it.
function roomChangetwo(roomNumber, state) {
    console.log("We're out of switch statement room " + roomNumber)
  //  return [{customRoomFunction:roomNumber}]
}


// This is a custom function example that checks if an item is in inventory and returns 
// a message.
function roomChangeThree(state) {
    console.log("Custom event for ROOM 3")

    // Since state is passsed, we can see if the player has the inventory item
    // in their posession
    const hasTacoYet = state.inventory.find( ({ Name }) => Name === 'Taco')
    
    // If they have it, return a message
    if(hasTacoYet.owned === true){        
        // roomChange() [which calls all custom room functions] returns an array of objects
        return  [
        // First object is always state updatess      
          {
            modalClickToClose:true,
            modalText: "As the player returns to the room, he finds the TACO has gone missing!",
            modalTextSlot2: "Upon checking his own pockets, he finds the taco there, safe and sound. Of course, he now some real regret about having a pocket-taco.",
            modalStatus: "modal display-block",
            pausedgame:true,
          },
          
          // Second item is whether to stop the player or not use haltHero() [Optional]
            "halt"
          ,
          // 3rd item is the delay [Optional]
          
            500
        ]
    } else{
        return
    }
    
}




function customGameCode(){
    console.log('hi from gamelogic.js')
}

// onmessage = function (e) {
    
//     const workerState = e.data;


//     console.log(workerState)

//     handleTextInput = () => {
//         // return console.log(workerState)
//     }

//      // Results are sent back to the React component:
//     postMessage("We return: " + work);
// }

/*
self.gameLogic = {

    handleGameTextParse(textforparsing, props, state){
        console.log(textforparsing)
        console.log(props)
        console.log("Custom game parse")


        if(props.roomCurrent === 3){
            return [
                console.log('we are in 3'),
                state(textforparsing)
            ]
        } else {
            return false
        }

    },


    // Check for custom verbs, and take action.
        // Usually this is updating flags and returning text as modal  

        // Loop through text for parsing array.  assume first word is verb
    handleCustomVerbs(textforparsing, props){
        console.log(textforparsing)
        console.log(props)
        
        if(textforparsing[0] === 'dance'){
            this.danceCustomVerb(textforparsing, props)
        }
        else {
            return props.handleSubmittedTextModal("You try and " + textforparsing[0] + " the " + textforparsing[1] + ", but nothing happens.")
        }
    },

    // This is custom per-game code that allows the character to dance
    // It's also an example of a flag getting set becuase of a player action
    danceCustomVerb(textforparsing, props){
        console.log('This updates the flag')
        props.handleFlagChange(3)
        return props.handleSubmittedTextModal("You attempt to dance " + textforparsing[1] + "ingly.")
    }

    // Check for custom actions for in-game-verbs (look, get, etc)
        // The game engine supports looking at inventory items, room objects, but you may need something beyond that

        // 

    
}
*/