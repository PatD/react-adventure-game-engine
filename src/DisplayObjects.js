import React, { Component } from 'react';

export default class DisplayObjects extends Component {
    constructor() {
        super();
        this.state = {
            displayObjects: ""
        };
    }

    renderDisplayObjects() {

        if (this.props && this.props.roomCurrentObjects.length > 0) {
            let dispObs = this.props.roomCurrentObjects.map((d) => (

                <div
                    id={d.id}
                    style={{
                        position: "absolute",
                        width: d.width,
                        height: d.height,
                        top: d.x,
                        left: d.y,
                        backgroundColor: d.bgcolor,
                        zIndex: d.zIndex,
                        display: (d.visible === false) ? "none" : "block"  // Usually display block, but is visible is set to false, then hide it.
                    
                    }}
                    className={
                        (d.class !== undefined) 
                        ? this.props.roomCurrentName + "_" + d.id + " " + d.class
                        : this.props.roomCurrentName + "_" + d.id
                    }
                    key={d.id}></div>


            ));

            this.setState({ displayObjects: dispObs })
        }
    }


    componentDidUpdate(prevProps) {
        // if the room objects have changed, re-render:
        if (prevProps.roomCurrentObjects !== this.props.roomCurrentObjects) {
            this.renderDisplayObjects()
        }
    }



    render(props) {
        return (
            <React.Fragment>
                {this.state.displayObjects}
            </React.Fragment>)
    }
}
