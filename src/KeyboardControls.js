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

    // useEffect is used to prevent component from constantly readding event listners
    // to the page. We only want it to run once when component is mounted.
    React.useEffect(() => {
        window.addEventListener('keydown', (event) => {
          console.log(event.key)
          console.log(props)
        });
      }, []);


    // this fires at every re-render
    // console.log(props)

  return null
};

export default React.memo(KeyboardControls);