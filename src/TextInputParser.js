import React, { Component } from 'react';

const TextInputParser = (props) => {

    return (
      <footer>
        <form>
          <input
            spellCheck="false"
            autoComplete="false"
            type="text"
            placeholder="_"
            onChange={props.textParserChange}
            value={props.textParserValue}
          />
        </form>
      </footer>
    );
  }

export default React.memo(TextInputParser);
