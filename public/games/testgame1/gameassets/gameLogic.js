console.log('Custom game logic file is loaded')
window.gameLogic = {



    // Check for custom verbs, and take action.
        // Usually this is updating flags and returning text as modal  

        // Loop through text for parsing array.  assume first word is verb
    handleCustomVerbs(textforparsing, props){
        console.log(textforparsing)
        console.log(props)
        props.handleFlagChange(2)
        return props.handleSubmittedTextModal("You attempt to " + textforparsing[0] + ".")
    }


    // Check for custom actions for in-game-verbs (look, get, etc)
        // The game engine supports looking at inventory items, room objects, but you may need something beyond that

        // 

    
}