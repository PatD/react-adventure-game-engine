import React, { Component } from 'react';

export default class DisplayObjects extends Component {
 
    render(props) {

        return (
            <React.Fragment>
                {this.props.displayMarkup}
            </React.Fragment>)
    }
}
