/*
 * This file is part of yoob.js version 0.13
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * Functions for creating elements.
 */

yoob.makeCanvas = function(container, width, height) {
    var canvas = document.createElement('canvas');
    if (width) {
        canvas.width = width;
    }
    if (height) {
        canvas.height = height;
    }
    container.appendChild(canvas);
    return canvas;
};

yoob.makeButton = function(container, labelText, fun) {
    var button = document.createElement('button');
    button.innerHTML = labelText;
    container.appendChild(button);
    if (fun) {
        button.onclick = fun;
    }
    return button;
};

yoob.checkBoxNumber = 0;
yoob.makeCheckbox = function(container, checked, labelText, fun) {
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.id = 'cfzzzb_' + yoob.checkBoxNumber;
    checkbox.checked = checked;
    var label = document.createElement('label');
    label.htmlFor = 'cfzzzb_' + yoob.checkBoxNumber;
    yoob.checkBoxNumber += 1;
    label.appendChild(document.createTextNode(labelText));
    
    container.appendChild(checkbox);
    container.appendChild(label);

    if (fun) {
        checkbox.onchange = function(e) {
            fun(checkbox.checked);
        };
    }
    return checkbox;
};

yoob.makeTextInput = function(container, size, value) {
    var input = document.createElement('input');
    input.size = "" + (size || 12);
    input.value = value || "";
    container.appendChild(input);
    return input;
};

yoob.makeSlider = function(container, min, max, value, fun) {
    var slider = document.createElement('input');
    slider.type = "range";
    slider.min = min;
    slider.max = max;
    slider.value = value || 0;
    if (fun) {
        slider.onchange = function(e) {
            fun(parseInt(slider.value, 10));
        };
    }
    container.appendChild(slider);
    return slider;
};

yoob.makeParagraph = function(container, innerHTML) {
    var p = document.createElement('p');
    p.innerHTML = innerHTML || '';
    container.appendChild(p);
    return p;
};

yoob.makeSpan = function(container, innerHTML) {
    var span = document.createElement('span');
    span.innerHTML = innerHTML || '';
    container.appendChild(span);
    return span;
};

yoob.makeDiv = function(container, innerHTML) {
    var div = document.createElement('div');
    div.innerHTML = innerHTML || '';
    container.appendChild(div);
    return div;
};

yoob.makePre = function(container, innerHTML) {
    var elem = document.createElement('pre');
    elem.innerHTML = innerHTML || '';
    container.appendChild(elem);
    return elem;
};

yoob.makePanel = function(container, title, isOpen) {
    isOpen = !!isOpen;
    var panelContainer = document.createElement('div');
    var button = document.createElement('button');
    var innerContainer = document.createElement('div');
    innerContainer.style.display = isOpen ? "block" : "none";

    button.innerHTML = (isOpen ? "∇" : "⊳") + " " + title;
    button.onclick = function(e) {
        isOpen = !isOpen;
        button.innerHTML = (isOpen ? "∇" : "⊳") + " " + title;
        innerContainer.style.display = isOpen ? "block" : "none";
    };

    panelContainer.appendChild(button);
    panelContainer.appendChild(innerContainer);
    container.appendChild(panelContainer);
    return innerContainer;
};

yoob.makeTextArea = function(container, cols, rows, initial) {
    var textarea = document.createElement('textarea');
    textarea.rows = "" + rows;
    textarea.cols = "" + cols;
    if (initial) {
        textarea.value = initial;
    }
    container.appendChild(textarea);
    return textarea;
};

yoob.makeLineBreak = function(container) {
    var br = document.createElement('br');
    container.appendChild(br);
    return br;
};

yoob.makeSelect = function(container, labelText, optionsArray, fun, def) {
    var label = document.createElement('label');
    label.innerHTML = labelText;
    container.appendChild(label);

    var select = document.createElement("select");

    for (var i = 0; i < optionsArray.length; i++) {
        var op = document.createElement("option");
        op.value = optionsArray[i][0];
        op.text = optionsArray[i][1];
        if (optionsArray[i].length > 2) {
            op.selected = optionsArray[i][2];
        } else {
            op.selected = false;
        }
        select.options.add(op);
    }

    if (fun) {
        select.onchange = function(e) {
            fun(optionsArray[select.selectedIndex][0]);
        };
    }

    if (def) {
        var i = 0;
        var opt = select.options[i];
        while (opt) {
            if (opt.value === def) {
                select.selectedIndex = i;
                if (fun) fun(def);
                break;
            }
            i++;
            opt = select.options[i];
        }
    }

    container.appendChild(select);
    return select;
};

var SliderPlusTextInput = function() {
    this.init = function(cfg) {
        this.slider = cfg.slider;
        this.textInput = cfg.textInput;
        this.callback = cfg.callback;
        return this;
    };

    this.set = function(value) {
        this.slider.value = "" + value;
        this.textInput.value = "" + value;
        this.callback(value);
    };
};

yoob.makeSliderPlusTextInput = function(container, label, min_, max_, size, value, fun) {
    yoob.makeSpan(container, label);
    var slider = yoob.makeSlider(container, min_, max_, value);
    var s = "" + value;
    var textInput = yoob.makeTextInput(container, size, s);
    slider.onchange = function(e) {
        textInput.value = slider.value;
        fun(parseInt(slider.value, 10));
    };
    textInput.onchange = function(e) {
        var v = parseInt(textInput.value, 10);
        if (!isNaN(v)) {
            slider.value = "" + v;
            fun(v);
        }
    };
    return new SliderPlusTextInput().init({
        'slider': slider,
        'textInput': textInput,
        'callback': fun
    });
};

var RangeControl = function() {
    this.init = function(cfg) {
        this.slider = cfg.slider;
        this.textInput = cfg.textInput;
        this.callback = cfg.callback;
        this.incButton = cfg.incButton;
        this.decButton = cfg.decButton;
        return this;
    };

    this.set = function(value) {
        this.slider.value = "" + value;
        this.textInput.value = "" + value;
        this.callback(value);
    };
};

yoob.makeRangeControl = function(container, config) {
    var label = config.label;
    var min_ = config['min'];
    var max_ = config['max'];
    var value = config.value || min_;
    var callback = config.callback || function(v) {};
    var textInputSize = config.textInputSize || 5;
    var withButtons = config.withButtons === false ? false : true;

    yoob.makeSpan(container, label);
    var slider = yoob.makeSlider(container, min_, max_, value);
    var s = "" + value;
    var textInput = yoob.makeTextInput(container, textInputSize, s);
    slider.onchange = function(e) {
        textInput.value = slider.value;
        callback(parseInt(slider.value, 10));
    };
    textInput.onchange = function(e) {
        var v = parseInt(textInput.value, 10);
        if (!isNaN(v)) {
            slider.value = "" + v;
            callback(v);
        }
    };
    var incButton;
    var decButton;
    if (withButtons) {
        decButton = yoob.makeButton(container, "-", function() { 
            var v = parseInt(textInput.value, 10);
            if ((!isNaN(v)) && v > min_) {
                v--;
                textInput.value = "" + v;
                slider.value = "" + v;
                callback(v);
            }
        });
        incButton = yoob.makeButton(container, "+", function() {
            var v = parseInt(textInput.value, 10);
            if ((!isNaN(v)) && v < max_) {
                v++;
                textInput.value = "" + v;
                slider.value = "" + v;
                callback(v);
            }
        });
    }
    return new RangeControl().init({
        'slider': slider,
        'incButton': incButton,
        'decButton': decButton,
        'textInput': textInput,
        'callback': callback
    });
};

yoob.makeSVG = function(container) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    /* <svg viewBox = "0 0 200 200" version = "1.1"> */
    container.appendChild(svg);
    return svg;
};

yoob.makeSVGElem = function(svg, tag, cfg) {
    var elem = document.createElementNS(svg.namespaceURI, tag);
    Object.keys(cfg).forEach(function(key) {
        elem.setAttribute(key, cfg[key]);
    });
    svg.appendChild(elem);
    return elem;
};
