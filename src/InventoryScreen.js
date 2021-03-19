import React, { Component } from 'react';

export default class InventoryScreen extends Component {
  render(props) {
    
    // Create a variable to hold our inventory items
    let inventoryListing;


    // Wait for props to be passed in, and only run when inventory screen is active
    if (this.props.inventoryVisable !== "display-none" && this.props.inventory !== 'undefined' && typeof this.props.inventory === 'object') {
      
       // Only display items hero actually has
       inventoryListing = this.props.inventory.map(function isOwned(item,index) {
          if(item.owned === true){
            return <li key={index} title={item.Description}>{item.Name}</li>
          }
          return true
        })
    }

    return (
      <React.Fragment>
        <aside className={this.props.inventoryVisable}>
          <fieldset>
            <h4>You are carrying:</h4>
            <ul>{inventoryListing}</ul>
            <br/>
            <h5>Press ENTER to select, ESC to cancel</h5>
          </fieldset>
        </aside>
      </React.Fragment>
    )
  }
}
