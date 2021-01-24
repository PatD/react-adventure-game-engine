import React, { Component } from 'react';


class Debug extends Component {
  render(props) {
    return (
    <React.Fragment>
      <textarea id="debugger" readOnly value={this.props.debugText}></textarea>
    </React.Fragment>)
  }
}

export default Debug;