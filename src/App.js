import React, { Component } from 'react';
import Screen from './Screen';
import Debug from './Debug'
import InventoryScreen from './InventoryScreen'
import Modal from './Modal'

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <section id="gameUI">
          <Screen/>
        </section>
        <InventoryScreen/>
        <Modal/>
        <Debug/>
      </React.Fragment>
    );
  }
}

export default App;
