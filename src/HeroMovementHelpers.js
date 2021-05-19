// Handles Main Navigation menu item clicks.

const heroMovement = {

    handleHeroMovement:function(keypress, passedThis) {
    
        // Don't move the hero if the game is paused
        if (passedThis.state.pausedgame === false) {
          // this.updateDebugger(keypress);
    
          // If hero is moving and a different movement direction is picked
          if (passedThis.state.heroMoving === "moving" && passedThis.state.heroDirection !== keypress) {
            // Change hero direction and keep hero moving
            passedThis.setState({ heroDirection: keypress, heroMoving: "moving" });
            passedThis.handleHeroPositioning("stop") // stop first
            passedThis.handleHeroPositioning(keypress) // then go
          }
          // If they're moving and they hit the same direciton key, stop them
          else if (passedThis.state.heroMoving === "moving" && passedThis.state.heroDirection === keypress) {
            passedThis.haltHero();
          }
          // Otherwise, let the hero walk
          else {
            passedThis.handleHeroPositioning(keypress)
            passedThis.setState({ heroDirection: keypress, heroMoving: "moving" });
          }
        }
      },
//     // Takes passed menu item name and routes it to the right function
//     route: function (passedThis, passedMenuItem) {

//         if (passedMenuItem === 'About') {
//             this.about(passedThis);
//         }
//         else if (passedMenuItem === 'Help') {
//             this.help(passedThis);
//         }
//         else if (passedMenuItem === 'Restart') {
//             this.restart(passedThis);
//         }
//         else if (passedMenuItem === 'Swap Game') {
//             this.swapGame(passedThis);
//         }
//         else {
//             // Game is currently paused, so on error unpause the game:
//             passedThis.setState({ pausedgame: false })
//         }

//     },



//     // Shows the "About this game" modal dialog box.
//     // This should come from the game's own gamedata.json file
//     about: function (passedThis) {
//         return passedThis.setState({
//             modalStatus: "modal display-block",
//             modalText: passedThis.state.title,
//             modalTextSlot2: passedThis.state.subTitle,
//             modalTextSlot3: passedThis.state.description,
//             modalTextSlot4: "Released in " + passedThis.state.copyright + ".",
//         })
//     },

//     help: function(passedThis){
//         return passedThis.setState({
//             modalStatus: "modal display-block",
//             modalText: "Use the arrow keys to move your hero around the screen.",
//             modalTextSlot2: "Use the Tab key to open your inventory.",
//             modalTextSlot3: "Explore and type commands like 'look room' or 'get taco' or 'talk to dragon' to advance the game!",
//         })
//     },

//     restart: function(passedThis){
//         passedThis.setState({
//             modalStatus: "modal display-block",
//             modalText: "Restart the game? All unsaved progress will be lost forever.",
//             modalButtonText1:"Restart",
//             modalButtonText2:"Cancel"
//         })
//     },

//     swapGame: function(passedThis){
//         passedThis.setState({
//             modalClickToClose:false,
//             modalStatus: "modal display-block",
//             modalText: "Select from any of these games in your /games directory. Any unsaved progress in this current game will be lost.",
//             modalTextSlot2: "Remember that the game must have a valid gamedata.json file, and be listed in the gamelist.json listing.",
//             modalButtonText1:"Load",
//             modalButtonText2:"Cancel"
//         })
//     }
}

export default heroMovement;