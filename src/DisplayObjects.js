import React, { Component } from 'react';

export default class DisplayObjects extends Component {

    render(props) {

        let displayMarkup;

        if (this.props && this.props.roomCurrentObjects.length > 0) {
            displayMarkup = this.props.roomCurrentObjects.map(item => (
                <div
                    style={{
                        position: "absolute",
                        width: item[1],
                        height: item[2],
                        top: item[3],
                        left: item[4],
                        backgroundColor: item[6],
                        zIndex: item[5]
                    }}
                    className={item[0] + "_" + this.props.roomCurrentName}
                    id={item[0]}
                    key={item}></div>
            ))
        }


        return (
            <React.Fragment>
                {displayMarkup}
            </React.Fragment>)
    }
}
