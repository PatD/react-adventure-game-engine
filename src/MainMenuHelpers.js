// Handles Main Navigation menu item clicks.

const mainNavFunctions = {

    // Takes passed menu item name and routes it to the right function
    route: function (passedThis, passedMenuItem) {

        if (passedMenuItem === 'About') {
            this.about(passedThis);
        }
        else {
            // Game is currently paused, so on error unpause the game:
            passedThis.setState({ pausedgame: false })
        }

    },



    // Shows the "About this game" modal dialog box.
    // This should come from the game's own gamedata.json file
    about: function (passedThis) {
        return passedThis.setState({
            modalStatus: "modal display-block",
            modalText: passedThis.state.title,
            modalTextSlot2: passedThis.state.subTitle,
            modalTextSlot3: passedThis.state.description,
            modalTextSlot4: "Released in " + passedThis.state.copyright + ".",
        })
    },




}

export default mainNavFunctions;