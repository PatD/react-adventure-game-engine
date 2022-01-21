import React from 'react';

const Hero = (props) => {

  const heroStyle = {
    top: props.heroPositionX,
    left: props.heroPositionY,
    width: props.heroWidth,
    height: props.heroHeight
  }

  return (
    <div
      style={heroStyle}
      className={props.heroDirection + " " + props.heroMoving}
      id="hero"></div>
  );
};

export default React.memo(Hero)
