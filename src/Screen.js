import React, { Component } from 'react';
import MainMenuBar from './MainMenuBar'
import TextInputParse from './TextInputParser'
import Modal from './Modal'


export default class Screen extends Component {
  constructor() {
    super();
    this.state = {
      modalStatus: "modal display-none",
      modalText: "Modal content is here!"
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  showModal = () => {
    this.setState({ modalStatus: "modal display-block" })
  };

  hideModal = () => {
    this.setState({ modalStatus: "modal display-none" });
  };


  render(props) {
    return (  
    <React.Fragment> 
      <header>
        <MainMenuBar menuActive={true} playerScore={0} soundStatus={this.props.soundStatus} />
      </header>
      <main>This is the main UI screen!</main>
      <footer>
        <TextInputParse/>
      </footer>

      <Modal show={this.state.modalStatus} handleClose={this.hideModal} modalText={this.state.modalText}/>
      <button type="button" onClick={this.showModal}>
          Open
        </button>
    </React.Fragment>)
  }
}