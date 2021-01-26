import React, { Component } from 'react';
import MainMenuBar from './MainMenuBar'
import TextInputParse from './TextInputParser'
import Modal from './Modal'




class Screen extends Component {
  constructor() {
    super();
    this.state = {
      show: false
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };


  render() {
    return (  
    <React.Fragment> 
       <button type="button" onClick={this.showModal}>
          Open
        </button>
        <Modal show={this.state.show} handleClose={this.hideModal}>
          <p>Modal content is here!</p>
        </Modal>
      <header>
        <MainMenuBar menuActive={true} playerScore={0} soundState="On" />
      </header>
      <main>This is the main UI screen!</main>
      <footer>
        <TextInputParse/>
      </footer>
      <Modal/>
    </React.Fragment>)
  }
}

export default Screen;