onmessage = function (e) {

    // the hero's location and size, and 
    // the object's location and size, are passed as an object
    const workerState = e.data;


    // Helper function to see if we hit a thing
    hasCollided = () => {


        let checkForCollision = (dispObj) => {

        

            if (workerState.heroPositionY < dispObj.y + dispObj.width &&
                workerState.heroPositionY + workerState.heroWidth > dispObj.y &&
                workerState.heroPositionX < dispObj.x + dispObj.height &&
                workerState.heroPositionX + workerState.heroHeight > dispObj.x) {
                return true
            }
            else {
                return false
            }
        }

        // At each step, loop through objects and see if we've collided
        for (const [key, dispObj] of Object.entries(workerState.roomVisibleInventory)) {
            if (checkForCollision(dispObj) === true && dispObj.colide === true && key) {
                return true
            } else{
                return false
            }
        }

        // return false
    };



    workerResult = () => {



         console.log('Worker result')
         console.log(hasCollided())

        /*
        if (workerState.heroPositionCollided === false && hasCollided() === true && workerState.heroMoving !== "stopped") {
            // { heroPositionCollided: true })
            console.log('Near object')
            return "haltCollide"
        }
        */

        // If we've hit a room exit, pass that number back
        // if(typeof hasCollided() === "number"){
        //     console.log("Room exit number time")
        //     return hasCollided()
        // }

        /*
        // Handle collision while moving
        if (workerState.heroPositionCollided === false && hasCollided() === true && workerState.heroMoving !== "stopped") {
            // { heroPositionCollided: true })
            console.log('🛑 Hero Collided w/object. They were walking ' + workerState.heroDirection + " and before that " + workerState.heroLastDirection);
            return "haltCollide"
        }

        // handle movement after object collision
        else if (workerState.heroLastDirection === "ArrowLeft" && workerState.heroPositionCollided === true) {
            return { heroPositionCollided: false, heroMoving: "moving", heroPositionY: workerState.heroPositionY + workerState.heroMovementDisance }
        }
        else if (workerState.heroLastDirection === "ArrowRight" && workerState.heroPositionCollided === true) {
            return { heroPositionCollided: false, heroMoving: "moving", heroPositionY: workerState.heroPositionY - workerState.heroMovementDisance }
        }
        else if (workerState.heroLastDirection === "ArrowDown" && workerState.heroPositionCollided === true) {
            return { heroPositionCollided: false, heroMoving: "moving", heroPositionX: workerState.heroPositionX - workerState.heroMovementDisance }
        }
        else if (workerState.heroLastDirection === "ArrowUp" && workerState.heroPositionCollided === true) {
            return { heroPositionCollided: false, heroMoving: "moving", heroPositionX: workerState.heroPositionX + workerState.heroMovementDisance }
        }

        // Handle if they're already on the wall
        else if (workerState.direction === "ArrowRight" && workerState.heroPositionY > workerState.playfieldY - workerState.heroWidth) {
            return "halt"
        }
        else if (workerState.direction === "ArrowLeft" && workerState.heroPositionY <= 0) {
            return "halt"
        }
        else if (workerState.direction === "ArrowUp" && workerState.heroPositionX <= 0) {
            return "halt"
        }
        else if (workerState.direction === "ArrowDown" && workerState.heroPositionX >= workerState.playfieldX - workerState.heroHeight) {
            return "halt"
        }

        // Handle walking
        else if (workerState.direction === "ArrowRight" && workerState.heroPositionCollided === false && workerState.heroPositionY <= workerState.playfieldY - workerState.heroWidth) { // Needs to account for hero width
            return { heroPositionY: workerState.heroPositionY + workerState.heroMovementDisance }
        }
        else if (workerState.direction === "ArrowLeft" && workerState.heroPositionCollided === false && workerState.heroPositionY >= 0) {
            return { heroPositionY: workerState.heroPositionY - workerState.heroMovementDisance }
        }
        else if (workerState.direction === "ArrowUp" && workerState.heroPositionCollided === false && workerState.heroPositionX >= 0) {
            return { heroPositionX: workerState.heroPositionX - workerState.heroMovementDisance }
        }
        else if (workerState.direction === "ArrowDown" && workerState.heroPositionCollided === false && workerState.heroPositionX <= workerState.playfieldX - workerState.heroHeight) { // Needs to account for hero height
            return { heroPositionX: workerState.heroPositionX + workerState.heroMovementDisance }
        }

        else {
            return clearInterval(this.movementInterval)
        }
        */
    }

    // Results are sent back to the React component:
    postMessage(workerResult());
    // postMessage("hi")
}
