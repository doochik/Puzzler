function PuzzleGame(node, url, size) {
    var puzzles,
        puzzlesInOrder = [],
        piecesCount;

    var Puzz = new Puzzler(url, size, function(pieces, countX, countY, size) {
        puzzles = pieces;

        for (y = 0; y < countY; y++) {
            puzzlesInOrder[y] = [].concat(puzzles[y]);
        }

        piecesCount = countX*countY;

        var x = 0, y = 0;

        // shuffle
        for (y = 0; y < countY; y++) {
            for (x = 0; x < countX; x++) {
                var random = Math.floor(Math.random() * countX * countY);
                //x = [y, y = x][0]
                var tempX = random % countY;
                var tempY = Math.floor(random / countX);
                var temp = puzzles[tempY][tempX];
                puzzles[tempY][tempX] = puzzles[y][x];
                puzzles[y][x] = temp;
            }
        }

        x = 0; y = 0;

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

        init();
    }, function(complete, all) {
        node.innerHTML = 'Prepare pieces: ' + complete + '/' + all;    
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

                var neighbour = puzzlesInOrder[myAttachSide.attachToY][myAttachSide.attachToX];

                var neighbourContainer = neighbour.container,
                    neighbourLeft = parseInt(neighbourContainer.style.left, 10),
                    neighbourTop = parseInt(neighbourContainer.style.top, 10);

                var neighbourSide = neighbour.pieces[Puzz.pieceKey(myAttachSide.attachToX, myAttachSide.attachToY)].neighbours[myAttachSide.attachToSide],
                    neighbourX = neighbourSide.offsetX + neighbourLeft,
                    neighbourY = neighbourSide.offsetY + neighbourTop;

                var distance = Math.sqrt(Math.pow((myAttachSide.offsetX + left) - neighbourX, 2) + Math.pow((myAttachSide.offsetY + top) - neighbourY, 2));

                if (distance < 20) {
                    blockStart = true;
                    animate(movedElementContainer, {
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
                            puzzlesInOrder[key[0]][key[1]] = newElement;
                        }

                        if (piecesCount === 1) {
                            var container = puzzles[0][0].container;
                            container.removeEventListener('mousedown', startDrag, false);
                            puzzles = null;
                            Puzz = null;
                            container.style.top = 0;
                            container.style.left = 0;

                            var first = puzzlesInOrder[0][0].container,
                                top = parseInt(first.style.top, 10),
                                left = parseInt(first.style.left, 10),
                                canvaces = container.getElementsByTagName('canvas');

                            for (var i = 0, j = canvaces.length; i < j; i++) {
                                var canvas = canvaces[i];
                                canvas.style.top = (parseInt(canvas.style.top, 10) + top) + 'px';
                                canvas.style.left = (parseInt(canvas.style.left, 10) + top) + 'px';
                            }


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

    //TODO: safari animation
    function animate(div, css, callback) {
        doAnimate();

        function doAnimate() {
            var setTimer = false;
            for (var property in css) {
                var value = parseInt(div.style[property], 10);
                if (value != css[property]) {
                    div.style[property] = (value + (value < css[property] ? 1 : -1)) + 'px';
                    setTimer = true;
                }
            }

            if (setTimer) {
                window.setTimeout(doAnimate, 25);
            } else {
                callback();
            }
        }
    }

}

PuzzleGame.prototype = function() {
    
};

/**
 * @see http://ross.posterous.com/2008/08/19/iphone-touch-events-in-javascript
 */
function touchHandler(event)
{
    var touches = event.changedTouches,
        first = touches[0],
        type = "";


    // don't block resize, scroll and other gestures
    // drag and drop must work only on canvas elements
	if (touches.length > 1 || first.target.nodeName !== 'CANVAS') {
		return;
	}

         switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type="mousemove"; break;
        case "touchend":   type="mouseup"; break;
        default: return;
    }

             //initMouseEvent(type, canBubble, cancelable, view, clickCount,
    //           screenX, screenY, clientX, clientY, ctrlKey,
    //           altKey, shiftKey, metaKey, button, relatedTarget);

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1,
                              first.screenX, first.screenY,
                              first.clientX, first.clientY, false,
                              false, false, false, 0/*left*/, null);

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
    event.stopPropagation();
}

function init()
{
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);
}
