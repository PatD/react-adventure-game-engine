console.log('hi')
window.gameLogic = {

    test(props){
        console.log('Game file')
        return props.handleSubmittedTextModal("COMMAND from gamelogic.js")
    },

    checkThing(thing){
        if(thing){
            return true
        } else{
            return false
        }
    }
    
}