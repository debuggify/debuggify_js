/**
*
* Debuggify JS
* version 0.0.1
*
* @author Ankur Agarwal
*
*/

(function (global, w, undefined) {

  var debuggify = global.debuggify = global.debuggify || (function(){

    var version = '0.0.1';

//    w._dfy = w._dfy || {};

    var globals = {

      // Sore the reference to the root node project for the tree
      // that have been initialized
      projects: {},

      // All the namespaces that have been used by the modules
      // theses namespace reference to the objects for which they are declared
      namespaces: {},

      // Store all the different type of transports available
      transports: {},

      delimiter: '__',

      selfLogger: null

    };

    var envs = {};

    var env = "development";

    function Debuggify () {

      var self = this;

      self.globals = globals;
      self.win = w;
      self.doc= w.document;
      self.console = w.console || null;
      self.envs = envs;
      self.env = env;
      self.version = version;
    }

    Debuggify.prototype = {

      initialize: function() {

        // Initialize defaults
        this.setDefaults();

      },

      extend: function(options, defaults) {

        var i;

        for(i in defaults) {
          if (defaults.hasOwnProperty(i) && typeof options[i] === 'undefined') {
            options[i] = defaults[i];
          }
        }

        return(options);
      },

      /**
       * Get the settings from all different loaded environments
       * @param  {string} key the module / utility for which settings is required
       * @return {Object}     the environments objects containing only the settings related to key
       */
      getAllEnvironments: function (key) {

        var e = {};
        var prop;
        var envs = this.envs;

        for(prop in envs) {
          if(envs.hasOwnProperty(prop) && typeof envs[prop][key] !== 'undefined' ) {
            e[prop] = envs[prop][key];
          } else {
            e[key] = {};
          }
        }
        return e;
      },


      getSettings: function(key, environment) {

        // Fallback to default environment
        if(!environment) {
          environment = this.env;
        }

        if( typeof envs[environment] !== 'undefined' && typeof envs[environment][key] !== 'undefined') {
          return envs[environment][key];
        }

        return false;
      },

      setDefaults: function(id) {

        if(!id && this._id) {
          id = this._id;
        }

        this._id = id;
        var envs = this.envs;

        this.defaults = this.extend(this.extend(this.extend({}, envs.defaults[id]), envs[this.env][id]), envs.defaults.all);
      }

    }

    // var output = {
    //   win: w,
    //   doc: w.document,
    //   console: w.console || null,
    //   extend: extend,
    //   globals: globals,
    //   envs: envs,
    //   env: env,
    //   version: version
    // };


    return new Debuggify();

  }());

}(this, window));