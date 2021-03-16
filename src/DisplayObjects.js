import React, { Component } from 'react';

export default class DisplayObjects extends Component {

    constructor() {
        super();
        this.state = {
          dispObs:""
        };
    }


 componentDidUpdate(prevProps) {
     if(typeof this.props.roomCurrentObjects === 'object'){
        console.log(typeof this.props.roomCurrentObjects)

        this.props.roomCurrentObjects.map(data => (
            this.state.dispObs = this.state.dispObs + <li>{data}</li>  // only add unique
        ))


     }
    
 }


  render(props) {
  
    return (
    <React.Fragment>
      <ul>{this.state.dispObs}</ul>
    </React.Fragment>)
  }
}
