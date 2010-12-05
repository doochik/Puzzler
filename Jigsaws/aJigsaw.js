/**
 * @name Puzzle.aJigsaw
 * @class Abstract class for jigsaw
 */
Puzzler.aJigsaw = {

    /**
     * Jigsaw name.
     * @type String
     * @private
     */
    name: '',

    /**
     * Jigsaw size
     * @type Number
     * @private
     */
    _size: 0.2,

    /**
     * @param {CanvasContext} context
     * @param {Number} x1
     * @param {Number} y1
     * @param {Number} x2
     * @param {Number} y2
     * @param {Boolean} [female=false]
     */
    _makeTransparent: function(context, x1, y1, x2, y2, female) {
        var i, j;

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

    /**
     * @constant
     * @type Number
     */
    _radInDeg: Math.PI/180,

    /**
     * Convert degrees to radians.
     * @param {Number} deg
     * @return {Number}
     */
    _degToRad: function(deg) {
        return deg * this._radInDeg;
    },

    /**
     * Return tab size.
     * @param {Number} size Size of side.
     * @param {Boolean} male Male or female.
     * @return {Number}
     */
    getSize: function(size, male) {
        return male ? Math.round(size * this._size) : 0;
    }
};