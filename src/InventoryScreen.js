import React, { Component } from 'react';

const inventoryWindow = (
  <React.Fragment>
      <aside>
          <fieldset>
            <h4>You are carrying:</h4>
            <ul>
                <li>Items</li>
            </ul>
            <h5>Press ENTER to select, ESC to cancel</h5>
        </fieldset>
        </aside> 
  </React.Fragment>
)

class InventoryScreen extends Component {
  render() {
    return inventoryWindow

  }
}

export default InventoryScreen;