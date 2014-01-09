/*
 * This file is part of yoob.js version 0.5
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A view (in the MVC sense) for depicting a yoob.Playfield (-compatible)
 * object onto any DOM element that supports innerHTML.
 *
 * TODO: this may be incomplete; use at your own risk
 * TODO: have this and the canvas view inherit from a common ABC?
 */
yoob.PlayfieldHTMLView = function() {
    this.pf = undefined;
    this.element = undefined;

    this.init = function(pf, element) {
        this.pf = pf;
        this.element = element;
        return this;
    };

    /*
     * Override these if you want to draw some portion of the
     * playfield which is not the whole playfield.
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
     * Override to convert Playfield values to HTML.
     */
    this.render = function(value) {
        return value;
    };

    /*
     * Render the playfield, as HTML, on the DOM element.
     */
    this.draw = function() {
        var text = "";
        for (var y = this.getLowerY(); y <= this.getUpperY(); y++) {
            var row = "";
            for (var x = this.getLowerX(); x <= this.getUpperX(); x++) {
                row += this.render(this.pf.get(x, y));
            }
            text += row + "\n";
        }
        this.element.innerHTML = text;
    };

};
