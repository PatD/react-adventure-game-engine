import React, { Component } from 'react';

class Hero extends Component {
  // constructor() {
  //   super();
  //   // this.state = {
  //   //   heroFacing: "down", // Facing Up, Down, Left, Right
  //   //   heroMoving: "stopped", // movingLeft, movingright,movingUp,movingDown
  //   // };
  // }




  // setHeroMoveState(prevProps){
  //   if (prevProps.heroDirection !== this.props.heroDirection) {
  //     console.log('component diff')
  //     // console.log("--------------------")
  //     // console.log("Key press is " + this.props.heroDirection)
  //     // console.log("Hero is facing:" + this.state.heroFacing)
  //     // console.log("Hero is moving:" + this.state.heroMoving)
  //     // console.log("--------------------")

  //     // if(this.state.heroMoving === "stopped" && this.props.heroDirection === 'ArrowUp'){
  //     //   this.setState({heroFacing:"up",heroMoving:"moving"});
  //     // } else if(this.state.heroMoving === "moving" && this.props.heroDirection === 'ArrowUp'){
  //     //   this.setState({heroFacing:"up",heroMoving:"stopped"});
  //     // } else{

  //     // }


  //   } else if(prevProps.heroDirection === this.props.heroDirection){
  //     console.log('component same')
  //   }
  // }

  componentDidUpdate(prevProps) {
    // update component
    // this.setHeroMoveState(prevProps)
    //           // // Move or not
    //           // if(this.state.heroMoving === "stopped"){
    //           //   this.setState({heroMoving:"moving"})
    //           // } else{
    //           //   this.setState({heroMoving:"stopped"})
    //           // }

    // if (prevProps.heroDirection !== this.props.heroDirection) {
      
    //   // change direction 
    //   if(this.props.heroDirection === "ArrowUp"){
    //     this.setState({heroFacing:"up"})
    //     // if(this.state.heroMoving === "stopped"){
    //     //   this.setState({heroMoving:"moving"})
    //     // } else{
    //     //   this.setState({heroMoving:"stopped"})
    //     // }
        
        
    //   } else if(this.props.heroDirection === "ArrowDown"){
    //     this.setState({heroFacing:"down"})
    //   } else if(this.props.heroDirection === "ArrowLeft"){
    //     this.setState({heroFacing:"left"})
    //   } else {
    //     this.setState({heroFacing:"right"})
    //   }
    // }

  }

  render(props) {

  
    return (
    <React.Fragment>
      <div 
        className={this.props.heroDirection + " " + this.props.heroMoving}
        id="hero"></div>
    </React.Fragment>)
  }
}

export default Hero;