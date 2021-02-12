import React, { Component } from 'react';

class Hero extends Component {
  // constructor() {
  //   super();
  //   // this.state = {
  //   //   heroFacing: "down", // Facing Up, Down, Left, Right
  //   //   heroMoving: "stopped", // movingLeft, movingright,movingUp,movingDown
  //   // };
  // }

  render(props) {

  
    return (
    <React.Fragment>
      <div 
        style={{top:this.props.heroPositionX, left:this.props.heroPositionY}}
        className={this.props.heroDirection + " " + this.props.heroMoving}
        id="hero"></div>
    </React.Fragment>)
  }
}

export default Hero;