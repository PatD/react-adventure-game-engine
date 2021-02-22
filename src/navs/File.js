import React, { Component } from 'react';

export default class navFile extends Component{
  
  // handleAboutClick =() =>{
  //   console.log('about clicked')
  //   this.props.resetMenu();
  // }

  // handleHelpClick =() =>{
  //   console.log('help clicked')
  //   this.props.resetMenu();
  // }

  render(props){
    return (
      <React.Fragment>
          <ul className={this.props.mainNavFileMenu}>
              <li>New Game</li>
              <li>Load Game</li>
          </ul>
      </React.Fragment>
    );
  }
};