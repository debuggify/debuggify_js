/**
 * Debuggify Transports Console
 *
 * @author Ankur Agarwal
 */

(function (debuggify, undefined) {

  var transports = debuggify.Transports;
  var console = transports.Console = transports.Console || (function (w, d, extend, globals, transports) {

    // TODO: Use it to add templating support in the messages
    // Format for the message
    // function formatMessage(message, type, namespace, options) {

    //   // For string
    //   if(typeof message === 'string'){
    //     try {
    //       // compile the template if not already done
    //       options.compiledTemplate = options.compiledTemplate || utils.processTemplate('[<%= namespace %>][<%= type %>] <%= message %>');

    //       // Populate the data in to the template
    //       return options.compiledTemplate ({
    //         message: message,
    //         type: type,
    //         namespace: namespace
    //       });
    //     } catch (e){
    //       return '[' + namespace + '][' + type + ']' + message;
    //     }

    //   } else {

    //     return message;

    //   }
    // }


    // Console
    function Console (options) {

      options = options || {};

      var self = this;
      self.defaults = {
        level: 0,
        silent: true,
        timestamp: true
      };

      self.options = extend(options, self.defaults);

      // Initialize the Transport Constructor
      self.initialize(self.options.level, self.options.silent, self.options.timestamp);

    }

    Console.prototype = new transports('Console');

    /**
     * Format the message for showing more detailed information
     * @return {Object} Formated message
     */
    Console.prototype.format = function() {

      var prefix = '';

      if(this.timestamp) {
        var t = arguments[1].timestamp;
        prefix = t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds() + ' ';
      }

      return [ prefix + arguments[1].namespace, arguments[0]];
    };

    /**
     * Api to send the message to the console
     * @return {undefined}
     */
    Console.prototype.send = function () {

      var rawMessage = arguments[0];
      var type = arguments[1].type;
      // var namespace = arguments[1].namespace;
      // var options = arguments[1];

      var message = this.format.apply(this, arguments);
      // w.console.log(formatMessage(rawMessage, type, namespace, options));


      // TODO: Add checks for opera and other browsers
      // Check if console object is present
      // Mostly for webkit base browsers and firebug
      if(w && w.console){

        var con = w.console;

        if(!con[type]){
          // Fallback to console.log
          type = 'log';
        }

        // Console.log.apply doesn't handle multiple arguments in Safari 3 or Chrome 1
        // http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/

        if(con[type]['apply']) {

          con[type]['apply']( con, message);

        } else {

          con[type]['call']( con, Array.prototype.slice.call( message) );

        }



      } else {

        // Fallback to alert
        alert(message);

      }
    };

    return Console;

  }(debuggify.win, debuggify.doc, debuggify.extend, debuggify.globals, transports));

}(debuggify));