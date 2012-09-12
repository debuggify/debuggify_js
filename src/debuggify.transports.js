/**
 * Debuggify Transports
 * @module debuggify/transports
 * @author Ankur Agarwal
 */

(function (debuggify, undefined) {

  var transports = debuggify.Transports = debuggify.Transports || (function (w, d, extend, globals) {

    /**
     * Transports Class
     * @constructor
     * @param {string} name Name of transport
     */
    function Transports(name) {
      this.name = name;

      // Add the transports in the globals
      if(typeof globals.transports[name] === 'undefined') {
        globals.transports[name] = {};
      }

      this.setDefaults(name);
    }

    /**
     * Extending the Transports prototype
     * @type {Object}
     */
    Transports.prototype = debuggify;



    Transports.prototype.initialize = function (level, timestamp) {

      this.level = level;
      this.timestamp = timestamp;
    },

    Transports.prototype.setLevel = function (level) {
      this.level = level;
    },

    Transports.prototype.send = function () {
      throw 'Send is Not Implemented for transport' + this.name;
    }


   return Transports;

  }(debuggify.win, debuggify.doc, debuggify.extend, debuggify.globals));

}(debuggify));