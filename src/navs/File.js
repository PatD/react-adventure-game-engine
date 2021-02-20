import React, { Component } from 'react';

export default class navGame extends Component{
  
  render(props){
    return (
      <React.Fragment>
          <ul className="subMenu">
              <li>New Game</li>
              <li>Load Game</li>
          </ul>
      </React.Fragment>
    );
  }
};