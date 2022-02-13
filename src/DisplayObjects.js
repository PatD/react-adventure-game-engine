import React, { useState, useEffect } from "react";

// Handles display of both objects (which don't change once rendered) and
// inventory objects, which can disapear off the screen when picked up 
// by the hero.

const DisplayObjects = (props) => {

    const [displayObjects, setDisplayObjects] = useState("");
    const [displayInventoryDisplayObjects, setDisplayInventoryDisplayObjects] = useState("");

    // Render any display objects in the current room
    const renderDisplayObjects = () => {

        if (props && props.roomCurrentObjects.length > 0) {
            let dispObs = props.roomCurrentObjects.map((d) => (

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
                            ? props.roomCurrentName + "_" + d.id + " " + d.class
                            : props.roomCurrentName + "_" + d.id
                    }
                    key={d.id}></div>
            ));
            return setDisplayObjects(dispObs)
        }
    }


    // Also render any visible Inventory objects
    const renderInventoryDisplayObjects = () => {
        // Create array of objects of that's any inventory item where 
        // inventory:FoundRoom = roomCurrent and Visible:true and available isn't false
        const roomInventory = props.inventory.filter(inv => inv.FoundRoom === props.roomCurrent && inv.Visible === true && inv.owned === false && inv.available !== false);

        if (roomInventory.length > 0) {
            let invDispObs = roomInventory.map((d) => (

                <div
                    id={d.Name}
                    style={{
                        width: d.width,
                        height: d.height,
                        top: d.x,
                        left: d.y,
                        backgroundColor: d.bgcolor,
                        zIndex: d.zIndex
                    }}
                    className={
                        (d.cssName !== undefined)
                            ? "inventoryItem Inventory_" + d.cssName + " " + d.Name
                            : "inventoryItem Inventory_" + d.Name
                    }
                    key={d.Name}></div>
            ));

            return setDisplayInventoryDisplayObjects(invDispObs)
        }
    }



    // Remove the item from the screen if the user takes it
    useEffect(() => {
        setDisplayInventoryDisplayObjects([])
        renderInventoryDisplayObjects()
    }, [props.inventory]);


    // When the user changes rooms, re-render display objects and invntory objects
    useEffect(() => {
        setDisplayInventoryDisplayObjects([])
        renderDisplayObjects()
        renderInventoryDisplayObjects()
    }, [props.roomCurrent]);



    return (
        <React.Fragment>
            {displayObjects}
            {displayInventoryDisplayObjects}
        </React.Fragment>)

};

export default React.memo(DisplayObjects);
