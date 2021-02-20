import React, { Component } from 'react';

export default class navGame extends Component{
  
  render(props){
    return (
      <React.Fragment>
          <ul className={this.props.mainNavGameMenu}>
              <li>About</li>
              <li>Help</li>
          </ul>
      </React.Fragment>
    );
  }
};