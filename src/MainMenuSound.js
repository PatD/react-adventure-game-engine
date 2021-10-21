import React, { Component } from 'react';

export default class MainMenuSound extends Component {
  render(props){
    console.Console(this.props.soundOn)
    return(
      <span onClick={this.props.toggleSound} className='soundStatus'>Sound:{this.props.soundOn}</span>
    )
  } 
}