import React, { Component } from 'react';

export default class Modal extends Component{
  
  render(props){
    return (
      <div className={this.props.modalStatus} onClick={this.props.hideModal}>
        <section className="modal-main">
          {this.props.modalText}
        </section>
      </div>
    );
  }
};