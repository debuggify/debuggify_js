/**
 * Debuggify Collector
 * @module debuggify/collector
 * @author Ankur Agarwal
 */

(function (debuggify, undefined) {

  var collector = debuggify.Collector = debuggify.Collector || (function (w, d, extend, globals, transports, envs) {
    var console = globals.selfLogger;
    /**
     * Collection of commands which are available in collector
     * @type {Object}
     */
    var funcs = {

      /**
       * Add a transport to a logger object
       * @param {string} transportName Name of the transport
       * @param {Object} options       settinngs required for the transport
       */
      _addTransport: function (transportName, options) {

        if(globals.transports[transportName] && transports[transportName]) {

          this.transports.push(new transports[transportName](options));

        } else {
          console.warn('transport ' + transportName + ' is not defined');
        }
      }
    };


    var toString = Object.prototype.toString;

    /**
     * Check whether its array or not
     * @param  {Object}  obj variable which need to be checked
     * @return {Boolean}     true if Array else false
     */
    function isArray (obj) {
      return toString.call(obj) === "[object Array]";
    }

    /**
     * Delete the array
     * @param  {Array} arr Array to be deleted
     * @return {undefined}
     */
    function deleteArray(arr) {
      arr.splice(0, arr.length);
    }

    /**
     * Initializing the collector
     * @return {undefined}
     */
    function init() {
      processProjects();
    }

    /**
     * process all the projects
     * @return {undefined}
     */
    function processProjects () {
      var project;
      var projectList = globals.projects;

      for (project in projectList) {
        if(projectList.hasOwnProperty(project)) {
          processQueue(projectList[project]);
        }
      }
    }

     /**
      * Process the queue for any project
      * @param  {Object} project project need to be processed
      * @return {undefined}
      */
    function processQueue (project) {

      // Initialize the queue if not already

      var queue = project.collectorQueue = project.collectorQueue || [];

      if(typeof queue.isCollector !== 'undefined') {
        return false;
      }

      if(!isArray(queue)) {
        throw 'Queue must be array';
      }

      var l = queue.length;

      // Process the data inside queue
      for (var i = 0; i < l; i++) {
        processCmd(queue[i], project);
      }

      // Delete elements inside array
      deleteArray(queue);

      // Overload the queue array to collector object
      project.collectorQueue = new Collector(project);
    }

    /**
     * Process cmd on any specific project environment
     * @param  {Array} cmd   Command with the arrguments
     * @param  {Object} self Project on which command is to executed
     * @return {undefined}
     */
    function processCmd(cmd, self) {

      // Checking for Array
      if (isArray(cmd)) {

        // Get the function name which is called
        var func = cmd[0];
        // Get the function argunments
        var args = Array.prototype.slice.call(cmd, 1);

        // if function start with _ then execute it else send to collector
        if(func[0] === '_' && typeof funcs[func] === "function") {

          // Execute the functions
          funcs[func].apply(self, args[0]);

          //sendDataToServer(args);
        } else {

          // Send to all the transports for project
          var l = self.transports.length;
          var transport;

          for(transport in self.transports){
            if(self.transports.hasOwnProperty(transport)) {
              var t = self.transports[transport];
              try {
                var level = self.options.messagesTypes[args[1].type];
                if(typeof level === "undefined" || t.options.level <= level) {
                  t.send.apply(self.transports[transport], args);
                }
              } catch (e){
                console.warn(t.name + ': Sending via transport failed: ' + e);
              }
            }
          }
        }

        // delete the array
       // deleteArray(cmd);


      } else {

        console.log(cmd);
        // Handle Invalid Data
        throw "Expecting array, got " + typeof cmd;

      }
    }

    /**
     * Collector Class
     * @constructor
     * @param {Object} project project which need to connected with collector
     */
    function Collector(project) {

      this.isCollector = true;
      this.project = project;

    }

    /**
     * Extending the prototypes of Collector Class
     * @type {Object}
     */
    Collector.prototype = {

      push: function (cmd) {
        return processCmd(cmd, this.project);
      }
    };

    return {
      init: init,
      process: processProjects
    };

  }(debuggify.win, debuggify.doc, debuggify.extend, debuggify.globals, debuggify.Transports, debuggify.envs));

}(debuggify));