/*
 * This file is part of yoob.js version 0.2-PRE
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * A controller for executing(/animating/evolving) states
 * (such as esolang program states or cellular automaton
 * configurations.)
 *
 * Can be connected to a UI in the DOM.
 *
 * Subclass this and override the following methods:
 * - make it evolve the state by one tick in the step() method
 * - make it load the state from a multiline string in the load() method
 */
yoob.Controller = function() {
    this.intervalId = undefined;
    this.delay = 100;
    this.source = undefined;
    this.speed = undefined;

    var makeOnClick = function(controller, key) {
        if (controller['click_' + key] !== undefined)
            key = 'click_' + key;
        return function(e) { controller[key](); }
    };

    /*
     * Single argument is a dictionary (object) where the keys
     * are the actions a controller can undertake, and the values
     * are either DOM elements or strings; if strings, DOM elements
     * with those ids will be obtained from the document and used.
     */
    this.connect = function(dict) {
        var self = this;
        var keys = ["start", "stop", "step", "load"];
        for (var i in keys) {
            var key = keys[i];
            var value = dict[key];
            if (typeof value === 'string') {
                value = document.getElementById(value);
            }
            if (value !== undefined) {
                value.onclick = makeOnClick(this, key);
            }
        }

        var source = dict.source;
        if (typeof source === 'string') {
            source = document.getElementById(source);
        }
        if (source !== undefined) {
            this.source = source;
        }

        var speed = dict.speed;
        if (typeof speed === 'string') {
            speed = document.getElementById(speed);
        }
        if (speed !== undefined) {
            this.speed = speed;
            speed.value = self.delay;
            speed.onchange = function(e) {
                self.delay = speed.value;
                if (self.intervalId !== undefined) {
                    self.stop();
                    self.start();
                }
            }
        }        
    };

    this.click_step = function(e) {
        this.stop();
        this.step();
    };

    this.step = function() {
        alert("step() NotImplementedError");
    };

    this.click_load = function(e) {
        this.stop();
        this.load(this.source.value);
    };

    this.load = function(text) {
        alert("load() NotImplementedError");
    };

    this.start = function() {
        if (this.intervalId !== undefined)
            return;
        this.step();
        var self = this;
        this.intervalId = setInterval(function() { self.step(); }, this.delay);
    };

    this.stop = function() {
        if (this.intervalId === undefined)
            return;
        clearInterval(this.intervalId);
        this.intervalId = undefined;
    };
};
