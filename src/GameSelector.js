import React, { Component } from 'react';

export default class GameSelector extends Component {
  state = {
    gamesAreLoaded: false,
    selectedGame: "",
    error: ""
  };
  
  loadSelectedGame() {
    fetch(this.state.selectedGame)
      .then(res => res.json())
      .then(
        (result) => {
          this.props.loadGameFile(result)
        },
        (error) => {
          alert('Error loading game')
          this.setState({
            error
          });
        }
      )
  }


  // When component loads, grab the 
  componentDidMount() {
    fetch("../games/gamelist.json")
      .then(res => res.json())
      .then(
        (result) => {

          this.setState({
            gamesAreLoaded: true,
            selectedGame: result.Path
          });

          // Apply custom JS
          if (result.JS) {
            const gameLogic = document.createElement('script');
            document.head.appendChild(gameLogic);
            gameLogic.setAttribute("src", result.JS)
          }

          // Apply custom styles
          if (result.CSS) {
            const gameStyle = document.createElement('link');
            document.head.appendChild(gameStyle);
            gameStyle.setAttribute("rel", "stylesheet")
            gameStyle.setAttribute("href", result.CSS)
          }

          // Now that the JS and CSS are loaded, load the game's state
          this.loadSelectedGame()
        },
        (error) => {
          this.setState({
            error
          });
        }
      )
  }

  render() {
    return null
  }
}
