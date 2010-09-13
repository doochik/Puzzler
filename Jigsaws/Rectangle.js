(function() {

    var jigsaw =
    {
            name: 'rectangle',

            _transparentData: document.createElement('canvas').getContext('2d').createImageData(1,1),

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
                    i, j;

                for (i = x1; i < x2; i++) {
                    for (j = y1; j < y2; j++) {
                        // bitwise XOR
                        // inPath ^ true === 0
                        // !inPath ^ false === 0
                        if ((context.isPointInPath(i, j) ^ female) === 0) {
                            context.putImageData(this._transparentData, i, j);
                        }
                    }
                }
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
        };

    Puzzler.addJigsaw('rectangle', jigsaw);
})();