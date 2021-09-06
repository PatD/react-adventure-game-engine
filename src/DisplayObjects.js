import React, { Component } from 'react';

export default class DisplayObjects extends Component {
    constructor() {
        super();
        this.state = {
            displayObjects: "",
            displayInventoryDisplayObjects:"",
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

            this.setState({ displayObjects: dispObs,
            
            
            })
        }
    }


    // Also render any visible Inventory objects
    renderInventoryDisplayObjects() {
        // Create array of objects of that's any inventory item where 
        // inventory:FoundRoom = roomCurrent and Visible:true and available isn't false
        const roomInventory = this.props.inventory.filter(inv => inv.FoundRoom === this.props.roomCurrent && inv.Visible === true && inv.owned === false && inv.available !== false );

        if (roomInventory.length > 0) {
            let invDispObs = roomInventory.map((d) => (
                
                <div
                    id={d.Name}
                    style={{
                        position: "absolute",
                        width: d.width,
                        height: d.height,
                        top: d.x,
                        left: d.y,
                        backgroundColor: d.bgcolor,
                        zIndex: d.zIndex
                    }}
                    className={
                        (d.class !== undefined) 
                        ? "Inventory_" + d.Name + " " + d.class
                        : "Inventory_" + d.Name
                    }
                    key={d.Name}></div>


            ));
                
            this.setState({ displayInventoryDisplayObjects: invDispObs })
        }
    }


    componentDidUpdate(prevProps) {

        // Remove the item from the screen if the user takes it
        if (prevProps.inventory !== this.props.inventory) {
            this.setState({ displayInventoryDisplayObjects: [] })
            this.renderInventoryDisplayObjects()
        }

        // When the user changes rooms, re-render display objects and invntory objects
        if (prevProps.roomCurrent !== this.props.roomCurrent) {
            this.setState({ displayInventoryDisplayObjects: [] })
            this.renderDisplayObjects()
            this.renderInventoryDisplayObjects()
        }

    }



    render(props) {
        return (
            <React.Fragment>
                {this.state.displayObjects}
                {this.state.displayInventoryDisplayObjects}
            </React.Fragment>)
    }
}
