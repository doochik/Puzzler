(function() {

    var jigsaw = {
        name: 'classic',

        beziers: [
            [0,192,0,0,0,0],
            [0,0,448,-224,448,-96],
            [448,-32,384,-32,384,64],
            [384,160,448,192,512,192],
            [576,192,640,160,640,64],
            [640,-32,576,-32,576,-96],
            [576,-224,1024,0,1024,0],
            [1024,0, 1024,192, 1024,192],
            [1024,192, 0,192, 0,192]
        ],

        tabSize: 192,
        waveSize: 136,

        _rotatePoint: function(x, y, degrees) {
            return [
                Math.round(x * Math.cos(Math.PI / 180 * degrees) - y * Math.sin(Math.PI / 180 * degrees)),
                Math.round(x * Math.sin(Math.PI / 180 * degrees) + y * Math.cos(Math.PI / 180 * degrees))
            ];
        },

        /**
         * Поворот фигуры на указанное количество градусов
         * @param degrees
         */
        _rotate: function(degrees) {
            return this.beziers.map(function(curve) {
                return []
                    .concat(this._rotatePoint(curve[0], curve[1], degrees))
                    .concat(this._rotatePoint(curve[2], curve[3], degrees))
                    .concat(this._rotatePoint(curve[4], curve[5], degrees))
            }, this);
        },

        _relationSide: function(type, x1, y1, x2, y2) {
            return {
                type: type,
                offsetX: Math.round((x2 - x1) / 2 + x1),
                offsetY: Math.round((y2 - y1) / 2 + y1)
            };
        },

        male_0: function(canvas, width, height, x, y) {
            var x1 = Math.round(x),
                y1 = 0,
                x2 = Math.round(width + x),
                y2 = y;

            var context = canvas.getContext('2d');

            var xProp = width / 1024;
            var yProp = y / this.tabSize;

            context.beginPath();
            context.strokeStyle = 'transparent';
            this._rotate(180).forEach(function(b, i) {
                if (i === 0) {
                    context.moveTo(b[0] * xProp + width + x, b[1] * yProp + y2);
                }
                context.bezierCurveTo(
                    b[0] * xProp + width + x, b[1] * yProp + y2,
                    b[2] * xProp + width + x, b[3] * yProp + y2,
                    b[4] * xProp + width + x, b[5] * yProp + y2
                    );
            });
            context.stroke();
            context.closePath();

            this._makeTransparent(context, x1, y1, x2, y2 + this.getFemaleSize(height), true);

            return this._relationSide('male', x1, y1, x2, y2 + this.getFemaleSize(height));
        },

        male_1: function(canvas, width, height, x, y) {
            var x1 = Math.round(width + x),
                y1 = Math.round(y),
                x2 = Math.round(canvas.width),
                y2 = Math.round(height + y);

            var context = canvas.getContext('2d');

            var xProp = (x2 - x1) / this.tabSize;
            var yProp = height / 1024;

            context.beginPath();
            context.strokeStyle = 'transparent';
            this._rotate(270).forEach(function(b, i) {
                if (i === 0) {
                    context.moveTo(b[0] * xProp + x1, b[1] * yProp + y2);
                }
                context.bezierCurveTo(b[0] * xProp + x1, b[1] * yProp + y2,
                                      b[2] * xProp + x1, b[3] * yProp + y2,
                                      b[4] * xProp + x1, b[5] * yProp + y2);
            });
            context.stroke();
            context.closePath();

            context.clearRect(x1, 0, x2, y);
            context.clearRect(x1, y + height, x2, canvas.height);

            this._makeTransparent(context, x1 - this.getFemaleSize(width), y1, x2, y2, true);

            return this._relationSide('male', x1, y1, x2, y2);
        },

        male_2: function(canvas, width, height, x, y) {
            var x1 = Math.round(x),
                y1 = Math.round(height + y),
                x2 = Math.round(x + width),
                y2 = Math.round(canvas.height);

            var context = canvas.getContext('2d');

            var xProp = width / 1024;
            var yProp = this.getMaleSize(height) / this.tabSize;

            context.beginPath();
            context.strokeStyle = 'transparent';
            this.beziers.forEach(function(b, i) {
                if (i === 0) {
                    context.moveTo(b[0] * xProp + x1, b[1] * yProp + y1);
                }
                context.bezierCurveTo(b[0] * xProp + x1, b[1] * yProp + y1,
                                      b[2] * xProp + x1, b[3] * yProp + y1,
                                      b[4] * xProp + x1, b[5] * yProp + y1);
            });
            context.stroke();
            context.closePath();

            this._makeTransparent(context, x1, y1 - Math.round(this.waveSize * yProp), x2, y2, true);

            return this._relationSide('male', x1, y1, x2, y2);
        },

        male_3: function(canvas, width, height, x, y) {
            var x1 = 0,
                y1 = Math.round(y),
                x2 = Math.round(x),
                y2 = Math.round(y + height);

            var context = canvas.getContext('2d');

            var xProp = (x2 - x1) / this.tabSize;
            var yProp = height / 1024;

            context.beginPath();
            context.strokeStyle = 'transparent';
            this._rotate(90).forEach(function(b, i) {
                if (i === 0) {
                    context.moveTo(b[0] * xProp + x2, b[1] * yProp + y1);
                }
                context.bezierCurveTo(b[0] * xProp + x2, b[1] * yProp + y1,
                                      b[2] * xProp + x2, b[3] * yProp + y1,
                                      b[4] * xProp + x2, b[5] * yProp + y1);
            });
            context.stroke();
            context.closePath();

            context.clearRect(x1, 0, x2, y1);
            context.clearRect(x1, y2, x2, canvas.height);

            this._makeTransparent(context, x1, y1, x2 + this.getFemaleSize(width), y2, true);

            return this._relationSide('male', x1, y1, x2 + this.getFemaleSize(width), y2);
        },

        female_0: function(canvas, width, height, x, y) {
            var x1 = Math.round(x),
                y1 = Math.round(y),
                x2 = Math.round(width + x),
                y2 = Math.round(this.getMaleSize(height) + y);

            var context = canvas.getContext('2d');

            var xProp = width / 1024;
            var yProp = this.getMaleSize(height) / this.tabSize;

            context.beginPath();
            context.strokeStyle = 'transparent';
            this.beziers.forEach(function(b, i) {
                if (i === 0) {
                    context.moveTo(b[0] * xProp + x, b[1] * yProp + y1);
                }
                context.bezierCurveTo(b[0] * xProp + x, b[1] * yProp + y1,
                                      b[2] * xProp + x, b[3] * yProp + y1,
                                      b[4] * xProp + x, b[5] * yProp + y1);
            });
            context.stroke();
            context.closePath();

            this._makeTransparent(context, x1, 0, x2, y2);

            return this._relationSide('female', x1, y1, x2, y2);
        },

        female_1: function(canvas, width, height, x, y) {
            var x1 = Math.round(width + x),
                y1 = Math.round(y),
                x2 = Math.round(canvas.width),
                y2 = Math.round(y + height);

            var context = canvas.getContext('2d');

            var xProp = (x2 - x1) / this.waveSize;
            var yProp = height / 1024;

            context.beginPath();
            context.strokeStyle = 'transparent';
            this._rotate(90).forEach(function(b, i) {
                if (i === 0) {
                    context.moveTo(b[0] * xProp + x1, b[1] * yProp + y1);
                }
                context.bezierCurveTo(b[0] * xProp + x1, b[1] * yProp + y1,
                                      b[2] * xProp + x1, b[3] * yProp + y1,
                                      b[4] * xProp + x1, b[5] * yProp + y1);
            });
            context.stroke();
            context.closePath();

            context.clearRect(x1, 0, x2, y);
            context.clearRect(x1, y + height, x2, canvas.height);

            this._makeTransparent(context, x1 - this.getMaleSize(width) + 1 /*strange blank line*/, y1, x2, y2);

            return this._relationSide('female', x1 - this.getMaleSize(width), y1, x2, y2);
        },

        female_2: function(canvas, width, height, x, y) {
            var x1 = Math.round(x),
                y1 = Math.round(height + y),
                x2 = Math.round(width + x),
                y2 = Math.round(canvas.height);

            var context = canvas.getContext('2d');

            var xProp = width / 1024;
            var yProp = this.getMaleSize(height) / this.tabSize;

            context.beginPath();
            context.strokeStyle = 'transparent';
            this._rotate(180).forEach(function(b, i) {
                if (i === 0) {
                    context.moveTo(b[0] * xProp + width + x, b[1] * yProp + y1);
                }
                context.bezierCurveTo(
                    b[0] * xProp + width + x, b[1] * yProp + y1,
                    b[2] * xProp + width + x, b[3] * yProp + y1,
                    b[4] * xProp + width + x, b[5] * yProp + y1
                    );
            });
            context.stroke();
            context.closePath();

            this._makeTransparent(context, x1, y1 - this.getMaleSize(height), x2, y2);

            return this._relationSide('female', x1, y1 - this.getMaleSize(height), x2, y2);
        },

        female_3: function(canvas, width, height, x, y) {
            var x1 = Math.round(x),
                y1 = Math.round(y),
                x2 = Math.round(this.getMaleSize(width) + x),
                y2 = Math.round(height + y);

            var context = canvas.getContext('2d');

            var xProp = (x2 - x1) / this.tabSize;
            var yProp = height / 1024;

            context.beginPath();
            context.strokeStyle = 'transparent';
            this._rotate(270).forEach(function(b, i) {
                if (i === 0) {
                    context.moveTo(b[0] * xProp + x1, b[1] * yProp + y2);
                }
                context.bezierCurveTo(b[0] * xProp + x1, b[1] * yProp + y2,
                                      b[2] * xProp + x1, b[3] * yProp + y2,
                                      b[4] * xProp + x1, b[5] * yProp + y2);
            });
            context.stroke();
            context.closePath();

            context.clearRect(0, 0, x1, y);
            context.clearRect(0, y + height, x1, canvas.height);

            this._makeTransparent(context, 0, y1, x2, y2);

            return this._relationSide('female', x1, y1, x2, y2);
        },

        getSize: function(size, male) {
            return this['get' + (male ? 'M' : 'Fem') + 'aleSize'](size);
        },

        getMaleSize: function(size) {
            return Math.ceil(size * this._size);
        },

        getFemaleSize: function(size) {
            // get proportion and calc size for wave
            return Math.ceil(this.getMaleSize(size) / this.tabSize * this.waveSize);
        }
    };

    Puzzler.registerJigsaw(Puzzler.makeJigsaw(jigsaw));
})();