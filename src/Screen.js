import React, { Component } from 'react';
import TextInputParse from './TextInputParser'
// import Modal from './Modal'
import Hero from './Hero'
import DisplayObjects from './DisplayObjects'




// function GameSetPieces(pieces) {
//   console.log(pieces.setPiece)

//   if(typeof pieces.setPiece === 'object'){
//   //   console.log(pieces.setPiece)
//   //   let piece = pieces.setPiece
//   //  console.log(piece.map())

//    for (const [key, value] of Object.entries(pieces.setPiece)) {
//     console.log(`${key}: ${value}`);
//   }


//   }


  
//   return (
//     <React.Fragment>
//       {/* <div className={pieces.setPiece}>{pieces.setPiece}</div> */}
//     </React.Fragment>
//   );
// }


export default class Screen extends Component {
  constructor() {
    super();
    this.state = {
      modalStatus: "modal display-none",
      modalText: "Modal content is here!"
    };

    // this.GameSetPieces = this.GameSetPieces.bind(this);
  }
  

 


  A


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