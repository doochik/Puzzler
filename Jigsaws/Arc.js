(function() {

    var jigsaw = {
            name: 'arc',

            _size: 0.2,

            getSize: function(size, male) {
                return male ? Math.round(size*this._size) : 0;
            },

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
                            context.clearRect(i, j, 1, 1);
                        }
                    }
                }
            },

            male_0: function(canvas, width, height, x, y) {
                var x1 = Math.round(width/2 + x);

                var size = this.getSize(height, true);

                var context = canvas.getContext('2d');
                context.beginPath();
                context.strokeStyle = 'transparent';
                context.arc(x1, y, size, 0, Math.PI/180*180, true);
                context.stroke();
                context.closePath();

                this._makeTransparent(canvas, 0, 0, canvas.width, y, false);

                return {
                    type: 'male',
                    offsetX: x1,
                    offsetY: Math.round(size/2)
                };
            },

            male_1: function(canvas, width, height, x, y) {
                var x1 = width + x;
                var y1 = Math.round(height/2 + y);

                var size = this.getSize(width, true);

                var context = canvas.getContext('2d');
                context.beginPath();
                context.strokeStyle = 'transparent';
                context.arc(x1, y1, size, Math.PI/180*90, Math.PI/180*270, true);
                context.stroke();
                context.closePath();

                this._makeTransparent(canvas, x1, 0, canvas.width, canvas.height, false);

                return {
                    type: 'male',
                    offsetX: x1 + Math.round(size/2),
                    offsetY: y1
                };
            },

            male_2: function(canvas, width, height, x, y) {
                var x1 = Math.round(width/2 + x);
                var y1 = height + y;

                var size = this.getSize(height, true);

                var context = canvas.getContext('2d');
                context.beginPath();
                context.strokeStyle = 'transparent';
                context.arc(x1, y1, size, Math.PI/180*180, Math.PI/180*360, true);
                context.stroke();
                context.closePath();

                this._makeTransparent(canvas, 0, y1, canvas.width, canvas.height, false);

                return {
                    type: 'male',
                    offsetX: x1,
                    offsetY: y1 + Math.round(size/2)
                };
            },

            male_3: function(canvas, width, height, x, y) {
                var x1 = x;
                var y1 = Math.round(height/2 + y);

                var size = this.getSize(width, true);

                var context = canvas.getContext('2d');
                context.beginPath();
                context.strokeStyle = 'transparent';
                context.arc(x1, y1, size, -Math.PI/180*90, Math.PI/180*90, true);
                context.stroke();
                context.closePath();

                this._makeTransparent(canvas, 0, 0, x1, canvas.height, false);

                return {
                    type: 'male',
                    offsetX: x1 - Math.round(size/2),
                    offsetY: y1
                };
            },

            female_0: function(canvas, width, height, x, y) {
                var x1 = Math.round(width/2 + x);
                var y1 = 0;

                var size = this.getSize(height, true);

                var context = canvas.getContext('2d');
                context.beginPath();
                context.strokeStyle = 'transparent';
                context.arc(x1, y1, size, Math.PI/180*180, Math.PI/180*360, true);
                context.stroke();
                context.closePath();

                this._makeTransparent(canvas, x1 - size, y1, x1 + size, size, true);

                return {
                    type: 'female',
                    offsetX: x1,
                    offsetY: Math.round(size/2)
                };
            },

            female_1: function(canvas, width, height, x, y) {
                var x1 = canvas.width;
                var y1 = Math.round(height/2 + y);

                var size = this.getSize(width, true);

                var context = canvas.getContext('2d');
                context.beginPath();
                context.strokeStyle = 'transparent';
                context.arc(x1, y1, size, -Math.PI/180*90, Math.PI/180*90, true);
                context.stroke();
                context.closePath();

                this._makeTransparent(canvas, x1 - size, y1-size, x1, y1+size, true);

                return {
                    type: 'female',
                    offsetX: x1 - Math.round(size/2),
                    offsetY: y1
                };
            },

            female_2: function(canvas, width, height, x, y) {
                var x1 = Math.round(width/2 + x);
                var y1 = canvas.height;

                var size = this.getSize(height, true);

                var context = canvas.getContext('2d');
                context.beginPath();
                context.strokeStyle = 'transparent';
                context.arc(x1, y1, size, Math.PI/180*0, Math.PI/180*180, true);
                context.stroke();
                context.closePath();

                this._makeTransparent(canvas, x1 - size, y1 - size, x1 + size, y1, true);

                return {
                    type: 'female',
                    offsetX: x1,
                    offsetY: y1 - Math.round(size/2)
                };
            },

            female_3: function(canvas, width, height, x, y) {
                var x1 = 0;
                var y1 = Math.round(height/2 + y);

                var size = this.getSize(width, true);

                var context = canvas.getContext('2d');
                context.beginPath();
                context.strokeStyle = 'transparent';
                context.arc(x1, y1, size, -Math.PI/180*90, Math.PI/180*90, false);
                context.stroke();
                context.closePath();

                this._makeTransparent(canvas, x1, 0, x1 + size, canvas.height, true);

                return {
                    type: 'female',
                    offsetX: Math.round(size/2),
                    offsetY: y1
                };
            }
        };

    Puzzler.registerJigsaw(jigsaw);

})();