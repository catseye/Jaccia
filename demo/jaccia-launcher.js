function launch(prefix, container, config) {
  if (typeof container === 'string') {
    container = document.getElementById(container);
  }
  config = config || {};
  var deps = [
    "yoob/element-factory.js",
    "yoob/playfield.js",
    "yoob/playfield-html-view.js",
    "yoob/playfield-canvas-view.js",
    "yoob/controller.js",
    "yoob/source-manager.js",
    "yoob/preset-manager.js",
    "../script/jaccia.js"
  ];
  var loaded = 0;
  var onload = function() {
    if (++loaded < deps.length) return;
    /* ----- launch, phase 1: create the UI ----- */
    var controlPanel = yoob.makeDiv(container);
    controlPanel.id = "panel_container";

    var subPanel = yoob.makeDiv(container);
    var selectConfiguration = yoob.makeSelect(subPanel, 'example configuration:', []);

    yoob.makeLineBreak(subPanel);
    var changeDepiction;
    var selectDepiction = yoob.makeSelect(subPanel, 'depict using:', [
      ['text', 'text'],
      ['canvas', 'canvas']
    ], function(value) {
      changeDepiction(value);
    });

    var displayContainer = yoob.makeDiv(container);
    displayContainer.id = 'display_container';

    var displayText = yoob.makePre(displayContainer);

    var displayCanvas = yoob.makeCanvas(displayContainer);

    var editor = yoob.makeTextArea(displayContainer, 40, 25);

    var htmlView = new yoob.PlayfieldHTMLView().init({
      element: displayText
    });
    htmlView.draw = function() {
        this.element.innerHTML = this.pf.dump(dumpMapper);
    };

    // CanvasView
    var colourMap = {
     'Space': '#ffffff',
     'Wall':  '#000000',
     'Slime': '#00a000',
     'Food2': '#ff0000',
     'Food':  '#0000ff'
    };
    var canvasView = new yoob.PlayfieldCanvasView().init({
      canvas: displayCanvas
    });
    canvasView.drawCell = function(ctx, value, playfieldX, playfieldY,
                                   canvasX, canvasY, cellWidth, cellHeight) {
       ctx.fillStyle = colourMap[value] || '#ffffff';
       ctx.fillRect(canvasX, canvasY, cellWidth, cellHeight);
    };

    // Playfield
    var pf;

    // "View Manager"
    var currentView = 'text';
    var views = {
        'text': htmlView,
        'canvas': canvasView
    };
    var draw = function(pf) {
        views[currentView].setPlayfield(pf);
        views[currentView].draw();
    };
    changeDepiction = function(value) {
      if (value === 'text') {
          displayText.style.display = 'block';
          displayCanvas.style.display = 'none';
      } else {
          displayText.style.display = 'none';
          displayCanvas.style.display = 'block';
      }
      currentView = value;
      draw(pf);
    }

    /* ----- launch, phase 2: connect the controller ----- */
    var controller = (new yoob.Controller()).init({
      panelContainer: controlPanel,
      step: function() {
        var newPf = (new yoob.Playfield()).init({ defaultValue: 'Space' });
        evolve_playfield(pf, newPf);
        pf = newPf;
        draw(pf);
      },
      reset: function(text) {
        pf = (new yoob.Playfield()).init({ defaultValue: 'Space' });
        pf.load(0, 0, text, loadMapper);
        draw(pf);
      }
    });
    controller.clickStop();

    var sourceManager = (new yoob.SourceManager()).init({
      panelContainer: controlPanel,
      editor: editor,
      hideDuringEdit: [displayText, displayCanvas],
      disableDuringEdit: [controller.panel],
      storageKey: 'jaccia.alp',
      onDone: function() {
          controller.performReset(this.getEditorText());
      }
    });
    var p = (new yoob.PresetManager()).init({
      selectElem: selectConfiguration,
      controller: controller
    }).populateFromPairs(sourceManager, exampleConfigurations);
  };
  for (var i = 0; i < deps.length; i++) {
    var elem = document.createElement('script');
    elem.src = prefix + deps[i];
    elem.onload = onload;
    document.body.appendChild(elem);
  }
}
