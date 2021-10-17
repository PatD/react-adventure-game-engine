import React, { Component } from 'react';

export class Modal extends Component{
  // Support for four seprate line-broken slots in the dialog box  
  render(props){
    return (
      <div 
        // onClick={this.props.hideModal} 
        className={this.props.modalStatus ? "modal display-block": "modal display-none"}>
        <section className="modal-main" style={{width:this.props.modalWidth, top:this.props.modalTop}}>
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
}

export default React.memo(Modal);