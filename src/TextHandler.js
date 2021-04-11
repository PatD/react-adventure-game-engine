// Handles text commands!

const TextHandlerFunctions = {

    // Convert entered text into an Array of seperate words
    sendTextCommand:function(text,passedState){
       
        console.log(text)
        console.log(passedState)
        const wordArray = text.split(/\s+/);
       
        this.verbRouter(wordArray,passedState);
    },

    // Takes passed menu item name and routes it to the right function
    verbRouter: function (wordArray,passedState) {
        console.log(wordArray)

        // Assume these verbs are in most games.  Additional support provided from customVerbs in gamedata.json

        //  "help","push","pull","eat","turn","inventory","look","open","examine","close","inventory","save","restart","restore","inspect","get","pick","drop","talk","read"

        if(wordArray.includes('look')){
            this.look(wordArray,passedState)
        } else if(wordArray.includes('help')){
            this.help(passedState)
        } else if (wordArray.includes('push')){
            this.push(passedState)
        } else{
            return console.log('wut')
        }


    },

    look:function(wordArray,passedState){
        console.log(passedState)
        return 
    }

/*

   // Shows the "About this game" modal dialog box.
    // This should come from the game's own gamedata.json file
   logText: function (text) {
     return console.log(text)
   },

    about: function (passedThis) {
        return passedThis.setState({
            modalStatus: "modal display-block",
            modalText: passedThis.state.title,
            modalTextSlot2: passedThis.state.subTitle,
            modalTextSlot3: passedThis.state.description,
            modalTextSlot4: "Released in " + passedThis.state.copyright + ".",
        })
    },

    help: function(passedThis){
        return passedThis.setState({
            modalStatus: "modal display-block",
            modalText: "Use the arrow keys to move your hero around the screen.",
            modalTextSlot2: "Use the Tab key to open your inventory.",
            modalTextSlot3: "Explore and type commands like 'look room' or 'get taco' or 'talk to dragon' to advance the game!",
        })
    },

    restart: function(passedThis){
        passedThis.setState({
            modalStatus: "modal display-block",
            modalText: "Restart the game? All unsaved progress will be lost forever.",
            modalButtonText1:"Restart",
            modalButtonText2:"Cancel"
        })
    },

    swapGame: function(passedThis){
        passedThis.setState({
            modalClickToClose:false,
            modalStatus: "modal display-block",
            modalText: "Select from any of these games in your /games directory. Any unsaved progress in this current game will be lost.",
            modalTextSlot2: "Remember that the game must have a valid gamedata.json file, and be listed in the gamelist.json listing.",
            modalButtonText1:"Load",
            modalButtonText2:"Cancel"
        })
    }
    */
}

export default TextHandlerFunctions;