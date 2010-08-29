function PuzzleGame($node, url, countX, countY) {
    var puzzles,

        piecesCount = countX*countY;

    var Puzz = new Puzzler(url, countX, countY, function(pieces) {

        puzzles = pieces;

        var x = 0, y = 0;

        for (var j = 0; j < countY; j++) {
            for (var i = 0; i < countX; i++) {
            
                var container = pieces[j][i].container;

                $node.append(container);

                container.style.top = y + 'px';
                container.style.left = x + 'px';

                x += parseInt(pieces[j][i].canvas[0].width, 10) + 20;
                $(container).bind('mousedown', {x: i, y: j, container: container}, startDrag);
            }

            x = 0;
            y += 100;
        }
    });

    var startX , startY, startTop, startLeft, canvas, blockStart = false;

    function startDrag(e) {
        if (!blockStart) {
            startX = e.clientX;
            startY = e.clientY;

            startTop = parseInt(this.style.top, 10);
            startLeft = parseInt(this.style.left, 10);

            $(document).bind('mousemove.movepuzzle', e.data, continueDrag);
            $(document).bind('mouseup.movepuzzle', e.data, stopDrag);
        }
    }

    function continueDrag(e) {
        // new canvas position
        var top = (startTop + (e.clientY - startY)),
            left = (startLeft + (e.clientX - startX));

        e.data.container.style.top = top + 'px';
        e.data.container.style.left = left + 'px';


    }

    //TODO: если большой кусок стыкуется с маленьким, то потом ничего не стыкуется 

    function stopDrag(e) {
        $(document).unbind('.movepuzzle');

        var piece = puzzles[e.data.y][e.data.x],
            top = parseInt(piece.container.style.top, 10),
            left = parseInt(piece.container.style.left, 10);

        var exit = false;

        $.each(piece.neighbours, function(key) {

            var mySide = this;
            $.each(this, function(myIndex) {

                var myAttachSide = this,
                    neighbour = puzzles[myAttachSide.attachToY][myAttachSide.attachToX],
                    neighbourContainer = neighbour.container,
                    neighbourLeft = parseInt(neighbourContainer.style.left, 10),
                    neighbourTop = parseInt(neighbourContainer.style.top, 10);

                var ret = $.each(neighbour.neighbours[myAttachSide.attachToSide], function(neighbourIndex){

                    var neighbourSide = this,
                        neighbourX = neighbourSide.offsetX + neighbourLeft,
                        neighbourY = neighbourSide.offsetY + neighbourTop;

                    var distance = Math.sqrt(Math.pow((myAttachSide.offsetX + left) - neighbourX, 2) + Math.pow((myAttachSide.offsetY + top) - neighbourY, 2));

                    if (distance < 20) {
                        blockStart = true;
                        $(piece.container).animate({
                            left: neighbourX - myAttachSide.offsetX,
                            top: neighbourY - myAttachSide.offsetY
                        }, function() {
                            piecesCount--;
                            var newElement = Puzz.mergePieces(piece, myIndex, neighbour, neighbourIndex, key);

                            for (var i = 0, j = newElement.position.length; i < j; i++) {
                                var pos = newElement.position[i];
                                puzzles[pos[0]][pos[1]] = newElement;
                            }

                            if (piecesCount === 1) {
                                alert('ta-dam!');
                            }
                            blockStart = false;
                        });
                        exit = true;
                        return false;
                    }
                });

                if (exit) {
                    return false;
                }
            });

            if (exit) {
                return false;
            }
        });
    }

}

PuzzleGame.prototype = function() {
    
};