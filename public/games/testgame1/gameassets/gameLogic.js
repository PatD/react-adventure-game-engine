console.log('Custom game logic file is loaded')
window.gameLogic = {



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