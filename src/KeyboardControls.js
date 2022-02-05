// import React from 'react';
import React from 'react';


// Act as a relay for all keyboard presses in the game.

/* Consider this needs to support:

    1. Hero movement
    2. Inventory screen (tab)
    3. Text parser
    4. Main menu arrows/selctions
    5. Dialog box confirmation
    6. Escape for dialog box, menu
    7. "Any key" to close menu
*/


const KeyboardControls = (props) => {

    React.useEffect(() => {

        // Handles user pressing any key while inventory is open
        if (props.inventoryVisable === true && props.roomTitleScreen === false && props.menuBarActive === false){
            return props.toggleInventoryScreen()
        }

        // Handle user hitting enter at the title screen, starts the game
        else if (props.keyPress === 'Enter' && (props.heroAlive === false && props.roomTitleScreen === true && props.modalStatus === false && props.menuBarActive === false)) {
            console.log('User has hit enter on the title screen')

            if (props.gameStartRoomNumber !== undefined) {
                // This lets the developer specify the starting room number in gamedata.json
                return props.loadRoom(props.gameStartRoomNumber)
            } else {
                // But if they dont't specify, Room #2 is loaded for safety
                return props.loadRoom(2)
            }
        }

        // This opens the inventory screen
        else if (props.keyPress === 'Tab' && (props.inventoryVisable === false && props.roomTitleScreen === false && props.modalStatus === false && props.menuBarActive === false)) {
            return props.toggleInventoryScreen()
        }

        // Handle Escape key to close modal dialog box
        else if (props.keyPress === "Escape" && props.inventoryVisable === false && props.modalStatus === true) {
            return props.hideModal()
        }

        // Handle Escape key to toggle main menu
        else if (props.keyPress === "Escape" && props.inventoryVisable === false && props.modalStatus === false) {
            return props.toggleMainMenu()
        }
        
        // Hero movement - Handle arrow keys
        else if (
            (props.menuBarActive === false && props.heroAlive === true && props.roomTitleScreen === false && props.inventoryVisable === false && props.pausedgame === false) &&
            (props.keyPress === 'ArrowDown' || props.keyPress === 'ArrowUp' || props.keyPress === 'ArrowLeft' || props.keyPress === 'ArrowRight')) {
            return props.handleHeroMovement(props.keyPress)
        }
    
        // Main menu - Handle arrow keys
        else if (props.menuBarActive === true && props.inventoryVisable === false && (props.keyPress === 'ArrowDown' || props.keyPress === 'ArrowUp' || props.keyPress === 'ArrowLeft' || props.keyPress === 'ArrowRight')){
            // console.log(props.keyPress + " from KeyboardControls.js")
            return props.handleMainMenuKeyPress(props.keyPress)
        }

        /*
        // Handle Enter key for selection
        else if ((this.props.menuBarActive === true && this.state.mainNavMenuVisibility === "active") &&
            (props.keyPress === 'Enter')) {

            // Is the current menu item disabled?
            const selectedDisabled = this.state.subNavActiveItems.find(o => o.name === this.state.subNavSelectedItem)


            if (this.props.heroAlive === false && (selectedDisabled.active !== true || selectedDisabledTitleScreen.titleDisabled === true )) {
            event.preventDefault()
            return false
            }

            else return [

            // Prevent the default action for the enter key (in this case, sumbitting the text parser or closing the modal)
            event.preventDefault(),

            // Take whatever action is selected
            this.props.handleMainMenuAction(this.state.subNavSelectedItem)
            ]
        }

        */







        // Any other keypress is ignored here!
        else {
            return false
        }




    }, [props.keyPress, props.keyRefresh])

    return null


    // const [keyPressed, setKeyPressState] = useState("")


    // useEffect(() => {
    //     document.addEventListener('keydown', (e) => {  
    //         e.preventDefault();
    //         setKeyPressState(e.key)
    //         // keyGauntlet(e)
    //         // if (e.code === 'Enter') {
    //         //     console.log('fire!')
    //         // }  
    //     })
    // },[])

    // const oldprops = useRef(props)

    // console.log(oldprops.current)
    // console.log(props)
    // console.log(keyPressed)

    // if(Object.is(oldprops.current,props) === false){
    //     console.log(keyPressed)

    //     if ((props.heroAlive === false && props.roomTitleScreen === true && props.modalStatus === false && props.menuBarActive === false) && keyPressed === 'Enter') {
    //         console.log('User has hit enter on the title screen')

    //         if (props.gameStartRoomNumber !== undefined) {
    //             // This lets the developer specify the starting room number in gamedata.json
    //             return props.loadRoom(props.gameStartRoomNumber)
    //         } else {
    //             // But if they dont't specify, Room #2 is loaded for safety
    //             return props.loadRoom(2)
    //         }
    //     }


    // }





};


export default KeyboardControls;






/*
    const keyGauntlet = () => {
        console.log(props)

        // Handles user pressing any key while inventory is open
        if (props.inventoryVisable === true) {
            return props.toggleInventoryScreen()
        }

        // Handle user hitting enter at the title screen, starts the game
        else if ((props.heroAlive === false && props.roomTitleScreen === true && props.modalStatus === false && props.menuBarActive === false) && keyPressed === 'Enter') {
            console.log('User has hit enter on the title screen')

            if (props.gameStartRoomNumber !== undefined) {
                // This lets the developer specify the starting room number in gamedata.json
                return props.loadRoom(props.gameStartRoomNumber)
            } else {
                // But if they dont't specify, Room #2 is loaded for safety
                return props.loadRoom(2)
            }
        }

       // This opens the inventory screen
       else if (keyPressed === 'Tab' 
        && (props.inventoryVisable === false && props.modalStatus === false && props.menuBarActive === false)
       
       ) {
            // return props.toggleInventoryScreen()
            // console.log(props.toggleInventoryScreen())
            // return props.toggleInventoryScreen()
        }

    }



    const [keyPressed, setKeyPressState] = useState("")
*/


/*
const KeyboardControls = (props) => {

    const [keyPressed, setKeyPressState] = useState("")



    // useEffect is used to prevent component from constantly readding event listners
    // to the page. We only want it to run once when component is mounted.
    useEffect(() => {
        // window.addEventListener('keydown', (event) => {
        //     // The keypress is stored in this component's state:
        //     setKeyPressState(keyPress)
        //     // console.log(props)
        //     keyGauntlet()
        // })

        window.addEventListener('keydown', (event) =>  {
            setKeyPressState(event)
            // handleUserKeyPress(event);
        });

        return () => {
            window.removeEventListener('keydown');
          };
    }, []);

    // This fires at every re-render
    // keyGauntlet(props)
    console.log(props)
    handleUserKeyPress(keyPressed)

    return null
};




const handleUserKeyPress = (event,props) => {

    const { key, keyCode } = event;
    console.log(props)
    console.log(key, keyCode)

    // Handles user pressing any key while inventory is open
    if (props.inventoryVisable === true) {
        return props.toggleInventoryScreen()
    }

    // Handle user hitting enter at the title screen, starts the game
    else if (key === 'Enter') {
        console.log('User has hit enter on the title screen')

        if (props.gameStartRoomNumber !== undefined) {
            // This lets the developer specify the starting room number in gamedata.json
            return props.loadRoom(props.gameStartRoomNumber)
        } else {
            // But if they dont't specify, Room #2 is loaded for safety
            return props.loadRoom(2)
        }
    }
};

export default KeyboardControls;

*/