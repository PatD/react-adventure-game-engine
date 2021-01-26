import React, { Component } from 'react';

export default class Modal extends Component{
  
  render(props){
    return (
      <div className={this.props.show} onClick={this.props.handleClose}>
        <section className="modal-main">
          {this.props.modalText}
        </section>
      </div>
    );
  }
};