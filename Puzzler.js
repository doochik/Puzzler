/**
 * 
 * @param imageSrc
 * @param xCount
 * @param yCount
 */
var Puzzler = function(imageSrc, xCount, yCount) {
    var image = new Image(),
        padding = 5;

    image.onload = function() {
        var i = 0,
            j = 0,
            canvas = document.createElement('canvas'),
            canvasContext = canvas.getContext('2d'),
            pieceWidth = Math.round(image.width / xCount),
            pieceHeight = Math.round(image.height / yCount);

        canvas.className = 'canvas';
        canvas.width = image.width + (xCount - 1) * padding;
        canvas.height = image.height + (yCount - 1) * padding;
        document.body.appendChild(canvas);

        for (; i < xCount; i++) {
            for (j = 0; j < yCount; j++) {
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