//>>excludeStart("norequireExclude", pragmas.norequireExclude);

require([

  // Environments
  'environments/development',
  'environments/production',
  'environments/testing',

  // Utitlities
  'debuggify.logger',
  'debuggify.collector',

  // Transports
  'transports/console',
  'transports/websockets'

]);

//>>excludeEnd("norequireExclude");

(function (w) {

  // If the existing console object is not already debuggify Logger object
  // extend it
  if(typeof w.console.isLogger === "undefined") {
    var console = debuggify.Logger.create('global');
    w.console = console;
  }

})(window);