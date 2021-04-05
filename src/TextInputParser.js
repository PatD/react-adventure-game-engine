import React, { Component } from 'react';

export default class TextInputParser extends Component {

  componentDidUpdate() {
    this.searchInput.focus();
  }

  render(props) {
    return (
      <input
        spellCheck="false"
        autoComplete="false"
        type="text"
        placeholder="_"
        ref={inputEl => (this.searchInput = inputEl)}
        onChange={this.props.textParserChange}
        value={this.props.textParserValue}
      />
    );
  }
}
