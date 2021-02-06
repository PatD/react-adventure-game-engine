import React, { Component } from 'react';

class Hero extends Component {
  constructor() {
    super();
    this.state = {
      heroFacing: "down", // Facing Up, Down, Left, Right
      heroMoving: "stopped", // movingLeft, movingright,movingUp,movingDown

    };
    // this.showModal = this.showModal.bind(this);
    // this.hideModal = this.hideModal.bind(this);
  }


  componentDidUpdate() {
    // console.log(this.props.heroDirection)
  }

  render(props) {

  
    return (
    <React.Fragment>
      <div 
        className={this.state.heroFacing + " " + this.state.heroMoving}
        id="hero"></div>
    </React.Fragment>)
  }
}

export default Hero;