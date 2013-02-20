chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	console.log("background.js request.type: ", request.type);
    if (request.type == "resizedImage") {
      sendResponse({});
      console.log(request);
    }
});
