import React, { Component } from 'react';

export default class GameSelector extends Component {
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
  
    // When select menu changed, store selection in state
    handleChange(event) {
       this.setState({selectedGame: event.target.value});
    };
  
    // On submit, fetch selected game's information, and pass state up
    handleSubmit(event) {
        event.preventDefault();
        this.loadSelectedGame()
    }

    loadSelectedGame(){
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


    // When component loads, load game list
    // from public/games/ folder
    componentDidMount() {
        fetch("../games/gamelist.json")
          .then(res => res.json())
          .then(
            (result) => {
             
               // if there's a default set in gamelist.json, load that, otherwise load the first one
              let defaultGame = result[0].Path;

              result.forEach(function(game){
                  if(game.default === true){
                      defaultGame = game.Path
                  }
              });

              this.setState({
                gamesAreLoaded: true,
                selectedGame: defaultGame,
                games: result
              });
              
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

    return (
        <form onSubmit={this.handleSubmit}>
          <label htmlFor='gameselector'>
            Select a game:
            <select name='gameselector' id='gameselector' onChange={this.handleChange}>
                { this.state.games.map((game) => 
                    <option key={game.Title} value={game.Path}>{game.Title}</option>
                )}
            </select>
          </label>
           <input type="submit" value="Load Game!" />
        </form>
      );
    }
  }

//   export default GameSelector