import React from 'react';

const MainMenuSound = (props) => {
  return(
    <span onClick={props.toggleSound} className='soundStatus'>Sound:{props.soundOn}</span>
  )
};

export default React.memo(MainMenuSound)
