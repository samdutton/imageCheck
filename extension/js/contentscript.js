
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse){
		var resizedImages = [];
		var numImgElements = 0;
    if (request.type == "sendResizedImages") {
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
				if (!(naturalWidth == 1 && naturalHeight == 1) && // ignore 1x1px images
					(width != naturalWidth || height != naturalHeight)) {
					img.style.border= "10px dotted red";
					var ratioMessage = "";
					var naturalAspectRatio = (naturalWidth/naturalHeight).toFixed(3);
					var aspectRatio = (width/height).toFixed(3);
					if (naturalAspectRatio !== aspectRatio) {
						ratioMessage = "Resized image has changed aspect ratio (width/height):" +
							"\n- natural " + naturalAspectRatio +
							"\n- resized " + aspectRatio;
					}
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
			if (resizedImages.length > 0) {
				sendResponse({"type": "test", "resizedImages": resizedImages});
			}
		}
});
