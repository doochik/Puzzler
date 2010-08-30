/**
 * JS object to cut any image for puzzle.
 *
 * v 0.01
 *
 * Copyright (c) 2010 Alexey Androsov <doochik@ya.ru>
 * Licensed under GPLv3
 * http://www.opensource.org/licenses/gpl-3.0.html
 */


//TODO: разрезать по парам
//TODO: сделать вариант с круглыми уголками
//TODO: сверху - ceil, снизу floor

/**
 * 
 * @param imageSrc
 * @param xCount
 * @param yCount
 */
var Puzzler = function(imageSrc, xCount, yCount, callback) {
    var image = new Image();

    var pieces = [],
        pieceRelations = [];

    var self = this;

    image.onload = function() {
        var x = 0,
            y = 0,
            pieceWidth = Math.round(image.width / xCount),
            pieceHeight = Math.round(image.height / yCount);

        for (y = 0; y < yCount; y++) {

            pieces[y] = [];
            
            if (!def(pieceRelations[y])) {
                pieceRelations[y] = [];
            }

            for (x = 0; x < xCount; x++) {

                if (!def(pieceRelations[y][x])) {
                    pieceRelations[y][x] = [];
                }

                if (!def(pieceRelations[y][x][0])) {
                    pieceRelations[y][x][0] = y === 0 ? null : relation(); //top
                }

                if (!def(pieceRelations[y][x][1])) {
                    pieceRelations[y][x][1] = x === xCount - 1 ? null : relation(); //left
                }
                makeNext(x + 1, y, 3, pieceRelations[y][x][1]);

                if (!def(pieceRelations[y][x][2])) {
                    pieceRelations[y][x][2] = y === yCount - 1 ? null : relation(); //bottom
                }
                makeNext(x, y + 1, 0, pieceRelations[y][x][2]);

                if (!def(pieceRelations[y][x][3])) {
                    pieceRelations[y][x][3] = x === 0 ? null : relation(); //right
                }

                var cutter = self.getRandomJigsaw();
                var originalX = pieceWidth * x;
                var originalY = pieceHeight * y;
                var width = pieceWidth;
                var height = pieceHeight;

                var pieceNullX = 0;
                var pieceNullY = 0;

                var canvas = document.createElement('canvas');
                canvas.id = 'part' + y + '-' + x;
                canvas.width = pieceWidth;
                canvas.height = pieceHeight;

                if (pieceRelations[y][x][0] === true) {
                    canvas.height += cutter.getSize(pieceHeight);
                    originalY -= cutter.getSize(pieceHeight);
                    height += cutter.getSize(pieceHeight);
                    pieceNullY += cutter.getSize(pieceHeight);
                }

                if (pieceRelations[y][x][1] === true) {
                    canvas.width += cutter.getSize(pieceWidth);
                    width += cutter.getSize(pieceWidth);
                }

                if (pieceRelations[y][x][2] === true) {
                    canvas.height += cutter.getSize(pieceHeight);
                    height += cutter.getSize(pieceHeight);
                }

                if (pieceRelations[y][x][3] === true) {
                    canvas.width += cutter.getSize(pieceWidth);
                    originalX -= cutter.getSize(pieceWidth);
                    width += cutter.getSize(pieceWidth);

                    pieceNullX += cutter.getSize(pieceWidth);
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

                if (pieceRelations[y][x][0] === false) {
                    relationSide = cutter.female_0(canvas, pieceWidth, pieceHeight, pieceNullX, pieceNullY);

                    relationSide.attachToSide = 'bottom';
                    relationSide.attachToX = x;
                    relationSide.attachToY = y - 1;
                    relationSide.attachSize = cutter.getSize(pieceHeight);
                    neighbours['top'] = relationSide;

                    cutter.drawPoint(canvas, relationSide.offsetX, relationSide.offsetY);

                } else if (pieceRelations[y][x][0] === true) {
                    relationSide = cutter.male_0(canvas, pieceWidth, pieceHeight, pieceNullX, pieceNullY);

                    relationSide.attachToSide = 'bottom';
                    relationSide.attachToX = x;
                    relationSide.attachToY = y - 1;
                    relationSide.attachSize = cutter.getSize(pieceHeight);
                    neighbours['top'] = relationSide;

                    cutter.drawPoint(canvas, relationSide.offsetX, relationSide.offsetY);
                }

                if (pieceRelations[y][x][1] === false) {
                    relationSide = cutter.female_1(canvas, pieceWidth, pieceHeight, pieceNullX, pieceNullY);

                    relationSide.attachToSide = 'left';
                    relationSide.attachToX = x + 1;
                    relationSide.attachToY = y;
                    relationSide.attachSize = cutter.getSize(pieceWidth);
                    neighbours['right'] = relationSide;

                    cutter.drawPoint(canvas, relationSide.offsetX, relationSide.offsetY);

                } else if (pieceRelations[y][x][1] === true) {
                    relationSide = cutter.male_1(canvas, pieceWidth, pieceHeight, pieceNullX, pieceNullY);

                    relationSide.attachToSide = 'left';
                    relationSide.attachToX = x + 1;
                    relationSide.attachToY = y;
                    relationSide.attachSize = cutter.getSize(pieceWidth);
                    neighbours['right'] = relationSide;

                    cutter.drawPoint(canvas, relationSide.offsetX, relationSide.offsetY);

                }

                if (pieceRelations[y][x][2] === false) {
                    relationSide = cutter.female_2(canvas, pieceWidth, pieceHeight, pieceNullX, pieceNullY);

                    relationSide.attachToSide = 'top';
                    relationSide.attachToX = x;
                    relationSide.attachToY = y + 1;
                    relationSide.attachSize = cutter.getSize(pieceHeight);
                    neighbours['bottom'] = relationSide;

                    cutter.drawPoint(canvas, relationSide.offsetX, relationSide.offsetY);

                } else if (pieceRelations[y][x][2] === true) {
                    relationSide = cutter.male_2(canvas, pieceWidth, pieceHeight, pieceNullX, pieceNullY);

                    relationSide.attachToSide = 'top';
                    relationSide.attachToX = x;
                    relationSide.attachToY = y + 1;
                    relationSide.attachSize = cutter.getSize(pieceHeight);
                    neighbours['bottom'] = relationSide;

                    cutter.drawPoint(canvas, relationSide.offsetX, relationSide.offsetY);
                }

                if (pieceRelations[y][x][3] === false) {
                    relationSide = cutter.female_3(canvas, pieceWidth, pieceHeight, pieceNullX, pieceNullY);

                    relationSide.attachToSide = 'right';
                    relationSide.attachToX = x - 1;
                    relationSide.attachToY = y;
                    relationSide.attachSize = cutter.getSize(pieceWidth);

                    neighbours['left'] = relationSide;

                    cutter.drawPoint(canvas, relationSide.offsetX, relationSide.offsetY);

                } else if (pieceRelations[y][x][3] === true) {
                    relationSide = cutter.male_3(canvas, pieceWidth, pieceHeight, pieceNullX, pieceNullY);

                    relationSide.attachToSide = 'right';
                    relationSide.attachToX = x - 1;
                    relationSide.attachToY = y;
                    relationSide.attachSize = cutter.getSize(pieceWidth);

                    neighbours['left'] = relationSide;

                    cutter.drawPoint(canvas, relationSide.offsetX, relationSide.offsetY);
                }

                var container = document.createElement('div');
                container.style.cssText = 'position:absolute;height:' + canvas.height + 'px;width:' + canvas.width + 'px';
//                container.style.cssText = 'position:absolute;';
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
        }

        callback(pieces);
    };

    image.onerror = function() {
        throw new Error("Can't load image");
    };

    image.src = imageSrc;

    function relation() {
        return Math.round(Math.random()) === 1;
    }

    function makeNext(x, y, pos, myVal) {
        if (myVal !== null) {
            if (!pieceRelations[y]) {
                pieceRelations[y] = [];
            }

            if (!pieceRelations[y][x]) {
                pieceRelations[y][x] = [];
            }

            pieceRelations[y][x][pos] = !myVal;
        }
    }

    function def(arg) {
        return typeof arg !== 'undefined';
    }
};

Puzzler.prototype = {

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
     * @return {Canvas}
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

        $.each(container2.pieces, function(key) {
            this.canvas.style.top = (parseInt(this.canvas.style.top, 10) + newTop) + 'px';
            this.canvas.style.left = (parseInt(this.canvas.style.left, 10) + newLeft) + 'px';
            container1.container.appendChild(this.canvas);

            $.each(this.neighbours, function(key) {
                this.offsetX += newLeft;
                this.offsetY += newTop;
            });

            container1.pieces[key] = this;
        });
        container2.container.parentNode.removeChild(container2.container);

        this._fixDuplicateConnectors(container1, 'right', 'left');
        this._fixDuplicateConnectors(container1, 'bottom', 'top');

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

    getRandomJigsaw: function() {
        return this.jigsaws[this.getRandomInt(0, this.jigsaws.length - 1)];     
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
        {
            name: 'rectangle',

            /**
             * @param canvas
             * @param x1
             * @param y1
             * @param x2
             * @param y2
             * @param female
             */
            _makeTransparent: function(canvas, x1, y1, x2, y2, female) {
                var context = canvas.getContext('2d'),
                    canvasData = context.getImageData(0, 0, canvas.width, canvas.height),
                    i, j;

                for (i = x1; i < x2; i++) {
                    for (j = y1; j < y2; j++) {
                        // bitwise XOR
                        // inPath ^ true === 0
                        // !inPath ^ false === 0
                        if ((context.isPointInPath(i, j) ^ female) === 0) {
                            var coord = getIdxForCanvasData(canvas, i, j);
                            canvasData.data[coord + 0] = 0;
                            canvasData.data[coord + 1] = 0;
                            canvasData.data[coord + 2] = 0;
                            canvasData.data[coord + 3] = 0;
                        }
                    }
                }


                context.putImageData(canvasData, 0, 0);
            },


            /**
             * Draw rectangle.
             * x1,y1 -------> x2,y1
             *                |
             *                |
             *               \/
             * x1,y2 <------- x2,y2
             * @param canvasContext
             * @param x1
             * @param y1
             * @param x2
             * @param y2
             */
            _rectH: function(canvasContext, x1, y1, x2, y2) {
                canvasContext.beginPath();
                canvasContext.moveTo(x1, y1);
                canvasContext.lineTo(x2, y1);
                canvasContext.lineTo(x2, y2);
                canvasContext.lineTo(x1, y2);
                canvasContext.strokeStyle = 'transparent';
                canvasContext.stroke();
                canvasContext.closePath();
            },

            /**
             * Draw rectangle.
             * x1,y1          x2,y1
             *   |             /\
             *   |             |
             *  \/             |
             * x1,y2 -------> x2,y2
             * @param canvasContext
             * @param x1
             * @param y1
             * @param x2
             * @param y2
             */
            _rectV: function(canvasContext, x1, y1, x2, y2) {
                canvasContext.beginPath();
                canvasContext.moveTo(x1, y1);
                canvasContext.lineTo(x1, y2);
                canvasContext.lineTo(x2, y2);
                canvasContext.lineTo(x2, y1);
                canvasContext.strokeStyle = 'transparent';
                canvasContext.stroke();
                canvasContext.closePath();
            },

            /**
             * Размер.
             * @type Number
             */
            _size: 0.2,

            drawPoint: function(canvas, x, y) {
                var canvasContext = canvas.getContext('2d');

                canvasContext.beginPath();
                canvasContext.strokeStyle = '#F00';
                canvasContext.moveTo(x - 1, y - 1);
                canvasContext.lineTo(x, y);
                canvasContext.stroke();
                canvasContext.closePath();
            },

            //TODO: не вырезать дату полного изображения
            //TODO: не бегать по всей длине/высоте
            //TODO: offsetX считается по-разному
            male_0: function(canvas, width, height, x, y) {
                var rw = width / 3,
                    x1 = Math.round(rw + x),
                    y1 = 0,
                    x2 = Math.round(rw*2 + x),
                    y2 = Math.round(height * this._size);

                this._rectV(canvas.getContext('2d'), x1, y1, x2, y2);
                this._makeTransparent(canvas, 0, 0, canvas.width, y2, false);

                return {
                    type: 'male',
                    offsetX: Math.round((x1 - x2) / 2 + x2),
                    offsetY: Math.round((y2 - y1) / 2 + y1)
                };
            },

            male_1: function(canvas, width, height, x, y) {
                var rh = height / 3,
                    x1 = Math.round(canvas.width),
                    y1 = Math.round(rh + y),
                    x2 = Math.round(width + x),
                    y2 = Math.round(rh*2 + y);

                this._rectH(canvas.getContext('2d'), x1, y1, x2, y2);
                this._makeTransparent(canvas, x2, 0, canvas.width, canvas.height, false);

                return {
                    type: 'male',
                    offsetX: Math.round((x1 - x2) / 2 + x2),
                    offsetY: Math.round((y2 - y1) / 2 + y1)
                };
            },

            male_2: function(canvas, width, height, x, y) {
                var rw = width / 3,
                    x1 = Math.round(rw + x),
                    y1 = Math.round(canvas.height),
                    x2 = Math.round(rw*2 + x),
                    y2 = Math.round(height + y);

                this._rectV(canvas.getContext('2d'), x1, y1, x2, y2);
                this._makeTransparent(canvas, 0, y2, canvas.width, canvas.height, false);

                return {
                    type: 'male',
                    offsetX: Math.round((x1 - x2) / 2 + x2),
                    offsetY: Math.round((y2 - y1) / 2 + y1)
                };
            },

            male_3: function(canvas, width, height, x, y) {
                var rh = height / 3,
                    x1 = 0,
                    y1 = Math.round(rh + y),
                    x2 = Math.round(width * this._size),
                    y2 = Math.round(rh*2 + y);

                this._rectH(canvas.getContext('2d'), x1, y1, x2, y2);
                this._makeTransparent(canvas, 0, 0, x2, canvas.height, false);

                return {
                    type: 'male',
                    offsetX: Math.round((x1 - x2) / 2 + x2),
                    offsetY: Math.round((y2 - y1) / 2 + y1)
                };
            },

            female_0: function(canvas, width, height, x, y) {
                var rw = width / 3,
                    x1 = Math.round(rw + x),
                    y1 = Math.round(0 + y),
                    x2 = Math.round(rw*2 + x),
                    y2 = Math.round(height * this._size + y);

                this._rectV(canvas.getContext('2d'), x1, y1, x2, y2);
                this._makeTransparent(canvas, 0, 0, canvas.width, y2, true);

                return {
                    type: 'female',
                    offsetX: Math.round((x2 - x1) / 2 + x1),
                    offsetY: Math.round((y2 - y1) / 2 + y1)
                };
            },

            female_1: function(canvas, width, height, x, y) {
                var rh = height / 3,
                    x1 = Math.round(width + x),
                    y1 = Math.round(rh + y),
                    x2 = Math.round(width * (1 - this._size) + x),
                    y2 = Math.round(rh*2 + y);

                this._rectH(canvas.getContext('2d'), x1, y1, x2, y2);
                this._makeTransparent(canvas, x2, 0, canvas.width, canvas.height, true);

                return {
                    type: 'female',
                    offsetX: Math.round((x2 - x1) / 2 + x1),
                    offsetY: Math.round((y2 - y1) / 2 + y1)
                };
            },

            female_2: function(canvas, width, height, x, y) {
                var rw = width / 3,
                    x1 = Math.round(rw + x),
                    y1 = Math.round(height + y),
                    x2 = Math.round(rw*2 + x),
                    y2 = Math.round(height * (1 - this._size) + y);

                this._rectV(canvas.getContext('2d'), x1, y1, x2, y2);
                this._makeTransparent(canvas, 0, y2, canvas.width, canvas.height, true);

                return {
                    type: 'female',
                    offsetX: Math.round((x2 - x1) / 2 + x1),
                    offsetY: Math.round((y2 - y1) / 2 + y1)
                };
            },

            female_3: function(canvas, width, height, x, y) {
                var rh = height / 3,
                    x1 = Math.round(0 + x),
                    y1 = Math.round(rh + y),
                    x2 = Math.round(width * this._size + x),
                    y2 = Math.round(rh*2 + y);

                this._rectH(canvas.getContext('2d'), x1, y1, x2, y2);
                this._makeTransparent(canvas, 0, 0, x2, canvas.height, true);

                return {
                    type: 'female',
                    offsetX: Math.round((x2 - x1) / 2 + x1),
                    offsetY: Math.round((y2 - y1) / 2 + y1)
                };
            },

            getSize: function(size) {
                return Math.round(size*this._size);
            }
        }
    ]

};

function getIdxForCanvasData(canvas, x, y) {
        return (x + y * canvas.width) * 4;
    }