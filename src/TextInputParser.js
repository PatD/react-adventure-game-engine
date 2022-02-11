import React, { Component } from 'react';

export class TextInputParser extends Component {

  // Focus the input field on load or change.  
  // Essentially, always be ready for text input
  // componentDidMount(){
  //   this.searchInput.focus();
  // }

  // componentDidUpdate(prevProps) {
  //   this.searchInput.focus();
  // }

  render(props) {
    return (
      <footer>
        <form /* onSubmit={this.submitTextParser} */ >
          <input
            spellCheck="false"
            autoComplete="false"
            type="text"
            placeholder="_"
            // ref={inputEl => (this.searchInput = inputEl)}
            onChange={this.props.textParserChange}
            value={this.props.textParserValue}
          />
        </form>
      </footer>
    );
  }
}

export default React.memo(TextInputParser);
