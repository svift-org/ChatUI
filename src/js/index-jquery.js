/**
 * chatUI constructor
 * @constructor
 * @param {jquery-selection} container - Container for the chat interface.
 * @return {object} chatUI object
 */
var chatUI = (function (container) {
  
  var module = {};

  module.container = container.append('<div id="cb-container"></div>');
  module.config = null;
  module.bubbles = [];
  module.ID = 0;
  module.keys = {};
  module.types = {};
  module.inputState = false;
  module.height = 0;
  module.scroll = module.container.append('<div id="cb-flow"></div>');
  module.flow = module.scroll.append('<div class="cb-inner"></div>');
  module.input = module.container.append('<div id="cb-input" style="display:none;"></div>');
  module.input.append('<div id="cb-input-container"><input type="text" /></div>');
  module.input.append('<button>+</button>');


  /**
   * updateContainer should be called when height or width changes of the container changes
   * @memberof chatUI
   */
   module.updateContainer = function(){
      module.height = module.container.outerHeight();
      module.flow.css('padding-top', module.height+'px');
      module.scroll.css('height', (module.height-((module.inputState==true)?77:0))+'px');
      module.scrollTo('end');
  };

  /**
   * @memberof chatUI
   * @param {object} options - object containing configs {type:string (e.g. 'text' or 'select'), class:string ('human' || 'bot'), value:depends on type}
   * @param {function} callback - function to be called after everything is done
   * @return {integer} id - id of the bubble 
   */
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
      var outer = module.flow.append('<div class="cb-segment cb-' + options.class + ' cb-bubble-type-' + options.type + '" id="cb-segment-' + id + '"></div>');

      //speaker icon
      outer.append('<div class="cb-icon"></div>');

      var bubble = outer.append('<div class="cb-bubble ' + options.class + '"><div class="cb-inner"></div></div>');

      outer.append('<hr />');

      module.types[options.type](bubble, options, callback);

      module.scrollTo('end');

      return module.ID;
    }
  };

  /**
   * @memberof chatUI
   * @param {jquery-selection} bubble - jquery selection of the bubble container
   * @param {object} options - object containing configs {type:'text', class:string ('human' || 'bot'), value:array of objects (e.g. [{label:'yes'}])}
   * @param {function} callback - function to be called after everything is done
   */
  module.types.select = function(bubble, options, callback){
    options.value.forEach(function(d){
      bubble.append('<div class="cb-choice">' + d.label + '</div>').on('click', function(){
        $(this).addClass('cb-active');
        $(this).parent().find('.cb-choice').on('click', function(){});
        callback(d);
      });
    });
  };

  /**
   * @memberof chatUI
   * @param {jquery-selection} bubble - jquery selection of the bubble container
   * @param {object} options - object containing configs {type:'text', class:string ('human' || 'bot'), value:string (e.g. 'Hello World')}
   * @param {function} callback - function to be called after everything is done
   */
  module.types.text = function (bubble, options, callback) {
    if (('delay' in options) && options.delay) {
      bubble.append('<div class="cb-waiting"><div class="circle"></div><div class="circle"></div><div class="circle"></div></div>');

      setTimeout(function () {

        bubble.find(".cb-waiting").remove();
        module.appendText(bubble, options, callback);

      }, (isNaN(options.delay) ? 1000 : options.delay));
    } else {
      module.appendText(bubble, options, callback);
    }

  };

  /**
   * Helper Function for adding text to a bubble
   * @memberof chatUI
   * @param {jquery-selection} bubble - jquery selection of the bubble container
   * @param {object} options - object containing configs {type:'text', class:string ('human' || 'bot'), value:string (e.g. 'Hello World')}
   * @param {function} callback - function to be called after everything is done
   */
  module.appendText = function(bubble, options, callback) {
    bubble.attr('class', 'bubble-ctn-' + options.class).append('<p>' + options.value + '</p>')
      .animate({
      width: "auto",
      opacity: 1
    }, 200);

    chat.scrollTo('end');

    callback();
  };

  /**
   * Showing the input module and set cursor into input field
   * @memberof chatUI
   * @param {function} submitCallback - function to be called when user presses enter or submits through the submit-button
   * @param {function} typeCallback - function to when user enters text (on change)
   */
  module.showInput = function (submitCallback, typeCallback) {
    module.inputState = true;

    if (typeCallback) {
      module.input.find('input')
        .on('change', function () {
          typeCallback($(this).val());
        });
    } else {
      module.input.find('input').on('change', function () { });
    }

    module.input.find('input').on('keyup', function (e) {
        if (e.keyCode == 13) {
          submitCallback(module.input.find('input').val());
          module.input.find('input').val('');      
        }
    });

    module.input.find('button')
      .on('click', function () {
        submitCallback(module.input.find('input').val());
        module.input.find('input').val('');
      });

    module.input.css('display', 'block');
    module.updateContainer();

    module.input.find('input').focus();
    module.scrollTo('end');
  };

  /**
   * Hide the input module
   */
  module.hideInput = function () {
    module.input.find('input').blur();
    module.input.css('display', 'none');
    module.inputState = false;
    module.updateContainer();
    module.scrollTo('end');
  };

  /**
   * Remove a bubble from the chat
   * @memberof chatUI
   * @param {integer} id - id of bubble provided by addBubble
   */
  module.removeBubble = function (id) {
    module.flow.find('#cb-segment-' + id).remove();
    module.bubbles.splice(module.keys[id], 1);
    delete module.keys[id];
  };

  /**
   * Remove all bubbles until the bubble with 'id' from the chat
   * @memberof chatUI
   * @param {integer} id - id of bubble provided by addBubble
   */
  module.removeBubbles = function (id) {
    for (var i = module.bubbles.length - 1; i >= module.keys[id]; i--) {
      module.removeBubble(module.bubbles[i].id);
    }
  };

  /**
   * Remove all bubbles until the bubble with 'id' from the chat
   * @memberof chatUI
   * @param {integer} id - id of bubble provided by addBubble
   * @return {object} obj - {el:jquery-selection, obj:bubble-data}
   */
  module.getBubble = function (id) {
    return {
      el: module.flow.find('#cb-segment-' + id),
      obj: module.bubbles[module.keys[id]]
    };
  };

  /**
   * Scroll chat flow
   * @memberof chatUI
   * @param {string} position - where to scroll either 'start' or 'end'
   */
  module.scrollTo = function (position) {
    //start
    var s = 0;
    //end
    if (position == 'end') {
      s = document.getElementById("cb-flow").scrollHeight - (window.innerHeight-77);
    }

    $('#cb-flow').stop().animate({scrollTop:s}, 300);
  };

  function debouncer( func , _timeout ) {
    var timeoutID , timeout = _timeout || 200;
    return function () {
      var scope = this , args = arguments;
      clearTimeout( timeoutID );
      timeoutID = setTimeout( function () {
        func.apply( scope , Array.prototype.slice.call( args ) );
      } , timeout );
    };
  }

  //On Resize scroll to end
  $(window).on('resize', debouncer(function(e){
      module.updateContainer();
  }, 200));

  module.updateContainer();

  return module;
});