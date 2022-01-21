// import React from 'react';
import React, { useState } from 'react';

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

    const keyGauntlet = (props) =>{
        console.log(props, keyPressed)

        if (props.inventoryVisable === true) {
            return [
               console.log('We should close the inventory'),
            ]
        }

        else if ((props.heroAlive === false && props.roomTitleScreen === true && props.modalStatus === false && props.menuBarActive === false) && keyPressed === 'Enter'){
            console.log('User has hit enter on the title screen')
            props.testFunc()
            /*
            if(this.state.gameStartRoomNumber !== undefined){
              // This lets the developer specify the starting room number in gamedata.json
              this.loadRoom(this.state.gameStartRoomNumber)
            } else {
              // But if they dont't specify, Room #2 is loaded for safety
              this.loadRoom(2)
            }
    
            return this.setState({
              heroAlive:true
            })
            */
    
        }


    }



    const [keyPressed, setKeyPressState] = useState("")

        // // "Any key" can close the inventory screen, we start with that
        // if (props.inventoryVisable === true) {
        //     return [
        //         props.toggleInventoryScreen()
        //     ]
        // }
   
    // useEffect is used to prevent component from constantly readding event listners
    // to the page. We only want it to run once when component is mounted.
    React.useEffect(() => {
        window.addEventListener('keydown', (event) => {
            // The keypress is stored in this component's state:
            setKeyPressState(event.key)            
        });
      }, []);

    // This fires at every re-render
    keyGauntlet(props)

  return null
};

export default KeyboardControls;