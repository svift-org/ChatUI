var chatUI = (function (container) {
  
  var module = {};

  module.container = container;
  module.config = null;
  module.bubbles = [];
  module.ID = 0;
  module.keys = {};
  module.types = {};
  module.scroll = container.append('<div id="cb-flow"></div>');
  module.flow = module.scroll.append('<div class="cb-inner"></div>');
  module.input = container.append('<div id="cb-input" style="display:none;"></div>');
  module.input.append('<input type="text" />');
  module.input.append('<button>+</button>');

  module.addBubble = function (options, callback) {
    callback = callback || function () { };

    if (!(options.type in module.types)) {
      throw 'Unknown bubble type';
    } else {

      module.ID++;
      var id = module.ID;
      module.bubbles.push({
        id: id,
        type: options.type
        //additional info
      });
      module.keys[id] = module.bubbles.length - 1;

      //segment container
      var outer = module.flow.append('<div class="cb-segment cb-' + options.class + '" id="cb-segment-' + id + '"></div>');

      //speaker icon
      outer.append('<div class="cb-icon"></div>');

      var bubble = outer.append('<div class="cb-bubble ' + options.class + '"></div>').append('<div class="cb-inner"></div>');

      outer.append('<hr />');

      module.types[options.type](bubble, options, callback);

      module.scrollTo('end');

      return module.ID;
    }
  };

  module.showInput = function (submitCallback, typeCallback) {
    if (typeCallback) {
      module.input.find('input')
        .on('change', function () {
          typeCallback(d3.select(this).node().value);
        });
    } else {
      module.input.find('input').on('change', function () { });
    }

    module.input.select('button')
      .on('click', function () {
        submitCallback(module.input.select('input').node().value);
      });

    module.input.style('display', 'block');
    module.flow.classed('cb-w-input', true);

    //TODO: set focus -> check if this works
    module.input.select('input').node().blur();
    module.scrollTo('end');
  };

  module.hideInput = function () {
    module.input.style('display', 'none');
    module.flow.classed('cb-w-input', false);
    module.scrollTo('end');
  };

  module.removeBubble = function (id) {
    module.flow.select('#cb-segment-' + id).remove();
    module.bubbles.splice(module.keys[id], 1);
    delete module.keys[id];
  };

  module.removeBubbles = function (id) {
    for (var i = module.bubbles.length - 1; i >= module.keys[id]; i--) {
      module.removeBubble(module.bubbles[i].id);
    }
  };

  module.getBubble = function (id) {
    return {
      el: module.flow.select('#cb-segment-' + id),
      obj: module.bubbles[module.keys[id]]
    };
  };

  //Accepts position = 'end' (bottom) || 'start' (top)
  module.scrollTo = function (position) {
    //start
    var s = 0;
    //end
    if (position == 'end') {
      s = module.scroll.property('scrollHeight') - window.innerHeight;
    }
    d3.select('#cb-flow').transition()
      .duration(300)
      .tween("scroll", scrollTween(s));

  };

  function scrollTween(offset) {
    return function () {
      var i = d3.interpolateNumber(module.scroll.property('scrollTop'), offset);
      return function (t) { module.scroll.property('scrollTop', i(t)); };
    };
  }

  return module;
});