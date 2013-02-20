// chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
// 	console.log("popup.js request.type: ", request.type);
//   if (request.type == "test") {
//     console.log(request);
//   }
// });

chrome.tabs.getSelected(null, function(tab) {
  chrome.tabs.sendMessage(tab.id, {type: "sendResizedImages"}, function(response) {
  	console.log(response);
  });
});
