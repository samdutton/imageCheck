// chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
// 	console.log("popup.js request.type: ", request.type);
//   if (request.type == "test") {
//     console.log(request);
//   }
// });

var noneFound = document.querySelector("#noneFound");
var images = document.querySelector("#images");

// handle clicks on single-pixel or resized images
// 'this' is the div for the image, which has a data-src attribute
function scrollImageIntoView(){
	var src = this.dataset.src;
	chrome.tabs.getSelected(null, function(tab) {
	  chrome.tabs.sendMessage(tab.id, {
		  	"type": "scrollImageIntoView",
		  	"src": src
	  }, function(response){});
  });
}

// send a message to the current tab -- contentscript.js checks for
// resized and single pixel images then responds with details
chrome.tabs.getSelected(null, function(tab) {
  chrome.tabs.sendMessage(tab.id, {type: "sendResizedImages"}, function(response) {
//  	console.log("popup.js got response: ", response);
		noneFound.style.display = "none"; // if there is a response, images have been found

		var singlePixelImages = response.singlePixelImages;
		var numUniqueSinglePixelImages = Object.keys(singlePixelImages).length; // unique images
		var numSinglePixelImages = response.numSinglePixelImages; // total number of times images used
		if (numSinglePixelImages > 0) {
			var singlePixelContainer = document.createElement("div");
			singlePixelContainer.setAttribute("title", "Click to scroll image into view");
			singlePixelContainer.id = "singlePixelImages";
			singlePixelContainer.innerHTML = "<h2>Found " +
				numUniqueSinglePixelImages + " single-pixel image(s) used " +
				numSinglePixelImages + " time(s):</h2>";
			for (var src in singlePixelImages){
				var singlePixelDiv = document.createElement("div");
				singlePixelDiv.className = "singlePixelImage";
				singlePixelDiv.setAttribute("data-src", src); // used by click handler
				var singlePixelFileName = singlePixelImages[src]; // key is src, value is fileName
				singlePixelDiv.innerHTML += singlePixelFileName;
				singlePixelDiv.onclick = scrollImageIntoView;
				singlePixelContainer.appendChild(singlePixelDiv);
			}
			images.appendChild(singlePixelContainer);
		}

  	var resizedImages = response.resizedImages;
  	var numResized = resizedImages.length;
  	if (numResized > 0) {
			var resizedContainer = document.createElement("div");
			resizedContainer.id = "resizedImages";
			resizedContainer.setAttribute("title", "Click to scroll image into view");
			resizedContainer.innerHTML = "<h2>Found " + numResized + " resized image(s)</h2>"
			for (var i = 0; i != numResized; ++i){
	  		var image = resizedImages[i];
	  		var src = image.src;
	  		var fileName = image.fileName;
	  		var width = image.width;
	  		var height = image.height;
	  		var naturalWidth = image.naturalWidth;
	  		var naturalHeight = image.naturalHeight;
	  		var ratioMessage = "";
				var naturalAspectRatio = (naturalWidth/naturalHeight).toFixed(3);
				var aspectRatio = (width/height).toFixed(3);

				// check for images with changed aspect ratio
	  		if (naturalAspectRatio !== aspectRatio) {
	  			ratioMessage = "<br />Resized image has changed aspect ratio (width/height):" +
	  				"<br />- natural: " + (naturalWidth/naturalHeight).toFixed(3) +
	  				"<br />- resized: " + (width/height).toFixed(3);
	  		}

	  		var message = "<img class='thumbnail' src='" + src + "' />" +
	  			"<div class='resizedImageFilename'>" + fileName + "</div>" +
	  			"- natural " + naturalWidth + "x" + naturalHeight + "px<br />" +
	  			"- resized " + width + "x" + height + "px" + ratioMessage;

				var resizedImageDiv = document.createElement("div");
				resizedImageDiv.className = "resizedImage";
				resizedImageDiv.setAttribute("data-src", src); // used by click handler
				resizedImageDiv.innerHTML += message;
				resizedImageDiv.onclick = scrollImageIntoView;
				resizedContainer.appendChild(resizedImageDiv);
			}
	  	images.appendChild(resizedContainer);
		} else {
			images.innerHTML += "<div id='numResized'>No resized images found.</div>";
		}
  });
});
