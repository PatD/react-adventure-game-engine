import React, { Component } from 'react';

export class GameLoader extends Component {

  loadSelectedGame(selectedGame) {
    fetch(selectedGame)
      .then(res => res.json())
      .then(
        (result) => {
          this.props.loadGameFile(result) //
        },
        (error) => {
          alert('Error loading game - there was a problem with loading games data file.');
        }
      )
  }


  // When component loads, grab the gamelist file in the /public/games folder
  // This file contains an object with paths to the CSS, JS, and JSON data file
  componentDidMount() {
    fetch("../games/gamelist.json")
      .then(res => res.json())
      .then(
        (result) => {

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
          this.loadSelectedGame(result.Path)
        },
        (error) => {

          alert('Error loading game')

        }
      )
  }

  render() {
    return null
  }
}

export default GameLoader
