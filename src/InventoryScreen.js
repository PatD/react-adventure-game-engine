import React, { Component } from 'react';

export class InventoryScreen extends Component {
  render(props) {
    
    // Create a variable to hold our inventory items
    let inventoryListing

    // Wait for props to be passed in, and only run when inventory screen is active
    if (this.props.inventoryVisable !== "display-none" && this.props.inventory !== 'undefined' && typeof this.props.inventory === 'object') {
      
       // Only display items hero actually has it
       inventoryListing = this.props.inventory.map(function isOwned(item,index) {
          if(item.owned === true){
            return <li key={index}>{item.Name}</li>
          }
          return true
        })
    } else {
      // Empty handed
      inventoryListing = <li>Nothing</li>
    }

    return (
      // Render inventory only if the hero is alive!
      // Prevents activation while in title screen.
      <React.Fragment>
        {this.props.heroAlive ?
        
        <aside className={this.props.inventoryVisable ? "display-block": "display-none"}>
          <fieldset>
            <div>
              <h4>You are carrying:</h4>
              <ul>{inventoryListing}</ul>
            </div>
            <h5>Press any key to continue</h5>
          </fieldset>
        </aside>

        : null }
      </React.Fragment>
    )
  }
}

export default React.memo(InventoryScreen);