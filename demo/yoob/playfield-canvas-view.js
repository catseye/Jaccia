/*
 * This file is part of yoob.js version 0.5
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A view (in the MVC sense) for depicting a yoob.Playfield (-compatible)
 * object on an HTML5 <canvas> element (or compatible object).
 *
 * TODO: don't necesarily resize canvas each time?
 * TODO: option to stretch content rendering to fill a fixed-size canvas
 */
yoob.PlayfieldCanvasView = function() {
    this.pf = undefined;
    this.canvas = undefined;

    this.init = function(pf, canvas) {
        this.pf = pf;
        this.canvas = canvas;
        this.cursors = [];
        this.cellWidth = 8;
        this.cellHeight = 8;
        return this;
    };
    
    /* Chain setters */
    this.setCursors = function(cursors) {
        this.cursors = cursors;
        return this;
    };
    this.setCellDimensions = function(cellWidth, cellHeight) {
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        return this;
    };

    /*
     * Override these if you want to draw some portion of the
     * playfield which is not the whole playfield.
     * (Not yet implemented)
     */
    this.getLowerX = function() {
        return this.pf.getMinX();
    };
    this.getUpperX = function() {
        return this.pf.getMaxX();
    };
    this.getLowerY = function() {
        return this.pf.getMinY();
    };
    this.getUpperY = function() {
        return this.pf.getMaxY();
    };

    /*
     * Returns the number of occupied cells in the x direction.
     */
    this.getExtentX = function() {
        if (this.getLowerX() === undefined || this.getUpperX() === undefined) {
            return 0;
        } else {
            return this.getUpperX() - this.getLowerX() + 1;
        }
    };

    /*
     * Returns the number of occupied cells in the y direction.
     */
    this.getExtentY = function() {
        if (this.getLowerY() === undefined || this.getUpperY() === undefined) {
            return 0;
        } else {
            return this.getUpperY() - this.getLowerY() + 1;
        }
    };

    /*
     * Draws cells of the Playfield in a drawing context.
     * cellWidth and cellHeight are canvas units of measure.
     *
     * The default implementation tries to call a .draw() method on the cell's
     * value, if one exists, and just renders it as text, in black, if not.
     *
     * Override if you wish to draw elements in some other way.
     */
    this.drawCell = function(ctx, value, playfieldX, playfieldY,
                             canvasX, canvasY, cellWidth, cellHeight) {
        if (value.draw !== undefined) {
            value.draw(ctx, playfieldX, playfieldY, canvasX, canvasY,
                       cellWidth, cellHeight);
        } else {
            ctx.fillStyle = "black";
            ctx.fillText(value.toString(), canvasX, canvasY);
        }
    };

    /*
     * Draws the Playfield in a drawing context.
     * cellWidth and cellHeight are canvas units of measure for each cell.
     * offsetX and offsetY are canvas units of measure for the top-left
     *   of the entire playfield.
     */
    this.drawContext = function(ctx, offsetX, offsetY, cellWidth, cellHeight) {
        var self = this;
        this.pf.foreach(function (x, y, value) {
            self.drawCell(ctx, value, x, y,
                          offsetX + x * cellWidth, offsetY + y * cellHeight,
                          cellWidth, cellHeight);
        });
    };

    /*
     * Draws the Playfield, and a set of Cursors, on a canvas element.
     * Resizes the canvas to the needed dimensions.
     * cellWidth and cellHeight are canvas units of measure for each cell.
     * Note that this is a holdover from when this method was on Playfield
     * itself; typically you'd just call draw() instead.
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

        var offsetX = this.pf.getMinX() * cellWidth * -1;
        var offsetY = this.pf.getMinY() * cellHeight * -1;

        if (this.fixedPosition) {
            offsetX = 0;
            offsetY = 0;
        }

        for (var i = 0; i < cursors.length; i++) {
            cursors[i].drawContext(
              ctx,
              offsetX + cursors[i].x * cellWidth,
              offsetY + cursors[i].y * cellHeight,
              cellWidth, cellHeight
            );
        }

        this.drawContext(ctx, offsetX, offsetY, cellWidth, cellHeight);
    };

    /*
     * Render the playfield on the canvas.
     */
    this.draw = function() {
        this.drawCanvas(
          this.canvas, this.cellWidth, this.cellHeight, this.cursors
        );
    };

};
