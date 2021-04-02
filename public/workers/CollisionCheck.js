onmessage = function(e) {
  console.log('Message received from main script');
  var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
  console.log('Posting message back to main script');
  postMessage(workerResult);
}

// self.addEventListener(
//   "message",
//   function(e) {
//     self.postMessage(e.data);
//   },
//   false
// );