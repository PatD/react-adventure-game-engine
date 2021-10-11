// Handles Main Navigation menu item clicks.

const mainNavFunctions = {

    // test: function(currentState,action){
    //     console.log(currentState)
    //     console.log(action)
    // },

    // Takes passed menu item name and routes it to the right function
    route: function (currentState, action) {

        if (action === 'About') {
            return {
                modalClickToClose:false,
                modalStatus: "modal display-block",
                modalText:currentState.title + ": " + currentState.subTitle,
                modalTextSlot2: currentState.description,
            }
        }
        else if (action === 'Help') {
            this.help(currentState);
        }
        else if (action === 'Restart') {
            this.restart(currentState);
        }
        else if (action === 'Swap Game') {
            this.swapGame(currentState);
        }
        else {
            // Game is currently paused, so on error unpause the game:
            currentState.setcurrentState({ pausedgame: false })
        }

    },



    // Shows the "About this game" modal dialog box.
    // This should come from the game's own gamedata.json file
    about: function () {
        return {
            modalStatus: "modal display-block",
            modalText: "About!",
        }
    },

    help: function(currentState){
        return currentState.setcurrentState({
            modalStatus: "modal display-block",
            modalText: "Use the arrow keys to move your hero around the screen.",
            modalTextSlot2: "Use the Tab key to open your inventory.",
            modalTextSlot3: "Explore and type commands like 'look room' or 'get taco' or 'talk to dragon' to advance the game!",
        })
    },

    restart: function(currentState){
        currentState.setcurrentState({
            modalStatus: "modal display-block",
            modalText: "Restart the game? All unsaved progress will be lost forever.",
            modalButtonText1:"Restart",
            modalButtonText2:"Cancel"
        })
    },

    swapGame: function(currentState){
        currentState.setcurrentState({
            modalClickToClose:false,
            modalStatus: "modal display-block",
            modalText: "Select from any of these games in your /games directory. Any unsaved progress in this current game will be lost.",
            modalTextSlot2: "Remember that the game must have a valid gamedata.json file, and be listed in the gamelist.json listing.",
            modalButtonText1:"Load",
            modalButtonText2:"Cancel"
        })
    }
}

export default mainNavFunctions;
