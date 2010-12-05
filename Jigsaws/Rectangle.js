(function() {

    var jigsaw = {
        name: 'rectangle',

        /**
         * Размер.
         * @type Number
         */
        _size: 0.2,

        _relationSide: function(type, x1, y1, x2, y2) {
            return {
                type: type,
                offsetX: Math.round((x2 - x1) / 2 + x1),
                offsetY: Math.round((y2 - y1) / 2 + y1)
            };
        },

        _makeFemale: function(canvas, x1, y1, x2, y2) {
            var context = canvas.getContext('2d');
            context.clearRect(x1, y1, x2 - x1, y2 - y1);
        },

        male_0: function(canvas, width, height, x, y) {
            var rw = width / 3,
                x1 = Math.round(rw + x),
                y1 = 0,
                x2 = Math.round(rw * 2 + x),
                y2 = Math.round(height * this._size);

            var context = canvas.getContext('2d');
            context.clearRect(0, y1, x1, y2 - y1);
            context.clearRect(x2, y1, canvas.width - x2, y2 - y1);

            return this._relationSide('male', x1, y1, x2, y2);
        },

        male_1: function(canvas, width, height, x, y) {
            var rh = height / 3,
                x1 = Math.round(width + x),
                y1 = Math.round(rh + y),
                x2 = Math.round(canvas.width),
                y2 = Math.round(rh * 2 + y);

            var context = canvas.getContext('2d');
            context.clearRect(x1, 0, x2 - x1, y1);
            context.clearRect(x1, y2, x2 - x1, canvas.height - y2);

            return this._relationSide('male', x1, y1, x2, y2);
        },

        male_2: function(canvas, width, height, x, y) {
            var rw = width / 3,
                x1 = Math.round(rw + x),
                y1 = Math.round(height + y),
                x2 = Math.round(rw * 2 + x),
                y2 = Math.round(canvas.height);

            var context = canvas.getContext('2d');
            context.clearRect(0, y1, x1, y2 - y1);
            context.clearRect(x2, y1, canvas.width - x2, y2 - y1);

            return this._relationSide('male', x1, y1, x2, y2);
        },

        male_3: function(canvas, width, height, x, y) {
            var rh = height / 3,
                x1 = 0,
                y1 = Math.round(rh + y),
                x2 = Math.round(width * this._size),
                y2 = Math.round(rh * 2 + y);

            var context = canvas.getContext('2d');
            context.clearRect(x1, 0, x2 - x1, y1);
            context.clearRect(x1, y2, x2 - x1, canvas.height - y2);

            return this._relationSide('male', x1, y1, x2, y2);
        },

        female_0: function(canvas, width, height, x, y) {
            var rw = width / 3,
                x1 = Math.round(rw + x),
                y1 = Math.round(0 + y),
                x2 = Math.round(rw * 2 + x),
                y2 = Math.round(height * this._size + y);

            this._makeFemale(canvas, x1, y1, x2, y2);

            return this._relationSide('female', x1, y1, x2, y2);
        },

        female_1: function(canvas, width, height, x, y) {
            var rh = height / 3,
                x1 = Math.round(width * (1 - this._size) + x),
                y1 = Math.round(rh + y),
                x2 = Math.round(width + x),
                y2 = Math.round(rh * 2 + y);

            this._makeFemale(canvas, x1, y1, x2, y2);

            return this._relationSide('female', x1, y1, x2, y2);
        },

        female_2: function(canvas, width, height, x, y) {
            var rw = width / 3,
                x1 = Math.round(rw + x),
                y1 = Math.round(height * (1 - this._size) + y),
                x2 = Math.round(rw * 2 + x),
                y2 = Math.round(height + y);

            this._makeFemale(canvas, x1, y1, x2, y2);

            return this._relationSide('female', x1, y1, x2, y2);
        },

        female_3: function(canvas, width, height, x, y) {
            var rh = height / 3,
                x1 = Math.round(0 + x),
                y1 = Math.round(rh + y),
                x2 = Math.round(width * this._size + x),
                y2 = Math.round(rh * 2 + y);

            this._makeFemale(canvas, x1, y1, x2, y2);

            return this._relationSide('female', x1, y1, x2, y2);
        },

        getSize: function(size, male) {
            return male ? Math.round(size * this._size) : 0;
        }
    };

    Puzzler.registerJigsaw(jigsaw);
})();