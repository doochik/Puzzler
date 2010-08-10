/**
 *
 * @param imageSrc
 * @param xCount
 * @param yCount
 */
var Puzzler = function(imageSrc, xCount, yCount) {
    var image = new Image();

    var padding = 5;

    image.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.className = 'canvas';
        canvas.width = image.width + (xCount - 1) * padding;
        canvas.height = image.height + (yCount - 1) * padding;
        document.body.appendChild(canvas);
        var canvasContext = canvas.getContext('2d');

        var pieceWidth = Math.round(image.width / xCount);
        var pieceHeight = Math.round(image.height / yCount);

        for (var i = 0; i < xCount; i++) {
            for (var j = 0; j < yCount; j++) {
                canvasContext.drawImage(
                    image,
                    pieceWidth * i, // original x
                    pieceHeight * j, // original y
                    pieceWidth, // original width
                    pieceHeight, // original height
                    pieceWidth * i + i * padding, // destination x
                    pieceHeight * j + j * padding, // destination y
                    pieceWidth, // destination width
                    pieceHeight // destination height
                    );
            }
        }

    };

    image.onerror = function() {
        throw new Error("Can't load image");
    };

    image.src = imageSrc;
};