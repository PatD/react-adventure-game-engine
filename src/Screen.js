import React, { Component } from 'react';
import TextInputParse from './TextInputParser'
// import Modal from './Modal'
import Hero from './Hero'


export default class Screen extends Component {
  constructor() {
    super();
    this.state = {
      modalStatus: "modal display-none",
      modalText: "Modal content is here!"
    };
    // this.showModal = this.showModal.bind(this);
    // this.hideModal = this.hideModal.bind(this);
  }



  // User has entered text, show a modal
  // respondUserText = () => {
  //   this.props.togglePause();
  //   this.setState({ modalText: "The hero typed " + this.props.submittedText + ".",
  //                   modalStatus: "modal display-block" })
  // }



  componentDidUpdate(prevProps) {
    
    // Anytime the component re-renders, update the text
    // if (prevProps.submittedText !== this.props.submittedText) {
    //   this.respondUserText()
    // }
    const rockObjectElement = document.getElementById('rock')

    let heroCollide = {
      x:this.props.heroPositionX,
      y:this.props.heroPositionY,
      width:this.props.heroWidth,
      height:this.props.heroHeight
    }

    let rockObject = {
      width:rockObjectElement.clientWidth,
      height:rockObjectElement.clientHeight,
      x:rockObjectElement.offsetTop,
      y:rockObjectElement.offsetLeft
    }


    if (heroCollide.x < rockObject.x + rockObject.width &&
      heroCollide.x + heroCollide.width > rockObject.x &&
      heroCollide.y < rockObject.y + rockObject.height &&
      heroCollide.y + heroCollide.height > rockObject.y) {
       // collision detected!
      console.log("DETECT")
   }


   
  }


  render(props) {
    return (
      <React.Fragment>

        <section id="gameUI">
          <main>
            <div id="rock"></div>
            <Hero
              heroPositionX={this.props.heroPositionX}
              heroPositionY={this.props.heroPositionY}
              heroDirection={this.props.heroDirection}
              heroMoving={this.props.heroMoving} />
          </main>
          <footer>
            <form onSubmit={this.props.submitTextParser}>
              <TextInputParse
                textParserBlur={this.props.textParserBlur}
                textParserChange={this.props.textParserChange}
                textParserFocus={this.props.textParserFocus}
                textParserValue={this.props.textParserValue}
              />
            </form>
          </footer>
        </section>
      </React.Fragment>)
  }
}