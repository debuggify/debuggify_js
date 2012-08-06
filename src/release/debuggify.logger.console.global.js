//>>excludeStart("norequireExclude", pragmas.norequireExclude);

require(['debuggify.logger', 'transports/console']);

//>>excludeEnd("norequireExclude");


(function (w) {

  // If the existing console object is not already debuggify Logger object
  // extend it
  if(typeof w.console.isLogger === "undefined") {
    var console = debuggify.Logger.create('debuggifyConsole');
    console.addTransport('Console', {});
    w.console = console;
  }
})(window);