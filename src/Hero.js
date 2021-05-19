import React, { Component } from 'react';

export default class Hero extends Component {
  render(props) {
    return (
      <div 
        style={{
          top:this.props.heroPositionX, 
          left:this.props.heroPositionY, 
          width:this.props.heroWidth, 
          height:this.props.heroHeight }}
        className={this.props.heroDirection + " " + this.props.heroMoving}
        id="hero"></div>)
  }
}
