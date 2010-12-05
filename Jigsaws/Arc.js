(function() {

    var jigsaw = {
        name: 'arc',

        male_0: function(canvas, width, height, x, y) {
            var x1 = Math.round(width / 2 + x);

            var size = this.getSize(height, true);

            var context = canvas.getContext('2d');
            context.beginPath();
            context.strokeStyle = 'transparent';
            context.arc(x1, y, size, 0, this._degToRad(180), true);
            context.stroke();
            context.closePath();

            this._makeTransparent(context, 0, 0, canvas.width, y, false);

            return {
                type: 'male',
                offsetX: x1,
                offsetY: Math.round(size / 2)
            };
        },

        male_1: function(canvas, width, height, x, y) {
            var x1 = width + x;
            var y1 = Math.round(height / 2 + y);

            var size = this.getSize(width, true);

            var context = canvas.getContext('2d');
            context.beginPath();
            context.strokeStyle = 'transparent';
            context.arc(x1, y1, size, this._degToRad(90), this._degToRad(270), true);
            context.stroke();
            context.closePath();

            this._makeTransparent(context, x1, 0, canvas.width, canvas.height, false);

            return {
                type: 'male',
                offsetX: x1 + Math.round(size / 2),
                offsetY: y1
            };
        },

        male_2: function(canvas, width, height, x, y) {
            var x1 = Math.round(width / 2 + x);
            var y1 = height + y;

            var size = this.getSize(height, true);

            var context = canvas.getContext('2d');
            context.beginPath();
            context.strokeStyle = 'transparent';
            context.arc(x1, y1, size, this._degToRad(180), this._degToRad(360), true);
            context.stroke();
            context.closePath();

            this._makeTransparent(context, 0, y1, canvas.width, canvas.height, false);

            return {
                type: 'male',
                offsetX: x1,
                offsetY: y1 + Math.round(size / 2)
            };
        },

        male_3: function(canvas, width, height, x, y) {
            var x1 = x;
            var y1 = Math.round(height / 2 + y);

            var size = this.getSize(width, true);

            var context = canvas.getContext('2d');
            context.beginPath();
            context.strokeStyle = 'transparent';
            context.arc(x1, y1, size, this._degToRad(-90), this._degToRad(90), true);
            context.stroke();
            context.closePath();

            this._makeTransparent(context, 0, 0, x1, canvas.height, false);

            return {
                type: 'male',
                offsetX: x1 - Math.round(size / 2),
                offsetY: y1
            };
        },

        female_0: function(canvas, width, height, x, y) {
            var x1 = Math.round(width / 2 + x);
            var y1 = 0;

            var size = this.getSize(height, true);

            var context = canvas.getContext('2d');
            context.beginPath();
            context.strokeStyle = 'transparent';
            context.arc(x1, y1, size, this._degToRad(180), this._degToRad(360), true);
            context.stroke();
            context.closePath();

            this._makeTransparent(context, x1 - size, y1, x1 + size, size, true);

            return {
                type: 'female',
                offsetX: x1,
                offsetY: Math.round(size / 2)
            };
        },

        female_1: function(canvas, width, height, x, y) {
            var x1 = canvas.width;
            var y1 = Math.round(height / 2 + y);

            var size = this.getSize(width, true);

            var context = canvas.getContext('2d');
            context.beginPath();
            context.strokeStyle = 'transparent';
            context.arc(x1, y1, size, this._degToRad(-90), this._degToRad(90), true);
            context.stroke();
            context.closePath();

            this._makeTransparent(context, x1 - size, y1 - size, x1, y1 + size, true);

            return {
                type: 'female',
                offsetX: x1 - Math.round(size / 2),
                offsetY: y1
            };
        },

        female_2: function(canvas, width, height, x, y) {
            var x1 = Math.round(width / 2 + x);
            var y1 = canvas.height;

            var size = this.getSize(height, true);

            var context = canvas.getContext('2d');
            context.beginPath();
            context.strokeStyle = 'transparent';
            context.arc(x1, y1, size, this._degToRad(0), this._degToRad(180), true);
            context.stroke();
            context.closePath();

            this._makeTransparent(context, x1 - size, y1 - size, x1 + size, y1, true);

            return {
                type: 'female',
                offsetX: x1,
                offsetY: y1 - Math.round(size / 2)
            };
        },

        female_3: function(canvas, width, height, x, y) {
            var x1 = 0;
            var y1 = Math.round(height / 2 + y);

            var size = this.getSize(width, true);

            var context = canvas.getContext('2d');
            context.beginPath();
            context.strokeStyle = 'transparent';
            context.arc(x1, y1, size, this._degToRad(-90), this._degToRad(90), false);
            context.stroke();
            context.closePath();

            this._makeTransparent(context, x1, 0, x1 + size, canvas.height, true);

            return {
                type: 'female',
                offsetX: Math.round(size / 2),
                offsetY: y1
            };
        }
    };

    Puzzler.registerJigsaw(Puzzler.makeJigsaw(jigsaw));

})();