import React, { Component } from 'react';
import TextInputParse from './TextInputParser'
import Hero from './Hero'
import DisplayObjects from './DisplayObjects'


export default class Screen extends Component {
  constructor() {
    super();
    this.state = {
      modalStatus: "modal display-none",
      modalText: "Modal content is here!"
    };
  }
  



  componentDidUpdate(prevProps) {
    // if the room objects have changed, re-render:
    if(prevProps.roomCurrentObjects !== this.props.roomCurrentObjects){
      // this.AddRoomObjects()

    }
  }



  render(props) {
    return (
      <React.Fragment>
        <section id="gameUI">
          <main className={this.props.roomCurrentName}>

            <DisplayObjects 
              roomCurrentName={this.props.roomCurrentName}
              roomCurrentObjects={this.props.roomCurrentObjects} />

          <div id="rock" 
              style={{
              'position':'absolute','zIndex':10, 
              'left':this.props.rockPositionX, 
              'top':this.props.rockPositionY, 
              'width':this.props.rockWidth, 
              'height':this.props.rockHeight}}></div>

            <Hero
              heroHeight={this.props.heroHeight}
              heroWidth={this.props.heroWidth}
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