/**
 * JS object to cut any image for puzzle
 *
 * Copyright (c) 2010 Alexey Androsov <doochik@ya.ru>
 * Licensed under GPLv3
 * http://www.opensource.org/licenses/gpl-3.0.html
 */


//TODO: разрезать по парам
//TODO: сделать вариант с круглыми уголками

/**
 * 
 * @param imageSrc
 * @param xCount
 * @param yCount
 */
var Puzzler = function(imageSrc, xCount, yCount) {
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
                canvas.id = 'part' + x + '-' + y;
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

                canvasContext.fillStyle = 'red';
                canvasContext.font = '20px sans-serif';
                if (pieceRelations[y][x][0] !== null) {


                    if (pieceRelations[y][x][0] === false) {
                        cutter.female_0(canvas, pieceWidth, pieceHeight, pieceNullX, pieceNullY);
                    }

                    if (pieceRelations[y][x][0] === true) {
                        cutter.male_0(canvas, pieceWidth, pieceHeight, pieceNullX, pieceNullY);
                    }

                    canvasContext.fillText(pieceRelations[y][x][0] + 0, pieceWidth/2, 20);
                }

                if (pieceRelations[y][x][1] !== null) {


                    if (pieceRelations[y][x][1] === false) {
                        cutter.female_1(canvas, pieceWidth, pieceHeight, pieceNullX, pieceNullY);
                    }

                    if (pieceRelations[y][x][1] === true) {
                        cutter.male_1(canvas, pieceWidth, pieceHeight, pieceNullX, pieceNullY);
                    }

                    canvasContext.fillText(pieceRelations[y][x][1] + 0, pieceWidth - 20, pieceHeight/2);
                }

                if (pieceRelations[y][x][2] !== null) {


                    if (pieceRelations[y][x][2] === false) {
                        cutter.female_2(canvas, pieceWidth, pieceHeight, pieceNullX, pieceNullY);
                    }

                    if (pieceRelations[y][x][2] === true) {
                        cutter.male_2(canvas, pieceWidth, pieceHeight, pieceNullX, pieceNullY);
                    }

                    canvasContext.fillText(pieceRelations[y][x][2] + 0, pieceWidth/2, pieceHeight - 10);
                }

                if (pieceRelations[y][x][3] !== null) {


                    if (pieceRelations[y][x][3] === false) {
                        cutter.female_3(canvas, pieceWidth, pieceHeight, pieceNullX, pieceNullY);
                    }

                    if (pieceRelations[y][x][3] === true) {
                        cutter.male_3(canvas, pieceWidth, pieceHeight, pieceNullX, pieceNullY);
                    }

                    canvasContext.fillText(pieceRelations[y][x][3] + 0, 0, pieceHeight/2);
                }

                document.getElementsByClassName('dest')[0].appendChild(canvas);
                canvas.style.top = (y * (pieceHeight + 60)) + 'px';
                canvas.style.left = (x * (pieceWidth + 60)) + 'px';

                pieces[y][x] = canvas;
            }
        }

        console.log(pieces);
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

            //TODO: не вырезать дату полного изображения
            //TODO: не бегать по всей длине/высоте
            male_0: function(canvas, width, height, x, y) {
                var rw = width / 3,
                    x1 = Math.round(rw + x),
                    y1 = 0,
                    x2 = Math.round(rw*2 + x),
                    y2 = Math.round(height * this._size);

                this._rectV(canvas.getContext('2d'), x1, y1, x2, y2);
                this._makeTransparent(canvas, 0, 0, canvas.width, y2, false);
            },

            male_1: function(canvas, width, height, x, y) {
                var rh = height / 3,
                    x1 = Math.round(canvas.width),
                    y1 = Math.round(rh + y),
                    x2 = Math.round(width + x),
                    y2 = Math.round(rh*2 + y);

                this._rectH(canvas.getContext('2d'), x1, y1, x2, y2);
                this._makeTransparent(canvas, x2, 0, canvas.width, canvas.height, false);
            },

            male_2: function(canvas, width, height, x, y) {
                var rw = width / 3,
                    x1 = Math.round(rw + x),
                    y1 = Math.round(canvas.height),
                    x2 = Math.round(rw*2 + x),
                    y2 = Math.round(height + y);

                this._rectV(canvas.getContext('2d'), x1, y1, x2, y2);
                this._makeTransparent(canvas, 0, y2, canvas.width, canvas.height, false);
            },

            male_3: function(canvas, width, height, x, y) {
                var rh = height / 3,
                    x1 = 0,
                    y1 = Math.round(rh + y),
                    x2 = Math.round(width * this._size),
                    y2 = Math.round(rh*2 + y);

                this._rectH(canvas.getContext('2d'), x1, y1, x2, y2);
                this._makeTransparent(canvas, 0, 0, x2, canvas.height, false);
            },

            female_0: function(canvas, width, height, x, y) {
                var rw = width / 3,
                    x1 = Math.round(rw + x),
                    y1 = Math.round(0 + y),
                    x2 = Math.round(rw*2 + x),
                    y2 = Math.round(height * this._size + y);

                this._rectV(canvas.getContext('2d'), x1, y1, x2, y2);
                this._makeTransparent(canvas, 0, 0, canvas.width, y2, true);
            },

            female_1: function(canvas, width, height, x, y) {
                var rh = height / 3,
                    x1 = Math.round(width + x),
                    y1 = Math.round(rh + y),
                    x2 = Math.round(width * (1 - this._size) + x),
                    y2 = Math.round(rh*2 + y);

                this._rectH(canvas.getContext('2d'), x1, y1, x2, y2);
                this._makeTransparent(canvas, x2, 0, canvas.width, canvas.height, true);
            },

            female_2: function(canvas, width, height, x, y) {
                var rw = width / 3,
                    x1 = Math.round(rw + x),
                    y1 = Math.round(height + y),
                    x2 = Math.round(rw*2 + x),
                    y2 = Math.round(height * (1 - this._size) + y);

                this._rectV(canvas.getContext('2d'), x1, y1, x2, y2);
                this._makeTransparent(canvas, 0, y2, canvas.width, canvas.height, true);
            },

            female_3: function(canvas, width, height, x, y) {
                var rh = height / 3,
                    x1 = Math.round(0 + x),
                    y1 = Math.round(rh + y),
                    x2 = Math.round(width * this._size + x),
                    y2 = Math.round(rh*2 + y);

                this._rectH(canvas.getContext('2d'), x1, y1, x2, y2);
                this._makeTransparent(canvas, 0, 0, x2, canvas.height, true);
            },

            getSize: function(size) {
                return size*this._size;
            }
        }
    ]

};

function getIdxForCanvasData(canvas, x, y) {
        return (x + y * canvas.width) * 4;
    }