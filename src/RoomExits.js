import React, { useState, useEffect } from "react";

// Handles on screen display of room exits.  
// When the game is done, this component may be less necessary, as
// this doesn't actually handle the room change hit area.

const RoomExits = (props) => {

    const [RoomExits, setRoomExits] = useState("");

    const renderRoomExits = () => {

        if (props && props.roomExits.length > 0) {
            let roomExs = props.roomExits.map((d) => (

                <div
                    id={d.exit}
                    style={{
                        width: d.width,
                        height: d.height,
                        top: d.x,
                        left: d.y
                    }}
                    className={"roomExit " + props.roomCurrentName + "_roomExit_" + d.exit}
                    key={d.exit}></div>

            ));
            
            return setRoomExits(roomExs);
        }
    }


    // When gamelogic.js is loaded, run the funciton that extracts URLs of images.
    useEffect(() => {
        renderRoomExits()
    }, [props.roomExits]);

    return (
        <React.Fragment>
            {RoomExits}
        </React.Fragment>)

};

export default React.memo(RoomExits);
