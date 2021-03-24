import React, { Component } from 'react';

export default class RoomExits extends Component {
    constructor() {
        super();
        this.state = {
            RoomExits: ""
        };
    }

    renderRoomExits() {

        if (this.props && this.props.roomExits.length > 0) {
            let roomExs = this.props.roomExits.map((d) => (

                <div
                    id={d.exit}
                    style={{
                        width: d.width,
                        height: d.height,
                        top: d.x,
                        left: d.y
                    }}
                    className={"roomExit " + this.props.roomCurrentName + "_roomExit_" + d.exit}
                    key={d.exit}></div>

            ));

            this.setState({ RoomExits: roomExs })
        }
    }


    componentDidUpdate(prevProps) {
        // if the room objects have changed, re-render:
        if (prevProps.roomExits !== this.props.roomExits) {
            this.renderRoomExits()
        }
    }

    render(props) {
        return (
            <React.Fragment>
                {this.state.RoomExits}
            </React.Fragment>)
    }
}
