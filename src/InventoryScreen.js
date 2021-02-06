import React, { Component } from 'react';


class InventoryScreen extends Component {
    render() {
      return(
    <React.Fragment>
    <aside className={this.props.inventoryVisable}>
        <fieldset>
          <h4>You are carrying:</h4>
          <ul>
              <li>Items</li>
          </ul>
          <h5>Press ENTER to select, ESC to cancel</h5>
      </fieldset>
      </aside> 
    </React.Fragment>
  )}
}

export default InventoryScreen;