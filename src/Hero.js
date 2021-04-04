import React, { Component } from 'react';

class Hero extends Component {
  render(props) {
  
    return (
    <React.Fragment>
      <div 
        style={{
          backgroundImage:this.props.heroSprite,
          top:this.props.heroPositionX, 
          left:this.props.heroPositionY, 
          width:this.props.heroWidth, 
          height:this.props.heroHeight }}
        className={this.props.heroDirection + " " + this.props.heroMoving}
        id="hero"></div>
    </React.Fragment>)
  }
}

export default Hero;