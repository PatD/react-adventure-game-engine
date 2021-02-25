import React, { Component } from 'react';

export default class TextInputParser extends Component {



  componentDidMount(){
    // console.log('text parser mounted')
  }


  componentDidUpdate() {
    this.searchInput.focus();
  } 


  render(props) {
    return (  
              <input
                // onFocus={this.props.textParserFocus}
                // onBlur={this.props.textParserBlur}
                spellCheck="false"
                autoComplete="false"
                // onFocus="this.value='_'"
                // onSubmit={this.formSubmit}
                // onFocus={this.clearInputField}
                // onInputCapture={this.clearInputField}
                type="text"
                placeholder="_"
                ref={inputEl => (this.searchInput = inputEl)} 
                // defaultValue={this.props.textParser}
                // value={this.props.textParserValue}
                onChange={this.props.textParserChange}
                value={this.props.textParserValue} 
                />
          );
  }
}
