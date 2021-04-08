onmessage = function (e) {

    // the hero's location and size, and 
    // the object's location and size, are passed as an object
    const workerState = e.data;
    console.log(workerState)

    // Need to pass in the current room w/each command


    // Handle inventory - looking at a thing


    // load words from the game itself


    // Handle room specific stuff - check for a room //



    // Strip out extra words like "is, the, and, am" and punctuation


    // 



    // Helper function to see if we hit a thing
    hasCollided = () => {
    };



    workerResult = () => {
    
    }

    // Results are sent back to the React component:
    postMessage(workerState);
}
