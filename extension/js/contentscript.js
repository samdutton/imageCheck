var sendResponseFunction;
var resizedImages = [];
var numImgElements = 0;
var numChecked = 0;

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse){
  	sendResponseFunction = sendResponse;
    if (request.type == "sendResizedImages") {
      checkImages();
		}
		return true;
});

function checkImages(){
	var imgElements = document.querySelectorAll("img");
	numImgElements = imgElements.length;
	for (var i = 0; i != numImgElements; ++i) {
		var img = imgElements[i];
		check(img);
	}
}

function check(img){
	var fileName = img.src.match(/[^/]*$/);
	var width = img.width;
	var height = img.height;
	var image = new Image();
	console.log("check()");
	image.onload = function(){
		// img height and width are zero if unresized
		if ((width != 0 && width != image.width) || (height != 0 && height != image.height)) {
			img.style.border= "2px dotted red";
			img.title = "Image has been resized. Original: width " +
				image.width + "px, height " + image.height + "px. Resized: width " +
				width + "px, height " + height + "px";
			resizedImages.push({
				"type": "resizedImage",
				"fileName": fileName,
				"width": width,
				"height": height,
				"imageWidth": image.width,
				"imageHeight": image.height
			});
		}
		numChecked += 1;
		if (numChecked === numImgElements){
			sendResponseFunction({"type": "test", "resizedImages": resizedImages});
		}
	}
	image.src = img.src;
}
