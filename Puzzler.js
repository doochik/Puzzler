/**
 * JS object to cut any image for puzzle.
 *
 * v 0.034
 *
 * Copyright (c) 2010 Alexey Androsov <doochik@ya.ru>
 * Licensed under GPLv3
 * http://www.opensource.org/licenses/gpl-3.0.html
 */

/**
 * 
 * @param imageSrc
 * @param xCount
 * @param yCount
 */
var Puzzler = function(imageSrc, type, onComplete, onProgress, debugMode) {
    var image = new Image();

    var self = this;

    var sizes = {
        'small': 40,
        'normal': 60,
        'big': 80
    };

    if (!(type in sizes)) {
        type = 'normal'
    }

    var pieceWidth = sizes[type];
    var pieceHeight = sizes[type];

    // here we're waiting for image load, so prepare array for pieces
    var pieces = [],
        pieceRelations = [];

    var xCount, yCount;

    image.onload = function() {

        xCount = Math.floor(image.width / pieceWidth);
        yCount = Math.floor(image.height / pieceHeight);

        for (var y = 0; y < yCount; y++) {
            pieces[y] = [];
            pieceRelations[y] = [];
            for (var x = 0; x < xCount; x++) {
                pieces[y][x] = [];
                pieceRelations[y][x] = [];
            }
        }

        x = 0;
        y = 0;

        window.setTimeout(function() {
            makePiece(x, y, pieceWidth, pieceHeight);
            x++;
            if (x >= xCount) {
                x = 0;
                y++;
            }

            onProgress(x + (y*xCount), xCount * yCount);

            if (y < yCount) {
                setTimeout(arguments.callee, 10);
            } else {
                onComplete(pieces, xCount, yCount, pieceHeight);
            }
        }, 10);
        

    };

    image.onerror = function() {
        throw new Error("Can't load image");
    };

    image.src = imageSrc;

    function makePiece(x, y, pieceWidth, pieceHeight) {
        var pieceRelation = [
            !def(pieceRelations[y][x][0]) ? (pieceRelations[y][x][0] = y === 0 ? null : relation()) : pieceRelations[y][x][0], //top,
            !def(pieceRelations[y][x][1]) ? (pieceRelations[y][x][1] = x === xCount - 1 ? null : relation()) : pieceRelations[y][x][1], //left
            !def(pieceRelations[y][x][2]) ? (pieceRelations[y][x][2] = y === yCount - 1 ? null : relation()) : pieceRelations[y][x][2], //bottom
            !def(pieceRelations[y][x][3]) ? (pieceRelations[y][x][3] = x === 0 ? null : relation()) : pieceRelations[y][x][3] //right
        ];
        makeNext(pieceRelations, x + 1, y, 3, pieceRelation[1]);
        makeNext(pieceRelations, x, y + 1, 0, pieceRelation[2]);

        var cutter;
        var originalX = pieceWidth * x;
        var originalY = pieceHeight * y;
        var width = pieceWidth;
        var height = pieceHeight;

        var pieceNullX = 0;
        var pieceNullY = 0;

        var canvas = document.createElement('canvas');
        canvas.width = pieceWidth;
        canvas.height = pieceHeight;

        if (pieceRelation[0] !== null) {
            cutter = pieceRelation[0].jigsaw;
            var size = cutter.getSize(pieceHeight, male(pieceRelation[0]));
            canvas.height += size;
            originalY -= size;
            height += size;
            pieceNullY += size;
        }

        if (pieceRelation[1] !== null) {
            cutter = pieceRelation[1].jigsaw;
            size = cutter.getSize(pieceWidth, male(pieceRelation[1]));
            canvas.width += size;
            width += size;
        }

        if (pieceRelation[2] !== null) {
            cutter = pieceRelation[2].jigsaw;
            size = cutter.getSize(pieceHeight, male(pieceRelation[2]));
            canvas.height += size;
            height += size;
        }

        if (pieceRelation[3] !== null) {
            cutter = pieceRelation[3].jigsaw;
            size = cutter.getSize(pieceWidth, male(pieceRelation[3]));
            canvas.width += size;
            originalX -= size;
            width += size;
            pieceNullX += size;
        }

        var canvasContext = canvas.getContext('2d');

        canvasContext.drawImage(
            image,
            originalX, // original x
            originalY, // original y
            width, // original width
            height, // original height
            0, // destination x
            0, // destination y
            width, // destination width
            height // destination height
            );

        var neighbours = {
            /*left: [],
            right: [],
            top: [],
            bottom: []*/
        },
            relationSide;

        if (hasJigsaw(pieceRelation[0])) {
            cutter = pieceRelation[0].jigsaw;
            relationSide = cutter[pieceRelation[0].type + '_0'](canvas, pieceWidth, pieceHeight, pieceNullX, pieceNullY);

            relationSide.attachToSide = 'bottom';
            relationSide.attachToX = x;
            relationSide.attachToY = y - 1;
            relationSide.attachSize = cutter.getSize(pieceHeight);
            neighbours['top'] = relationSide;

            if (debugMode) {
                self.drawPoint(canvas, relationSide.offsetX, relationSide.offsetY);
            }
        }

        if (hasJigsaw(pieceRelation[1])) {
            cutter = pieceRelation[1].jigsaw;
            relationSide = cutter[pieceRelation[1].type + '_1'](canvas, pieceWidth, pieceHeight, pieceNullX, pieceNullY);

            relationSide.attachToSide = 'left';
            relationSide.attachToX = x + 1;
            relationSide.attachToY = y;
            relationSide.attachSize = cutter.getSize(pieceWidth);
            neighbours['right'] = relationSide;

            if (debugMode) {
                self.drawPoint(canvas, relationSide.offsetX, relationSide.offsetY);
            }
        }

        if (hasJigsaw(pieceRelation[2])) {
            cutter = pieceRelation[2].jigsaw;
            relationSide = cutter[pieceRelation[2].type + '_2'](canvas, pieceWidth, pieceHeight, pieceNullX, pieceNullY);

            relationSide.attachToSide = 'top';
            relationSide.attachToX = x;
            relationSide.attachToY = y + 1;
            relationSide.attachSize = cutter.getSize(pieceHeight);
            neighbours['bottom'] = relationSide;

            if (debugMode) {
                self.drawPoint(canvas, relationSide.offsetX, relationSide.offsetY);
            }
        }

        if (hasJigsaw(pieceRelation[3])) {
            cutter = pieceRelation[3].jigsaw;
            relationSide = cutter[pieceRelation[3].type + '_3'](canvas, pieceWidth, pieceHeight, pieceNullX, pieceNullY);

            relationSide.attachToSide = 'right';
            relationSide.attachToX = x - 1;
            relationSide.attachToY = y;
            relationSide.attachSize = cutter.getSize(pieceWidth);

            neighbours['left'] = relationSide;

            if (debugMode) {
                self.drawPoint(canvas, relationSide.offsetX, relationSide.offsetY);
            }
        }

        var container = document.createElement('div');
        container.style.cssText = 'position:absolute;height:' + canvas.height + 'px;width:' + canvas.width + 'px';
        container.appendChild(canvas);

        canvas.style.cssText = 'position:absolute;top:0;left:0';

        var piece = {};
        piece[self.pieceKey(x, y)] = {
            canvas: canvas,
            width: pieceWidth,
            height: pieceHeight,
            offsetX: pieceNullX,
            offsetY: pieceNullY,
            neighbours: neighbours
        };

        pieces[y][x] = {
            pieces: piece,
            container: container
        }
    }

    function relation() {
        return {
            type: Math.round(Math.random()) === 1 ? 'male' : 'female',
            jigsaw: self.getRandomJigsaw()
        };
    }

    function makeNext(pieceRelations, x, y, pos, myVal) {
        if (myVal !== null) {
            pieceRelations[y][x][pos] = {
                type: myVal.type === 'male' ? 'female' : 'male',
                jigsaw: myVal.jigsaw
            };
        }
    }

    function def(arg) {
        return typeof arg !== 'undefined';
    }

    function male(relation) {
        return relation && relation.type === 'male';
    }

    function female(relation) {
        return relation && relation.type === 'female';
    }

    function hasJigsaw(relation) {
        return relation && relation.jigsaw;
    }
};

Puzzler.prototype = {

    drawPoint: function(canvas, x, y) {
        var canvasContext = canvas.getContext('2d');

        canvasContext.beginPath();
        canvasContext.strokeStyle = '#F00';
        canvasContext.moveTo(x - 1, y - 1);
        canvasContext.lineTo(x, y);
        canvasContext.stroke();
        canvasContext.closePath();
    },
    
    /**
     *
     * @param x
     * @param y
     */
    pieceKey: function(x, y) {
        return y + '-' + x;
    },

    pieceKeyToArray: function(key) {
        return key.split('-');
    },

    /**
     * Merge two pieces into one container.
     * It's simpler than merge two canvas into one.
     * @param container1
     * @param container2
     * @param {String} piece1ConnectingSide
     * @return {Node}
     */
    mergePieces: function(container1, piece1Index, piece1ConnectingSide, container2) {
        var side1,
            side2;

        var connectTopAndBottom = piece1ConnectingSide === 'bottom';

        var piece1 = container1.pieces[piece1Index];//TODO: rename piece1Connector
        side1 = piece1.neighbours[piece1ConnectingSide];

        var piece2 = container2.pieces[this.pieceKey(side1.attachToX, side1.attachToY)];
        side2 = piece2.neighbours[side1.attachToSide];

        var width1 = piece1.canvas.width,
            width2 = piece2.canvas.width,
            height1 = piece1.canvas.height,
            height2 = piece2.canvas.height;

        var tabSize = side1.attachSize;


        var newWidth, newHeight;

        if (connectTopAndBottom) {
            newWidth = Math.max(side1.offsetX, side2.offsetX) // left offset
            + Math.max(width1 - side1.offsetX, width2 - side2.offsetX); // right offset;;

            newHeight = height1 + height2 - tabSize;

        } else {
            newWidth = width1 + width2 - tabSize;

            newHeight = Math.max(side1.offsetY, side2.offsetY) // top offset
            + Math.max(height1 - side1.offsetY, height2 - side2.offsetY); // bottom offset;

        }

        var newLeft = parseInt(container2.container.style.left, 10) - parseInt(container1.container.style.left, 10);
        var newTop = parseInt(container2.container.style.top, 10) - parseInt(container1.container.style.top, 10);

        for (var mergePieceIndex in container2.pieces) {
            var mergePiece = container2.pieces[mergePieceIndex];

            mergePiece.canvas.style.top = (parseInt(mergePiece.canvas.style.top, 10) + newTop) + 'px';
            mergePiece.canvas.style.left = (parseInt(mergePiece.canvas.style.left, 10) + newLeft) + 'px';
            container1.container.appendChild(mergePiece.canvas);

            for (var mergePieceNeighbourIndex in mergePiece.neighbours) {
                var mergePieceNeighbour = mergePiece.neighbours[mergePieceNeighbourIndex];
                mergePieceNeighbour.offsetX += newLeft;
                mergePieceNeighbour.offsetY += newTop;
            }

            container1.pieces[mergePieceIndex] = mergePiece;
        }

        container2.container.parentNode.removeChild(container2.container);

//        this._fixDuplicateConnectors(container1, 'right', 'left');
//        this._fixDuplicateConnectors(container1, 'bottom', 'top');
        this._deleteDuplicateConnectorsByIndex(container1);

        return container1;
    },

    _fixDuplicateConnectors: function(container1, checkSide, connectToSide) {
        for (var piece1Index in container1.pieces) {
            var piece1 = container1.pieces[piece1Index],
                piece1Connector = piece1.neighbours[checkSide];

            if (piece1Connector) {
                for (var piece2Index in container1.pieces) {
                    var piece2 = container1.pieces[piece2Index],
                        piece2Connector = piece2.neighbours[connectToSide];

                    if (piece2Connector) {
                        if (piece1Connector.offsetX === piece2Connector.offsetX
                            && piece1Connector.offsetY === piece2Connector.offsetY) {

                            delete piece1.neighbours[checkSide];
                            delete piece2.neighbours[connectToSide];
                        }
                    }
                }
            }
        }
    },

    _oppositeSide: {
        'right': 'left',
        'left': 'right',
        'top': 'bottom',
        'bottom': 'top'
    },

    /**
     * Delete duplicate connectors by its index.
     * Piece[3][4]['left'] delete Piece[3][3]['right'].
     * @param container
     */
    _deleteDuplicateConnectorsByIndex: function(container) {
        var pieces = container.pieces;

        for (var piece1Index in pieces) {
            var piece1 = pieces[piece1Index],
                piece1Neighbours = piece1.neighbours;

            for (var connectionSide in piece1Neighbours) {
                var connectorParams = piece1Neighbours[connectionSide];
                var connectorSide = this._oppositeSide[connectionSide];
                var neighbour = pieces[this.pieceKey(connectorParams.attachToX, connectorParams.attachToY)];
                if (neighbour && neighbour.neighbours && neighbour.neighbours[connectorSide]) {
                    delete neighbour.neighbours[connectorSide];
                    delete piece1Neighbours[connectionSide];
                }
            }

            /*if (piece1Connector) {
                for (var piece2Index in container.pieces) {
                    var piece2 = container.pieces[piece2Index],
                        piece2Connector = piece2.neighbours[connectToSide];

                    if (piece2Connector) {
                        if (piece1Connector.offsetX === piece2Connector.offsetX
                            && piece1Connector.offsetY === piece2Connector.offsetY) {

                            delete piece1.neighbours[checkSide];
                            delete piece2.neighbours[connectToSide];
                        }
                    }
                }
            }*/
        }
    },

    getRandomJigsaw: function() {
        return this.jigsaws[this.getRandomInt(0, this.jigsawsLength - 1)];     
    },

    /**
     * Returns a random integer between min and max
     * @see https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Math/random
     * @param {Number} min
     * @param {Number} max
     * @return {Number}
     */
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    jigsaws: [
        
    ],

    jigsawsLength: 0

};

Puzzler.addJigsaw = function(name, jigsaw) {
    if (name in Puzzler.prototype.jigsaws) {
        throw new Error('Jigsaw with such name is already exists.')
    }

    Puzzler.prototype.jigsaws.push(jigsaw);
    Puzzler.prototype.jigsawsLength++;
};

/**
 * Check for canvas support
 * @static
 * @memberOf Puzzler
 * @name Puzzler.support
 * @return {Boolean}
 */
Puzzler.support = function() {
    var canvas = document.createElement('canvas');
    return canvas && canvas.getContext;
};