import React, { Component } from 'react';

export class TextInputParser extends Component {

  render(props) {
    return (
      <footer>
        <form>
          <input
            spellCheck="false"
            autoComplete="false"
            type="text"
            placeholder="_"
            onChange={this.props.textParserChange}
            value={this.props.textParserValue}
          />
        </form>
      </footer>
    );
  }
}

export default React.memo(TextInputParser);
