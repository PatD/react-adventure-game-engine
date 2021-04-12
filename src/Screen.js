import React, { Component } from 'react';
import TextInputParse from './TextInputParser'
import Hero from './Hero'
import DisplayObjects from './DisplayObjects'
import RoomExits from './RoomExits'

export default class Screen extends Component {

  // Fires when user hits enter on text field
  submitTextParser = event => {
    event.preventDefault();

    if (this.props.pausedgame === false && this.props.inventoryVisable === false) {

      // Populates the Submitted Text state for processing then clears input field
      this.props.textPopulateStateAndClearParser(event);

      // Every text entry prompts a modal opening:
      this.props.togglePause();

      // and the text is passed up to a handling function
      // this.props.handleSubmittedTextModal(event.target.elements[0].value)

      
    }
    else {
      // If the enter key is pressed, while the modal is open, close the mdoal
      this.props.hideModal()
    }
  }


  render(props) {
    // Since the hero sprite is base64, add it as a style stag:
    const heroSpriteCSS = `#hero {background-Image:` + this.props.heroSprite + `}`

    return (
      <React.Fragment>
        <style>
          {heroSpriteCSS}
        </style>
        <section id="gameUI">
          <main className={this.props.roomCurrentName}>

            <RoomExits
              roomExits={this.props.roomExits}
              roomCurrentName={this.props.roomCurrentName} />

            <DisplayObjects
              roomCurrentName={this.props.roomCurrentName}
              roomCurrentObjects={this.props.roomCurrentObjects} />

            <Hero
              heroHeight={this.props.heroHeight}
              heroWidth={this.props.heroWidth}
              heroPositionX={this.props.heroPositionX}
              heroPositionY={this.props.heroPositionY}
              heroDirection={this.props.heroDirection}
              heroMoving={this.props.heroMoving}
              heroSprite={this.props.heroSprite}
            />

          </main>
          <footer>
            <form onSubmit={this.submitTextParser}>
              <TextInputParse
                customVerbs={this.props.customVerbs}
                inventory={this.props.inventory}
                textParserChange={this.props.textParserChange}
                textParserValue={this.props.textParserValue}
                heroPositionX={this.props.heroPositionX}
                heroPositionY={this.props.heroPositionY}
                roomCurrentName={this.props.roomCurrentName}
                roomCurrentObjects={this.props.roomCurrentObjects} 
                roomCurrentDescription={this.props.roomCurrentDescription}
                submittedText={this.props.submittedText}
                handleSubmittedTextModal={this.props.handleSubmittedTextModal}
              />
            </form>
          </footer>
        </section>
      </React.Fragment>)
  }
}