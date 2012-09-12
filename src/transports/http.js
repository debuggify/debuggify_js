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

      // These defaults values are set according to the development environment
      // To use in production set custom values in the environments file
      // self.defaults = {
      //   level: 0,
      //   timestamp: true,
      //   apikey: 'local',
      //   domain: 'debuggify.net',
      //   port: '9001',
      // };

      self.options = extend(options, self.defaults);

      // Initialize the Transport Constructor
      self.initialize(self.options.level, self.options.timestamp);

      self.options.hostname = 'http://' + self.options.apikey + '.' + self.options.domain + ':' + self.options.port;

      if(!w.janky) {
        throw new Error ('janky lib not found');
      }
    }

    Http.prototype = new transports('Http');

    Http.prototype.send = function (message, info) {

      info.message = message;

      if(w && w.janky) {
        w.janky({

          url: this.options.hostname  + "/inputs/d00dadc0ffee",

          data: info,
          // {
            // foo: "xxzar",
            // foobar: [1,2,3]
            // multilevel: [1,2,3, [1,2,3]],
            // j: {"bar": "bar"}
            // len1: "1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc",
            // len2: "1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc",
            // len3: "1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc",
            // len4: "1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc",
            // len5: "1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc",
            // len6: "1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc",
            // len7: "1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc",
            // len8: "1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc",
            // len9: "1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc",
            // len10: "1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc",
            // len11: "1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc",
            // len12: "1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc1234567890qwertyuiopasdfghjklzxc",
            // json: {"bar": "bar", data: {}}
          // },

          method: "post",

          success: function(resp) {
            console.log('server responded with: ', resp);
          },

          error: function() {
            console.log('error =(');
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

