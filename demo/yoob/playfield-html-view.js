/*
 * This file is part of yoob.js version 0.11
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A view (in the MVC sense) for depicting a yoob.Playfield (-compatible)
 * object onto any DOM element that supports innerHTML.
 */
yoob.PlayfieldHTMLView = function() {
    this.init = function(cfg) {
        this.pf = cfg.playfield;
        this.element = cfg.element;
        return this;
    };

    /*** Chainable setters ***/

    this.setPlayfield = function(pf) {
        this.pf = pf;
        return this;
    };

    this.setElement = function(element) {
        this.element = element;
        return this;
    };

    /*
     * For compatibility with PlayfieldCanvasView.  Sets the font size.
     */
    this.setCellDimensions = function(cellWidth, cellHeight) {
        this.element.style.fontSize = cellHeight + "px";
        return this;
    };

    /*
     * Override to convert Playfield values to HTML.
     */
    this.render = function(value) {
        if (value === undefined) return ' ';
        return value;
    };

    /*
     * Override if you like.
     */
    this.wrapCursorText = function(cursor, text) {
        var fillStyle = this.cursorFillStyle || "#50ff50";
        return '<span style="background: ' + fillStyle + '">' +
               text + '</span>';
    };

    /*
     * Render the playfield, as HTML, on the DOM element.
     */
    this.draw = function() {
        var text = "";
        var cursors = this.pf.cursors;
        var lowerY = this.pf.getLowerY();
        var upperY = this.pf.getUpperY();
        var lowerX = this.pf.getLowerX();
        var upperX = this.pf.getUpperX();
        for (var y = lowerY; y <= upperY; y++) {
            var row = "";
            for (var x = lowerX; x <= upperX; x++) {
                var rendered = this.render(this.pf.get(x, y));
                for (var i = 0; i < cursors.length; i++) {
                    if (cursors[i].x === x && cursors[i].y === y) {
                        rendered = this.wrapCursorText(cursors[i], rendered);
                    }
                }
                row += rendered;
            }
            text += row + "\n";
        }
        this.element.innerHTML = text;
    };

};
