function PuzzleGame(node, url, countX, countY) {
    var puzzles,

        piecesCount = countX*countY;

    var Puzz = new Puzzler(url, countX, countY, function(pieces) {
        node.innerHTML = 'Ready!';
        puzzles = pieces;

        var x = 0, y = 0;

        for (var j = 0; j < countY; j++) {
            for (var i = 0; i < countX; i++) {
            
                var container = pieces[j][i].container;

                container.setAttribute('data-puzzle-x', i);
                container.setAttribute('data-puzzle-y', j);

                node.appendChild(container);

                container.style.top = y + 'px';
                container.style.left = x + 'px';

                x += parseInt(container.childNodes[0].width, 10) + 20;
                container.addEventListener('mousedown', startDrag, false);
            }

            x = 0;
            y += 100;
        }
    });

    var blockStart = false;

    var startX, startY, startLeft, startTop, movedContainer;

    function startDrag(e) {
        if (!blockStart) {
            startX = e.clientX;
            startY = e.clientY;

            startLeft = parseInt(this.style.left, 10);
            startTop = parseInt(this.style.top, 10);

            movedContainer = this;

            document.addEventListener('mousemove', continueDrag, false);
            document.addEventListener('mouseup', stopDrag, false);
        }
    }

    function continueDrag(e) {
        movedContainer.style.top = (startTop + (e.clientY - startY)) + 'px';
        movedContainer.style.left = (startLeft + (e.clientX - startX)) + 'px';
    }

    function stopDrag(e) {
        document.removeEventListener('mousemove', continueDrag, false);
        document.removeEventListener('mouseup', stopDrag, false);

        var x = movedContainer.getAttribute('data-puzzle-x');
        var y = movedContainer.getAttribute('data-puzzle-y');

        var movedElement = puzzles[y][x],
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
                            var container = puzzles[0][0].container;
                            container.removeEventListener('mousedown', startDrag, false);
                            puzzles = null;
                            Puzz = null;
                            container.style.top = 0;
                            container.style.left = 0;
                            var h1 = document.createElement('h1');
                            h1.innerHTML = 'Done!';
                            document.body.appendChild(h1);
                        }
                        blockStart = false;
                    });
                    return;
                }
            }
        }

        movedContainer = null;
    }

}

PuzzleGame.prototype = function() {
    
};