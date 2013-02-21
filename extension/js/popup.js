// chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
// 	console.log("popup.js request.type: ", request.type);
//   if (request.type == "test") {
//     console.log(request);
//   }
// });

var noneFound = document.querySelector("#noneFound");
var images = document.querySelector("#images");

chrome.tabs.getSelected(null, function(tab) {
  chrome.tabs.sendMessage(tab.id, {type: "sendResizedImages"}, function(response) {
		noneFound.style.display = "none";
  	var resizedImages = response.resizedImages;
  	var numResized = resizedImages.length;
  	console.log(numResized);
		images.innerHTML += "<div id='numResized'>Found " + numResized + " resized images</div>"
  	for (var i = 0; i != numResized; ++i){
  		var image = resizedImages[i];
  		var src = image.src;
  		var fileName = image.fileName;
  		var width = image.width;
  		var height = image.height;
  		var naturalWidth = image.naturalWidth;
  		var naturalHeight = image.naturalHeight;
  		var ratioMessage = "";
  		if (width/height !== naturalWidth/naturalHeight) {
  			ratioMessage = "<br /><br />Resized image has changed aspect ratio (width/height):" +
  				"<br />- natural " + (naturalWidth/naturalHeight).toFixed(3) +
  				"<br />- resized " + (width/height).toFixed(3);
  		}
  		var message = "<img class='thumbnail' src='" + src + "' />" +
  			fileName + ":<br />" +
  			"- natural " + naturalWidth + "x" + naturalHeight + "px<br />" +
  			"- resized " + width + "x" + height + "px" + ratioMessage;
  		images.innerHTML += "<div class='image'>" + message + "</div>";
  	}
  });
});
