import React from 'react';

const Modal = (props) => {

  const modalStyle = {
    width: props.modalWidth,
    top: props.modalTop
  }

  return (
    <div
      className={props.modalStatus ? "modal display-block" : "modal display-none"}>
      <section className="modal-main" style={modalStyle}>
        <p>{props.modalText}</p>
        <p className={props.modalTextSlot2 === "" ? "display-none" : "display-block"}><br />{props.modalTextSlot2}</p>
        <p className={props.modalTextSlot3 === "" ? "display-none" : "display-block"}><br />{props.modalTextSlot3}</p>
        <p className={props.modalTextSlot4 === "" ? "display-none" : "display-block"}><br />{props.modalTextSlot4}</p>
      </section>
    </div>
  );
};

export default React.memo(Modal);