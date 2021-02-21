import React, { Component } from 'react';

export default class navGame extends Component{
  
  handleAboutClick =() =>{
    console.log('about clicked')
    this.props.resetMenu();
  }

  handleHelpClick =() =>{
    console.log('help clicked')
    this.props.resetMenu();
  }

  render(props){
    return (
      <React.Fragment>
          <ul className={this.props.mainNavGameMenu}>
          <li onClick={this.handleHelpClick}>Help</li>
              <li onClick={this.handleAboutClick}>About</li>
              
          </ul>
      </React.Fragment>
    );
  }
};