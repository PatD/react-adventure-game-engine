import React, { Component } from 'react';
// import { render } from 'react-dom';

export default class MainMenuSound extends Component {
  render(){
    return(
<span className='soundStatus'>Sound:{this.props.soundStatus}</span>
    )
  } 
}

/*
export default class MainMenuSound extends Component {
  constructor(props) {
    super(props);
    this.state = {soundState:true};
    this.toggleSound = this.toggleSound.bind(this);
  }
  toggleSound(){
    this.setState(state => ({
      soundState: !state.soundState
    }));
  };
  

  render() {
    return (
      <React.Fragment>
        <span 
          onClick={this.toggleSound} 
          className="soundStatus">Sound:{this.state.soundState ? 'On' : 'Off'}</span>
      </React.Fragment>
    )
  }
}
*/
