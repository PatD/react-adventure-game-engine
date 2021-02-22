import React, { Component } from 'react';

export default class navSpecial extends Component{
  
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
          <ul className={this.props.mainNavSpecialMenu}>
              <li>Special Menu Item</li>
          </ul>
      </React.Fragment>
    );
  }
};