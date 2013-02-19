chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse){
    if (request.type == "imageCheck") {
      sendResponse({});
      checkImages();
	}
});

function checkImages(){
	var imgElements = document.querySelectorAll("img");
	for (var i = 0; i != imgElements.length; ++i) {
		var img = imgElements[i];
		check(img);
	}
}
function check(img){
	var fileName = img.src.match(/[^/]*$/);
	var width = img.width;
	var height = img.height;
	var image = new Image();
	image.onload = function(){
		// img height and width are zero if unresized
		if ((width != 0 && width != image.width) || (height != 0 && height != image.height)) {
			img.style.border= "2px dotted red";
			console.log("Image " + fileName + " has been resized. Original: width " + image.width + "px, height " + image.height + "px. Resized: width " + img.width + "px, height " + img.height + "px.");
		}
	}
	image.src = img.src;
}
