import React, { Component } from 'react';

class GameSelector extends Component {
    constructor(props) {
      super(props);
      this.state = {
          gamesAreLoaded:false,
          selectedGame:"",
          games: [],
          error:""
        };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      alert('Your favorite game is: ' + this.state.value);
      event.preventDefault();
    }



    // When component loads, load game list
    // from public/games folder
    componentDidMount() {
        fetch("../games/gamelist.json")
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                gamesAreLoaded: true,
                games: result
              });
            //   console.log("Loaded " + JSON.stringify(result) + " games.")
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              this.setState({
                isLogamesAreLoadedaded: false,
                selectedGame:"",
                error
              });
            }
          )
      }

    render() {

    return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Select a game:
            <select value={this.state.selectedGame} onChange={this.handleChange}>
                { this.state.games.map((game) => 
                    <option key={game.Title} value={game.Path}>{game.Title}</option>
                )}
            </select>
          </label>
          <input type="submit" value="Load" />
        </form>
      );
    }
  }

  export default GameSelector