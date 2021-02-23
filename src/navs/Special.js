import React, { Component } from 'react';

export default class navSpecial extends Component{
  
  // The menu item name is passed all the way up to App.js
  // and is closed in MainMenuBar.js
  handleMenuClick = (event) =>{
    this.props.handleDropDownMenuClick(event);
    this.props.resetMenu();
  }


  render(props){
    return (
      <React.Fragment>
          <ul className={this.props.mainNavSpecialMenu}>
              <li onClick={this.handleMenuClick}>Special Menu Item</li>
          </ul>
      </React.Fragment>
    );
  }
};