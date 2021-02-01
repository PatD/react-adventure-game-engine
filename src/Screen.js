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
        <MainMenuBar 
          menuActive={true} 
          playerScore={0} 
          toggleSound={this.props.toggleSound} 
          soundStatus={this.props.soundStatus} />
      </header>
      <main>This is the main UI screen!</main>
      <footer>
        <form onSubmit={this.props.submitTextParser}>
        <TextInputParse 
          // clearInputFieldWhenClicked={this.props.clearInputFieldWhenClicked}
          // textParser={this.props.textParser} 
          textParserBlur={this.props.textParserBlur}
          textParserChange={this.props.textParserChange}
          textParserFocus={this.props.textParserFocus}
          textParserValue={this.props.textParserValue}
          // updateInputTextValue={this.props.updateInputTextValue}
          // submitTextParser={this.props.submitTextParser}
          />
          </form>
      </footer>

      <Modal show={this.state.modalStatus} handleClose={this.hideModal} modalText={this.state.modalText}/>
      <button type="button" onClick={this.showModal}>
          Open
        </button>
    </React.Fragment>)
  }
}