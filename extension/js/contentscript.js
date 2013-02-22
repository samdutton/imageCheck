// popup sends a message to the current tab
// script below checks for resized and single pixel images
// then responds with details


chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse){
		var resizedImages = [];
		var singlePixelImages = {};
		var numSinglePixelImages = 0;
		var numImgElements = 0;
    if (request.type === "sendResizedImages") {
			var imgElements = document.querySelectorAll("img");
			numImgElements = imgElements.length;
			if (numImgElements == 0) {
				return;
			}
			for (var i = 0; i != numImgElements; ++i) {
				var img = imgElements[i];
				var src = img.src;
				var fileName = img.src.match(/[^/]*$/)[0].substring(0, 50);
				var width = img.width;
				var height = img.height;
				var naturalWidth = img.naturalWidth;
				var naturalHeight = img.naturalHeight;
				// check for single pixel images
				if (naturalWidth == 1 && naturalHeight == 1) {
					img.style.border= "10px dotted yellow";
					img.setAttribute("data-highlighted", "true");
					img.title = "Single-pixel image " + fileName;
					numSinglePixelImages += 1; // total number of times that single pixel images are used
					singlePixelImages[src] = fileName; // unique single-pixel images
				// check for resized images
				} else if (width != naturalWidth || height != naturalHeight) {
					img.style.border= "10px dotted red";
					img.setAttribute("data-highlighted", "true");
					var ratioMessage = "";
					var naturalAspectRatio = (naturalWidth/naturalHeight).toFixed(3);
					var aspectRatio = (width/height).toFixed(3);
					// check for changed aspect ratio
					if (naturalAspectRatio !== aspectRatio) {
						ratioMessage = "Resized image has changed aspect ratio (width/height):" +
							"\n- natural " + naturalAspectRatio +
							"\n- resized " + aspectRatio;
					}
					// set title (hover message) for image on page
					img.title = "Image has been resized:\n" +
						"- natural " + naturalWidth + "x" + naturalHeight + "px\n" +
						"- resized " + width + "x" + height + "px\n\n" + ratioMessage;
					resizedImages.push({
						"type": "resizedImage",
						"src": src,
						"fileName": fileName,
						"width": width,
						"height": height,
						"naturalWidth": naturalWidth,
						"naturalHeight": naturalHeight
					});
				}
			}
			if (resizedImages.length > 0 || numSinglePixelImages > 0) {
				sendResponse({
					"resizedImages": resizedImages,
					"singlePixelImages": singlePixelImages,
					"numSinglePixelImages": numSinglePixelImages
				});
			}
		} else if (request.type === "scrollImageIntoView"){
			var src = request.src;
			var imgElements = document.querySelectorAll("img");
			for (var i = 0; i != imgElements.length; ++i){
				var imgElement = imgElements[i];
				// images may be used more than once, and not always resized
				if (imgElement.src === src && imgElement.dataset.highlighted === "true"){
					imgElement.scrollIntoViewIfNeeded(); // centres in viewport
					imgElement.style.borderStyle = "solid";
				}
			}
		}
});
