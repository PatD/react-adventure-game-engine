onmessage = function (e) {

    // the hero's location and size, and 
    // the object's location and size, are passed as an object
    const workerState = e.data;

    const offset = 5; // how far around object do we allow hero to be on it?

    const heroOffX = workerState.heroPositionX - offset,
        heroOffWidth = workerState.heroWidth + offset,
        heroOffY = workerState.heroPositionY - offset,
        heroOffHeight = workerState.heroHeight + offset;


    // Function checks if we're within the range of display object on the screen
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

        let obsInRange = []

        // At each step, loop through objects and see if we've collided
        for (const [key, dispObj] of Object.entries(workerState.roomCurrentObjects)) {

            // If there's a collsion, add the inventory item to the array
            if (checkForCollision(dispObj) === true) {
                obsInRange.push(dispObj.Name.toLowerCase()) // Adds it as lowercase here because the parser makes everything lowercase

                // Otherwise remove it
            } else {
                obsInRange = obsInRange.filter(item => item !== dispObj.Name.toLowerCase());
            }
        }
        if(obsInRange.length > 0){
            console.log(obsInRange)
        }
        return obsInRange;
    };


    workerResult = () => {
        if(hasCollided() !== undefined){
            return hasCollided()
        }
    };

    // Objects we are near are sent back to the App component:
    postMessage(workerResult());
}
