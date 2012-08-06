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

    function extend(options, defaults) {

      var i;

      for(i in defaults) {
        if (defaults.hasOwnProperty(i) && typeof options[i] === 'undefined') {
          options[i] = defaults[i];
        }
      }
      return(options);
    }

    return {
      win: w,
      doc: w.document,
      console: w.console || null,
      extend: extend,
      globals: globals,
      version: version
    };

  }());

}(this, window));