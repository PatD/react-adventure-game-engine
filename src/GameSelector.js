import React, { Component } from 'react';

class GameSelector extends Component {
    constructor(props) {
      super(props);
      this.state = {value: 'coconut'};
  
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
              console.log("Loaded " + JSON.stringify(result) + " games.")
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              this.setState({
                isLogamesAreLoadedaded: false,
                error
              });
            }
          )
      }
  
    render() {
      return (
          
        <form onSubmit={this.handleSubmit}>
          <hr/>
          <label>
            Select a game:
            <select value={this.state.value} onChange={this.handleChange}>
              <option value="grapefruit">Grapefruit</option>
              <option value="lime">Lime</option>
              <option value="coconut">Coconut</option>
              <option value="mango">Mango</option>
            </select>
          </label>
          <input type="submit" value="Load" />
        </form>
      );
    }
  }

  export default GameSelector