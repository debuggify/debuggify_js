/**
 *
 * Debuggify Transports Http
 * version 0.0.1
 *
 * @author Ankur Agarwal
 *
 */

(function (debuggify, undefined) {

  var transports = debuggify.Transports;
  var http = transports.Http = transports.Http || (function (w, d, extend, globals, transports) {

    var delimiter = '_';

    // Http
    function Http (options) {

      // Validate the input
      options = options || {};

      var self = this;

      self.options = extend(options, self.defaults);

      // Initialize the Transport Constructor
      self.initialize(self.options.level, self.options.timestamp);

      self.options.hostname = '//' + self.options.apikey + '.' + self.options.domain + ':' + self.options.port;

      if(!w.janky) {
        throw new Error ('janky lib not found');
      }
    }

    Http.prototype = new transports('Http');

    Http.prototype.send = function (message, info) {

      info.message = message;
      info.org = this.options.org;

      if(w && w.janky) {
        w.janky({

          url: this.options.hostname  + "/http",

          data: info,

          method: "post",

          success: function(resp) {
            // console.log('server responded with: ', resp);
          },

          error: function() {
            // console.log('error =(');
          }
        })

      }
    };


    /**
     * Get the settings from all different loaded environments
     * @param  {string} key the module / utility for which settings is required
     * @return {Object}     the environments objects containing only the settings related to key
     */
    function getAllEnvironments(key) {
      var e = {};
      var prop;
      for(prop in envs) {
        if(envs.hasOwnProperty(prop) && typeof envs[prop][key] !== 'undefined' ) {
          e[prop] = envs[prop][key];
        } else {
          e[key] = {};
        }
      }
      return e;
    }

    return Http;

  }(debuggify.win, debuggify.doc, debuggify.extend, debuggify.globals, transports));

}(debuggify));