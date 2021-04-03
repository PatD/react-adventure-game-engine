onmessage = function(e) {
  
  // the hero's location and size, and 
  // the object's location and size, are passed as an object
  const workerResult = e.data

  // Collision detection is performed:
  const checkCollide = () =>{
    if (workerResult.heroY < workerResult.y + workerResult.width &&
      workerResult.heroY + workerResult.heroWidth > workerResult.y &&
      workerResult.heroX < workerResult.x + workerResult.height &&
      workerResult.heroX + workerResult.heroHeight > workerResult.y) {
      return true
      
    }
    else {
      return false
    }
  }

  // Results are sent back to the React component:
  postMessage(checkCollide());
}

