/*
 * This file is part of yoob.js version 0.2
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A two-dimensional Cartesian grid of values.
 */
yoob.Playfield = function() {
    this._store = {};
    this.minX = undefined;
    this.minY = undefined;
    this.maxX = undefined;
    this.maxY = undefined;
    this._default = undefined;

    /*
     * Set the default value for this Playfield.  This
     * value is returned by get() for any cell that was
     * never written to, or had `undefined` put() into it.
     */
    this.setDefault = function(v) {
        this._default = v;
    };

    /*
     * Obtain the value at (x, y).  The default value will
     * be returned if the cell was never written to.
     */
    this.get = function(x, y) {
        var v = this._store[x+','+y];
        if (v === undefined) return this._default;
        return v;
    };

    /*
     * Write a new value into (x, y).  Note that writing
     * `undefined` into a cell has the semantics of deleting
     * the value at that cell; a subsequent get() for that
     * location will return this Playfield's default value.
     */
    this.put = function(x, y, value) {
        var key = x+','+y;
        if (value === undefined || value === this._default) {
            delete this._store[key];
            return;
        }
        if (this.minX === undefined || x < this.minX) this.minX = x;
        if (this.maxX === undefined || x > this.maxX) this.maxX = x;
        if (this.minY === undefined || y < this.minY) this.minY = y;
        if (this.maxY === undefined || y > this.maxY) this.maxY = y;
        this._store[key] = value;
    };

    /*
     * Like put(), but does not update the playfield bounds.  Do
     * this if you must do a batch of put()s in a more efficient
     * manner; after doing so, call recalculateBounds().
     */
    this.putDirty = function(x, y, value) {
        var key = x+','+y;
        if (value === undefined || value === this._default) {
            delete this._store[key];
            return;
        }
        this._store[key] = value;
    };

    /*
     * Recalculate the bounds (min/max X/Y) which are tracked
     * internally to support methods like foreach().  This is
     * not needed *unless* you've used putDirty() at some point.
     * (In which case, call this immediately after your batch
     * of putDirty()s.)
     */
    this.recalculateBounds = function() {
        this.minX = undefined;
        this.minY = undefined;
        this.maxX = undefined;
        this.maxX = undefined;

        for (var cell in this._store) {
            var pos = cell.split(',');
            var x = parseInt(pos[0], 10);
            var y = parseInt(pos[1], 10);
            if (this.minX === undefined || x < this.minX) this.minX = x;
            if (this.maxX === undefined || x > this.maxX) this.maxX = x;
            if (this.minY === undefined || y < this.minY) this.minY = y;
            if (this.maxY === undefined || y > this.maxY) this.maxY = y;
        }
    };

    /*
     * Clear the contents of this Playfield.
     */
    this.clear = function() {
        this._store = {};
        this.minX = undefined;
        this.minY = undefined;
        this.maxX = undefined;
        this.maxX = undefined;
    };

    /*
     * Load a string into this Playfield.
     * The string may be multiline, with newline (ASCII 10)
     * characters delimiting lines.  ASCII 13 is ignored.
     *
     * If transformer is given, it should be a one-argument
     * function which accepts a character and returns the
     * object you wish to write into the playfield upon reading
     * that character.
     */
    this.load = function(x, y, string, transformer) {
        var lx = x;
        var ly = y;
        if (transformer === undefined) {
            transformer = function(c) {
                if (c === ' ') {
                    return undefined;
                } else {
                    return c;
                }
            }
        }
        for (var i = 0; i < string.length; i++) {
            var c = string.charAt(i);
            if (c === '\n') {
                lx = x;
                ly++;
            } else if (c === '\r') {
            } else {
                this.putDirty(lx, ly, transformer(c));
                lx++;
            }
        }
        this.recalculateBounds();
    };

    /*
     * Convert this Playfield to a multi-line string.  Each row
     * is a line, delimited with a newline (ASCII 10).
     *
     * If transformer is given, it should be a one-argument
     * function which accepts a playfield element and returns a
     * character (or string) you wish to place in the resulting
     * string for that element.
     */
    this.dump = function(transformer) {
        var text = "";
        if (transformer === undefined) {
            transformer = function(c) { return c; }
        }
        for (var y = this.minY; y <= this.maxY; y++) {
            var row = "";
            for (var x = this.minX; x <= this.maxX; x++) {
                row += transformer(this.get(x, y));
            }
            text += row + "\n";
        }
        return text;
    };

    /*
     * Iterate over every defined cell in the Playfield.
     * fun is a callback which takes three parameters:
     * x, y, and value.  If this callback returns a value,
     * it is written into the Playfield at that position.
     * This function ensures a particular order.
     */
    this.foreach = function(fun) {
        for (var y = this.minY; y <= this.maxY; y++) {
            for (var x = this.minX; x <= this.maxX; x++) {
                var key = x+','+y;
                var value = this._store[key];
                if (value === undefined)
                    continue;
                var result = fun(x, y, value);
                if (result !== undefined) {
                    if (result === ' ') {
                        result = undefined;
                    }
                    this.put(x, y, result);
                }
            }
        }
    };

    /*
     * Analogous to (monoid) map in functional languages,
     * iterate over this Playfield, transform each value using
     * a supplied function, and write the transformed value into
     * a destination Playfield.
     *
     * Supplied function should take a Playfield (this Playfield),
     * x, and y, and return a value.
     *
     * The map source may extend beyond the internal bounds of
     * the Playfield, by giving the min/max Dx/Dy arguments
     * (which work like margin offsets.)
     *
     * Useful for evolving a cellular automaton playfield.  In this
     * case, min/max Dx/Dy should be computed from the neighbourhood.
     */
    this.map = function(destPf, fun, minDx, minDy, maxDx, maxDy) {
        if (minDx === undefined) minDx = 0;
        if (minDy === undefined) minDy = 0;
        if (maxDx === undefined) maxDx = 0;
        if (maxDy === undefined) maxDy = 0;
        for (var y = this.minY + minDy; y <= this.maxY + maxDy; y++) {
            for (var x = this.minX + minDx; x <= this.maxX + maxDx; x++) {
                destPf.putDirty(x, y, fun(pf, x, y));
            }
        }
        destPf.recalculateBounds();
    };

    /*
     * Draws elements of the Playfield in a drawing context.
     * x and y are canvas coordinates, and width and height
     * are canvas units of measure.
     * The default implementation just renders them as text,
     * in black.
     * Override if you wish to draw them differently.
     */
    this.drawElement = function(ctx, x, y, cellWidth, cellHeight, elem) {
        ctx.fillStyle = "black";
        ctx.fillText(elem.toString(), x, y);
    };

    /*
     * Draws the Playfield in a drawing context.
     * cellWidth and cellHeight are canvas units of measure for each cell.
     */
    this.drawContext = function(ctx, offsetX, offsetY, cellWidth, cellHeight) {
        var me = this;
        this.foreach(function (x, y, elem) {
            me.drawElement(ctx, offsetX + x * cellWidth, offsetY + y * cellHeight,
                           cellWidth, cellHeight, elem);
        });
    };

    this.getExtentX = function() {
        if (this.maxX === undefined || this.minX === undefined) {
            return 0;
        } else {
            return this.maxX - this.minX + 1;
        }
    };

    this.getExtentY = function() {
        if (this.maxY === undefined || this.minY === undefined) {
            return 0;
        } else {
            return this.maxY - this.minY + 1;
        }
    };

    /*
     * Draws the Playfield, and a set of Cursors, on a canvas element.
     * Resizes the canvas to the needed dimensions.
     * cellWidth and cellHeight are canvas units of measure for each cell.
     */
    this.drawCanvas = function(canvas, cellWidth, cellHeight, cursors) {
        var ctx = canvas.getContext('2d');
      
        var width = this.getExtentX();
        var height = this.getExtentY();

        if (cellWidth === undefined) {
            ctx.textBaseline = "top";
            ctx.font = cellHeight + "px monospace";
            cellWidth = ctx.measureText("@").width;
        }

        canvas.width = width * cellWidth;
        canvas.height = height * cellHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.textBaseline = "top";
        ctx.font = cellHeight + "px monospace";

        var offsetX = this.minX * cellWidth * -1;
        var offsetY = this.minY * cellHeight * -1;

        for (var i = 0; i < cursors.length; i++) {
            cursors[i].drawContext(
              ctx,
              cursors[i].x * cellWidth, cursors[i].y * cellHeight,
              cellWidth, cellHeight
            );
        }

        this.drawContext(ctx, offsetX, offsetY, cellWidth, cellHeight);
    };

};
