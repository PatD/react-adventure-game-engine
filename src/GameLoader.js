import React, { useEffect } from "react";

/*
  Handles loading the game from /public/games/ 
  Expects there to be a gamelist.json file in /public/games/

*/

const GameLoader = (props) => {

  // Updates app.js state with game data
  const loadSelectedGame = (selectedGame) => {
    fetch(selectedGame)
      .then(res => res.json())
      .then(
        (result) => {
          props.loadGameFile(result) //
        },
        (error) => {
          alert('Error loading game - there was a problem with loading games data file.');
        }
      )
  }

  // Fires once when the component loads
  useEffect(() => {
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
          loadSelectedGame(result.Path)
        },
        (error) => {
          alert('Unable to load game data from gamelist.json file.')
        }
      )
  });

  return null
};

export default React.memo(GameLoader);
