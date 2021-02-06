import React, { Component } from 'react';
import MainMenuBar from './MainMenuBar'
import TextInputParse from './TextInputParser'
import Modal from './Modal'
import Hero from './Hero'


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

  // User has entered text, show a modal
  respondUserText = () =>{
    // this.props.setModalKeyboardListeners();
    this.setState({ modalText: "The hero typed " + this.props.submittedText + "." })
    this.setState({ modalStatus: "modal display-block" })
  }


  componentDidUpdate(prevProps) {
    if (prevProps.submittedText !== this.props.submittedText) {
      console.log("new input!")
      this.respondUserText()
    }
  }

 

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
      <main>
        <Hero heroDirection={this.props.heroDirection} />
      </main>
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
      {/* <button type="button" onClick={this.showModal}>
          Open
        </button> */}
    </React.Fragment>)
  }
}