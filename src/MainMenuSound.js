import React, { Component } from 'react';
// import { render } from 'react-dom';

export default class MainMenuSound extends Component {
  render(props){
    return(
      <span onClick={this.props.toggleSound} className='soundStatus'>Sound:{this.props.soundStatus}</span>
    )
  } 
}