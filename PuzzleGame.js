function PuzzleGame($node, url, countX, countY) {
    var puzzles;

    new Puzzler(url, countX, countY, function(pieces) {

        puzzles = pieces;

        var x = 0, y = 0;

        for (var j = 0; j < countY; j++) {
            for (var i = 0; i < countX; i++) {
            
                var canvas = pieces[j][i].canvas;

                $node.append(canvas);

                canvas.style.top = y + 'px';
                canvas.style.left = x + 'px';

                x += canvas.width + 20;
                $(canvas).bind('mousedown', {x: i, y: j}, startDrag);
            }

            x = 0;
            y += 100;
        }
//        console.log(pieces);
    });

    var startX , startY, startTop, startLeft, canvas;

    function startDrag(e) {
        startX = e.clientX;
        startY = e.clientY;

        startTop = parseInt(this.style.top, 10);
        startLeft = parseInt(this.style.left, 10);

        canvas = this;

        $(document).bind('mousemove.movepuzzle', e.data, continueDrag);
        $(document).bind('mouseup.movepuzzle', e.data, stopDrag);
    }

    function continueDrag(e) {
        // new canvas position
        var top = (startTop + (e.clientY - startY)),
            left = (startLeft + (e.clientX - startX));

        canvas.style.top = top + 'px';
        canvas.style.left = left + 'px';


    }

    function stopDrag(e) {
        $(document).unbind('.movepuzzle');

        var piece = puzzles[e.data.y][e.data.x],
            top = parseInt(piece.canvas.style.top, 10),
            left = parseInt(piece.canvas.style.left, 10);

        $.each(piece.neighbours, function(key) {

            var myAttachSide = piece.neighbours[key],

                neighbour = puzzles[this.attachToY][this.attachToX],
                neighbourSide = neighbour.neighbours[this.attachToSide],
                neighbourCanvas = neighbour.canvas,
                neighbourLeft = parseInt(neighbourCanvas.style.left, 10),
                neighbourTop = parseInt(neighbourCanvas.style.top, 10),

                neighbourX = neighbourSide.offsetX + neighbourLeft,
                neighbourY = neighbourSide.offsetY + neighbourTop;

            var distance = Math.sqrt(Math.pow((myAttachSide.offsetX + left) - neighbourX, 2) + Math.pow((myAttachSide.offsetY + top) - neighbourY, 2));

            if (distance < 20) {
                $(piece.canvas).animate({
                    left: neighbourX - myAttachSide.offsetX,
                    top: neighbourY - myAttachSide.offsetY
                });

                return false;
            }

        });
    }

}

PuzzleGame.prototype = function() {
    
};