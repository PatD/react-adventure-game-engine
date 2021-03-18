import React, { Component } from 'react';

export default class InventoryScreen extends Component {
  render(props) {

    let inventoryListing

    
    if (this.props.inventory !== 'undefined' && this.props.inventory) {
      // console.log(this.props.inventory)

   

      // inventoryListing = this.props.inventory.map(item => (
      //   console.log(item)
      //   // <li
      //   //   id={item[0]}
      //   //   key={item}>{item}</li>
      // ))

      // for (const [key, value] of Object.entries(this.props.inventory)) {
      //   console.log(`${key}: ${value}`);

      //   inventoryListing = <li>${key}: ${value}</li>
      // }

    }

    return (
      <React.Fragment>
        <aside className={this.props.inventoryVisable}>
          <fieldset>
            <h4>You are carrying:</h4>
            <ul>{inventoryListing}</ul>
            <h5>Press ENTER to select, ESC to cancel</h5>
          </fieldset>
        </aside>
      </React.Fragment>
    )
  }
}
