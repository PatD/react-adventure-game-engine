onmessage = function (e) {

    // the hero's location and size, and 
    // the object's location and size, are passed as an object
    const workerState = e.data;

    const offset = 20; // how far around object do we allow hero to grab it?

    const heroOffX = workerState.heroPositionX - offset,
        heroOffWidth = workerState.heroWidth + offset,
        heroOffY = workerState.heroPositionY - offset,
        heroOffHeight = workerState.heroHeight + offset;


    // Function checks if we're within the range of the object
    hasCollided = () => {

        let checkForCollision = (dispObj) => {

            if (heroOffY < dispObj.y + dispObj.width &&
                heroOffY + heroOffWidth > dispObj.y &&
                heroOffX < dispObj.x + dispObj.height &&
                heroOffX + heroOffHeight > dispObj.x) {
                return true
            }
            else {
                return false
            }
        }

        // At each step, loop through objects and see if we've collided
        for (const [key, dispObj] of Object.entries(workerState.roomVisibleInventory)) {

            if (checkForCollision(dispObj) === true && dispObj.owned === false) {
                return {"inRange": dispObj.Name}
            } else {
                return {"notInRange": dispObj.Name}
            }
        }
    };

    workerResult = () => {
        if (hasCollided() !== undefined) {
            return hasCollided()
        }
    };

    // Objecgs we are near are sent back to the App component:
    postMessage(workerResult());
}
