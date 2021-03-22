import React, { Component } from 'react';
import TextInputParse from './TextInputParser'
import Hero from './Hero'


export default class Screen extends Component {
  constructor() {
    super();
    this.state = {
      displayObjects: ""
    };
  }

  renderDisplayObjects() {

    if (this.props && this.props.roomCurrentObjects.length > 0) {
      let dispObs = this.props.roomCurrentObjects.map((d) => (

        <div
          id={d.id}
          style={{
            position: "absolute",
            width: d.width,
            height: d.height,
            top: d.x,
            left: d.y,
            backgroundColor: d.bgcolor,
            zIndex: d.zIndex
          }}
          className={this.props.roomCurrentName + "_" + d.id}
          key={d.id}>{d.id}</div>


      ));
      
      this.setState({ displayObjects: dispObs })
    }
  }


  componentDidUpdate(prevProps) {
    // if the room objects have changed, re-render:
    if (prevProps.roomCurrentObjects !== this.props.roomCurrentObjects) {
      this.renderDisplayObjects()
    }
  }



  render(props) {
    return (
      <React.Fragment>
        <section id="gameUI">
          <main className={this.props.roomCurrentName}>

            {this.state.displayObjects}

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