import React, { Component } from 'react';

export default class navFile extends Component{
  
  // The menu item name is passed all the way up to App.js
  // and is closed in MainMenuBar.js
  handleMenuClick = (event) =>{
    this.props.handleDropDownMenuClick(event);
    this.props.resetMenu();
  }
  

  render(props){
    return (
      <React.Fragment>
          <ul className={this.props.mainNavFileMenu}>
              <li onClick={this.handleMenuClick}>New Game</li>
              <li onClick={this.handleMenuClick}>Load Game</li>
          </ul>
      </React.Fragment>
    );
  }
};