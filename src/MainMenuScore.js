import React from 'react';

const MainMenuScore = (props) => {
  return (
    <span className='scoreStatus'>Score: {props.currentScore} of {props.highScore}</span>
  )
};

export default React.memo(MainMenuScore)
