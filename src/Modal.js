import React, { Component } from 'react';

export default class Modal extends Component{
  // Support for four seprate line-broken slots in the dialog box  
  render(props){
    return (
      <div className={this.props.modalStatus} onClick={this.props.hideModal}>
        <section className="modal-main">
          <p>{this.props.modalText}</p>
          <p className={this.props.modalTextSlot2 ==="" ? "display-none" : "display-block"}><br/>{this.props.modalTextSlot2}</p>
          <p className={this.props.modalTextSlot3 ==="" ? "display-none" : "display-block"}><br/>{this.props.modalTextSlot3}</p>
          <p className={this.props.modalTextSlot4 ==="" ? "display-none" : "display-block"}><br/>{this.props.modalTextSlot4}</p>

          <div id="buttonWrap">
            <button onClick={this.props.modalButtonClick1} className={this.props.modalButtonText1 ==="" ? "display-none" : "display-inlineblock"}>{this.props.modalButtonText1}</button>
            <button onClick={this.props.modalButtonClick2} className={this.props.modalButtonText2 ==="" ? "display-none" : "display-inlineblock"}>{this.props.modalButtonText2}</button>
          </div>
        </section>
      </div>
    );
  }
};