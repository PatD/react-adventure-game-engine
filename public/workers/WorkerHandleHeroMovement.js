onmessage = function (e) {

    // the hero's location and size, and 
    // the object's location and size, are passed as an object
    const workerState = e.data
    // console.log(workerState)

    workerResult = () => {
        // Handle collision while moving
        if (workerState.heroPositionCollided === false && workerState.hasCollided === true && workerState.heroMoving !== "stopped") {
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



    }
    // console.log(workerResult())



    // Results are sent back to the React component:
    postMessage(workerResult());
}

