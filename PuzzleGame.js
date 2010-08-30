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

                x += parseInt(container.childNodes[0].width, 10) + 20;
                $(container).bind('mousedown', {x: i, y: j, container: container}, startDrag);
            }

            x = 0;
            y += 100;
        }
    });

    var blockStart = false;

    function startDrag(e) {
        if (!blockStart) {
            e.data.startX = e.clientX;
            e.data.startY = e.clientY;

            e.data.startLeft = parseInt(this.style.left, 10);
            e.data.startTop = parseInt(this.style.top, 10);

            $(document).bind('mousemove.movepuzzle', e.data, continueDrag);
            $(document).bind('mouseup.movepuzzle', e.data, stopDrag);
        }
    }

    function continueDrag(e) {
        var data = e.data;

        data.container.style.top = (data.startTop + (e.clientY - data.startY)) + 'px';
        data.container.style.left = (data.startLeft + (e.clientX - data.startX)) + 'px';
    }

    function stopDrag(e) {
        $(document).unbind('.movepuzzle');

        var movedElement = puzzles[e.data.y][e.data.x],
            movedElementContainer = movedElement.container,
            top = parseInt(movedElementContainer.style.top, 10),
            left = parseInt(movedElementContainer.style.left, 10);

        for (var pieceIndex in movedElement.pieces) {
            var piece = movedElement.pieces[pieceIndex];

            for (var myAttachSideName in piece.neighbours) {
                var myAttachSide = piece.neighbours[myAttachSideName];

                var neighbour = puzzles[myAttachSide.attachToY][myAttachSide.attachToX];

                var neighbourContainer = neighbour.container,
                    neighbourLeft = parseInt(neighbourContainer.style.left, 10),
                    neighbourTop = parseInt(neighbourContainer.style.top, 10);

                var neighbourSide = neighbour.pieces[Puzz.pieceKey(myAttachSide.attachToX, myAttachSide.attachToY)].neighbours[myAttachSide.attachToSide],
                    neighbourX = neighbourSide.offsetX + neighbourLeft,
                    neighbourY = neighbourSide.offsetY + neighbourTop;

                var distance = Math.sqrt(Math.pow((myAttachSide.offsetX + left) - neighbourX, 2) + Math.pow((myAttachSide.offsetY + top) - neighbourY, 2));

                if (distance < 20) {
                    blockStart = true;
                    $(movedElementContainer).animate({
                        left: neighbourX - myAttachSide.offsetX,
                        top: neighbourY - myAttachSide.offsetY
                    }, function() {
                        piecesCount--;
                        var newElement;
                        // piece1 must be higher/lefter than piece2
                        if (myAttachSideName === 'top' || myAttachSideName === 'left') {
                            newElement = Puzz.mergePieces(neighbour, Puzz.pieceKey(myAttachSide.attachToX, myAttachSide.attachToY), myAttachSide.attachToSide, movedElement);

                        } else {
                            newElement = Puzz.mergePieces(movedElement, pieceIndex, myAttachSideName, neighbour);
                        }

                        for (var key in newElement.pieces) {
                            key = Puzz.pieceKeyToArray(key);
                            puzzles[key[0]][key[1]] = newElement;
                        }

                        if (piecesCount === 1) {
                            alert('ta-dam!');
                        }
                        blockStart = false;
                    });
                    return;
                }
            }
        }
    }

}

PuzzleGame.prototype = function() {
    
};