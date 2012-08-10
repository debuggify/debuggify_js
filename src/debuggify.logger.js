/**
 * Debuggify Logger
 * @module debuggify/logger
 * @author Ankur Agarwal
 */
(function( debuggify, undefined ) {

  var logger = debuggify.Logger = debuggify.Logger || (function(w,d,extend, utils, globals, envs) {

    /**
     * Regex to filter unwanted elements from the stack
     *
     * @type {RegExp}
     */
    var stackRegex = /Object.genericMessage/;

    /**
     * Extract file information from the stack trace
     *
     * @type {RegExp}
     */
    var fileInfoRegex = /\((.*?)(?::(\d+))(?::(\d+))?(?: -- .+)?\)$/;

    /**
     * Store url query string as json object
     *
     * @type {Object}
     */
    var urlParameters;

    /**
     * Keep different configurations
     *
     * @type {Object}
     */
    var environments_ = envs;

    /**
     * Store the status of message types
     *
     * @type {Object}
     */
    var flags_ = {};

    /**
     * Empty function
     *
     * @return {function} [description]
     */
    var emptyFunction = function (){};

    /**
     * Logger Class
     * @constructor
     *
     * @param {string} name    Name of logger object
     * @param {Object} environments  All different type of enviroments and their settings
     * @param {Object} options options that override the different configurations
     */
    function Logger(name,environments,options) {
      this.initialize(name,environments,options);
    }

    // Extending the prototype
    Logger.prototype = {

      /**
       * set the current environment
       * @function
       * @param {[type]} environmentName Name of the environment
       */
      setEnv: function setEnv(environmentName) {

        var env = this.environments;

        // check whether the environment is valid or not
        if(typeof env === 'undefined' ||
          typeof env[environmentName] === 'undefined') {
          throw 'Invalid environment name ' + environmentName + ' for project ' + this.name;
        }

        // Load the environment
        this.options = extend(env[environmentName], {});

        this.env = environmentName;

      },

      /**
       * Constructor for the Logger Object
       *
       * @param {string} name    Name of logger object
       * @param {Object} environments  All different type of environments
       * @param {Object} options options that override the different configurations
       * @return {undefined}
       */
      initialize: function initialize (name,environments,options) {

        var self = this;

        // Name of the object
        self.name = name;

        self.isLogger = true;

        self._childrens = {};

        self.history = [];

        // All the environments required by the module

        if(environments) {

          // the current environments will be used
          self.environments = environments;

          // Current extended options to be used
          self.options = options;

          // Initialize the functions
          self.setEnv('defaults');
        }


        // Evaluate namespace on the basis on the parent
        self.setNamespace();
      },

      /**
       * Set the level of messages that should be logged
       * TRACE: 0,
       * INFO: 1,
       * WARN: 2,
       * ERROR: 3,
       * SILENT: 4
       *
       * @param {number} level message level
       * @return {Boolean} true on success, false on failure
       */
      setLevel: function (level) {
        level = parseInt(level, 10);
        if(typeof level !== 'number' || isNaN(level) ) {
          return false;
        }
        this.options.level = level;
        installFunctions(this, this.options);
        return true;
      },

      /**
       * Set the flags
       *
       * @param {'string'} type  type of messageType
       * @param {Boolean} value value of flag
       * @return {Boolean} true if success else false
       */
      setFlag: function (type, value) {

        if(flags_[this.namespace] && typeof flags_[this.namespace][this.options.flagPrefix + type] !== 'undefined') {
          flags_[this.namespace][this.options.flagPrefix + type] = value;
          return true;
        }
        return false;
      },

     /**
      * Create a new logger object wrt current object
      *
      * @param {string} name Name of logger object
      * @param {Object} environments  All different type of environments
      * @param {Object} parent parent for the logger object to be created
      * @return {Object} A new generated logger object if everything goes fine, else false
      */
      addModule: function addModule(name, environments, parent) {

        try {

          // Validate the input
          if(! (typeof name === 'string' && name !== "") ) {
            throw 'Invalid name';
          }

          if(typeof environments === 'undefined') {
            environments = {defaults:{}};
          }

          if(typeof parent === 'undefined') {
            parent = this;
          }

          // Checking whether module is already initialized or not
          if(typeof this.modules[name] !== 'undefined') {
            throw 'Module ' + name + ' already initialized';
          }

          environments = extendEnvironments(environments, true);

          function Module() {}

          // Set the parent module
          Module.prototype = parent;

          // Create a new object
          var module = new Module();
          module.initialize(name, environments, extend(extend({}, this.options), environments));

          // Add the module to the list of children
          parent._childrens[name] = module;
          module.parent = parent;

          // link to the global object for reference from outside the module
          globals.namespaces[module.namespace] = module;

          installFlags(module, module.namespace);

          // Add the modules to the list of all modules for this project
          parent.modules[module.name] = module;

          // Add the modules to the list of all modules for this project
          module.genericMessage([module.name, module.namespace, module.options, parent.namespace], '_addModule');

          return module;

        } catch (e) {
          selfLogger.message(['Cannot add module name'  +
            name + 'due to error:' + e], 'logger', 'error');
          return false;
        }
      },

      /**
       * return the logger if already exist else create one and return
       *
       * @param {string} name         Name of logger object
       * @param  {Boolean} createNew  if false then new logger object will not be created, default true
       * @return {Object}             A new generated logger object
       */
      get: function (name, createNew) {

        // return if the module is already defined
        if(typeof this.modules[name] !== 'undefined') {
          return  this.modules[name];
        }


        if(typeof createNew !== 'undefined' && createNew === false) {
          return false;
        }

        // Create a new module and return that
        return this.addModule(name, {});

      },

      /**
       * A generic way to send message of any specific type
       *
       * @param  {Object} message    message to send ex: 'dummy message'
       * @param  {string} moduleName Name of module ex: 'foo', 'bar'
       * @param  {string} type       type of message ex: 'log', 'error', 'warn' etc
       * @return {undefined}
       */
      message: function(message, moduleName, type) {
        this.get(moduleName).genericMessage([message], type);
      },

      /**
       * Automatic set the namespace
       */
      setNamespace: function () {

        if(this.namespace) {
          this.namespace = this.namespace + globals.delimiter + this.name;
        } else {
          this.namespace = this.name;
        }
      },

      /**
       * Add the transport for project
       *
       * @param  {string} transportName Name of the transport
       * @param  {Object} options       Options required for the transport
       * @return {undefined}
       */
      addTransport: function(transportName, options) {
        this.genericMessage([transportName, options], '_addTransport');
      },

      /**
       * Send a message to collector object
       *
       * @param  {Array} data Array of arguments to be send to collector
       * @return {undefined}
       */
      sendToCollector: function (data) {
        var self = this;
        var options = self.options;

        // Adding some common parameters
        data[2].location = d.location.href;

        if(options.collector) {
          self.collectorQueue.push(data);
        }

        if(!options.optimize && options.history) {
          self.history.push(data);
        }

      },

      genericMessage: genericMessage
    };

    /**
     * Extract the file info from the stack frame
     *
     * @param  {string} frame one frame of a stack
     * @return {Object}       file information object
     */
    function getFileInfo(frame) {

      try {

        var m = fileInfoRegex.exec(frame);

        if (m) { // If falsey, we did not get any file/line information

          return {
            file: m[1],
            fileName: m[1].substr(m[1].lastIndexOf("/") + 1),
            lineNo: m[2],
            charNo: m[3]
          };
        }
      } catch (e) {
        return false;
      }
    }

    /**
     * Generate message on the basis of certain parameter
     *
     * @param  {Array} messageArray Array of data to be send in the message
     * @param  {string} type         type of message
     * @return {[type]}              composed message  from various details
     */
    function genericMessage(messageArray, type) {

      var self = this;
      // Get the stack
      var stack = utils.getStackTrace(self.options.optimize ? {} : {guess: true});

      var elNo = 2;
      var stackLength = stack.length;
      var stackElement;

      // Find the regex inside the array
      while(elNo <= stackLength) {

        // Get the elemnt in the stack
        stackElement = stack[elNo];

        //
        if(stackRegex.test(stackElement)) {
          elNo = elNo + 2;
          break;
        }

        elNo = elNo + 1;
      }

      // remove the non app specific data
      var appStack = stack.slice(elNo);

      // Extract the line no and file name
      var info = getFileInfo(appStack[0]) || {};

      info.type = type;
      info.name = self.name;
      info.namespace = self.namespace;
      info.stack = appStack;
      info.timestamp = new Date();

      // Format [<function Name> <argument1> <argument2> ... <argumentn>]
      self.sendToCollector([type, messageArray, info]);
    }

    /**
     * Generate dynamic function based on the options
     *
     * @param  {string} type    type of function
     * @param  {Object} options other details required to generate the function
     * @return {function}         return the generated function
     */
    function getFunc(type, options) {

      // If optimized function is required
      if(options.optimize){

        return emptyFunction;

      } else {

        // If not optimized function is required
        return function() {
          var namespace = this.namespace;
          var options = this.options;

          // if typeflag exist and its set then do the logging
          if (typeof flags_[namespace][options.flagPrefix + type] !== 'undefined' &&
            flags_[namespace][options.flagPrefix + type] &&
            flags_[namespace][options.flagPrefix + type] !== 'false') {

            this.genericMessage(arguments, type);

          }

        };

      }
    }


    /**
     * Generate and install dynamic function for different message types
     *
     * @param  {Object} context the object on which the functions are to installed
     * @param  {Object} options details need to decide which functions to install
     * @return {Object}         the extended context object
     */
    function installFunctions(context, options) {

      var type;
      var types = options.messagesTypes;

      // Install all the message type in the context
      for (type in types) {

        if(types.hasOwnProperty(type) && types[type] >= options.level) {
          context[options.functionPrefix + type] = getFunc(type, options);
        } else {
          context[options.functionPrefix + type] = emptyFunction;
        }
      }
    }

    /**
     * Install flags which keep track of different message types
     *
     * @param  {Object} context the object on which the functions are to installed
     * @param  {Object} options details need to decide which functions to install
     * @return {undefined}
     */
    function installFlags(context, namespace) {

      var options = context.options;
      var type;
      var types = options.messagesTypes;

      flags_[namespace] = flags_[namespace] || {};

      for (type in types) {
        flags_[namespace][options.flagPrefix + type] = getFirstDefinedValue(
          urlParameters[namespace + globals.delimiter + type],
          urlParameters[namespace],
          urlParameters[type],
          types[type] >= options.level
        );
      }
    }

    /**
     * Return the first not undefined values from the list of values
     *
     * @return {Object}
     */
    function getFirstDefinedValue() {

      var i;
      var l = arguments.length;

      for (i =  0; i < l; i = i + 1) {
        if(typeof arguments[i] !== 'undefined') {
          return arguments[i];
        }
      }
    }

    /**
     * Generate configurations for different environments using defaults
     *
     * @param  {Object} environments take different types of environments
     * @param  {Boolean} returnEmpty   flag which tells return false or defaults when enviroment passed is empty or not defined
     * @return {Object}                returned the extended environments
     */
    function extendEnvironments (environments, returnEmpty) {


      if(typeof environments === 'undefined') {
        return false;
      }

      var env = {};

      // Calculate the defaults extending the user and library defaults
      var defaults = (typeof environments.defaults !== 'undefined') ?
        extend(environments.defaults, environments_.defaults) : environments_.defaults;

      var i;
      var count = 0;

      // Calculate the other environments as per the defaults
      for (i in environments){
        if(environments.hasOwnProperty(i)) {

          if(typeof environments_[i] === 'undefined') {

            // No similar env found so override with defaults to get
            // the final settings
            environments_[i] = extend(environments[i], defaults);

          } else {

            // Overide the already defined envs
            // and then overide the defaults
            env[i] = extend(extend(environments[i], environments_[i]), defaults);
          }
        }

        count = count + 1;
      }

      // if the return empty is enabled and no envs are present
      if(typeof returnEmpty !== 'undefined' && returnEmpty === true && count === 0) {
        return false;
      }

      return env;

    }

   /**
    * Create root logger object for the whole project
    *
    * @param  {string} name           Name of the project
    * @param  {Object} environments environments for the project
    * @return {Object}                return the logger object
    */
    function project(name, environments) {


      // Check for the valid name
      if(typeof name === 'undefined') {
        throw 'No name defined';
      }

      // Check for the valid project name
      if(typeof environments === 'undefined') {
        environments = {defaults: {}};
      }

      var env = extendEnvironments(environments);


      // Creating Project construction dynamically
      function Project(name) {

        // Store the list of modules
        this.modules = {};

        // Store all the logging messages
        this.collectorQueue = [];

        // This transport
        this.transports = [];
      }

      Project.prototype = new Logger(name, env, {});

      //Install the basic messageTypes inside the project prototype
      installFunctions(Project.prototype, Project.prototype.options);

      // Create a new object of the dynamically created class
      var project = new Project(name);

      // link to the global object for reference from outside the module
      globals.namespaces[project.namespace] = project;
      globals.projects[project.name] = project;

      // Initialize the url options
      installUrlOptions(project);

      installFlags(project, project.namespace);

      // Install the transports
      installTransports(project);

      // Add a command to be send to the transport
      project.genericMessage([project.name, project.namespace, project.options, false], '_addProject');

      // Send a call to collector to process all projects
      if(debuggify && debuggify.Collector && debuggify.Collector.process){
        debuggify.Collector.process();
      }

      // Return the dynamic project object which will act a root node for
      // all the project
      return project;

    }

    /**
     * Install the transport for project
     *
     * @param  {project} project The project object in which the transports are to installed
     * @return {undefined}
     */
    function installTransports (project) {

      var transports = project.options.transports;

      for(var transport in transports) {
        project.addTransport(transport, transports[transport]);
      }
    }

    /**
     * convert string to boolean vales
     *
     * @param  {[type]} obj which need conversion
     * @return {[type]}     return modified object
     */
    function checkForBoolean (obj){

      var prop;
      var value;

      for(prop in obj) {
        if(obj.hasOwnProperty(prop)) {

          value = obj[prop];

          switch(value.toLowerCase()){
            case "true":
              obj[prop] = true;
              break;
            case "false":
              obj[prop] = false;
              break;
            default:
          }
        }
      }

      return obj;
    }

    /**
     * Provide a way to control the values from url parameters
     *
     * @param  {Object} context the object on which url control is to applied
     * @return {undefined}
     */
    function installUrlOptions(context) {

      try{

        // Get the urls parameters
        urlParameters = urlParameters || checkForBoolean(utils.queryString(d.location.href));

        var prefix = context.namespace;

        //check if url debugging is on or not
        if(urlParameters && typeof urlParameters[prefix + globals.delimiter +'debug'] !== 'undefined') {

          // Url debugging is on
          // Extend the values

          // check if env is loaded
          if(typeof urlParameters.env !== 'undefined') {
            // set the environment
            context.setEnv(urlParameters.env);
          }

          var property;
          var options = {};
          var count = 0;
          var temp;

          // extend the defaults values
          for(property in context.options) {
            temp = prefix + globals.delimiter + property;
            if( context.options.hasOwnProperty(property) && typeof urlParameters[temp] !== "undefined") {
              options[property] = urlParameters[temp];
              count = count + 1;
            }
          }

          if(count > 0) {
            context.options = extend(options, context.options);
          }

        }

      } catch (e) {

        // show error
        genericMessage(['something went wrong' + e], 'error');

      }
    }

    /**
     * Register to Listen via  window.onerror for any errors
     *
     * @return {undefined}
     */
    function registerForErrors(){

      var fe = w.onerror;

      w.onerror = function(message, file, lineNo, e){

        var info = {
          type: 'error',
          lineNo: lineNo,
          file: file,
          fileName: file.substr(file.lastIndexOf("/") + 1) || '',
          charNo: null,
          name: selfLogger.name,
          namespace: globals.selfLogger.namespace,
          stack: null
        };

        if(typeof message === 'undefined'){
          message = "No message";
        }

        selfLogger.sendToCollector(['error', [message], info]);


        // If some other function is already listening to window.onerror,
        // then make a call to that function
        if(fe && typeof fe === 'function'){
            fe.apply(this, arguments);
        }

        // TO propagate error for other functions to catch
        return false;
      };
    }

    /**
     * Get the project logger by name, if doesn't exist then create a new and return
     *
     * @param  {string} name       Name of the project
     * @param  {Boolean} createNew if false then new logger object will not be created, default true
     * @return {Object}            Return logger object for give project name if it exist else create one and return
     */
    function getProject(name, createNew) {

      if(typeof globals.projects[name] !== 'undefined') {
        return globals.projects[name];
      }

      if(typeof createNew !== 'undefined' && createNew === false) {
        return false;
      }

      // Create a new project Logger object and return
      return project(name);

    }

    /**
     * Get logger object by namespace
     *
     * @param  {string} namespace the namespace for which logger object is required
     * @return {[type]}           return the object if found else return false
     */
    function getByNamespace(namespace) {
      return globals.namespaces[namespace] || false;
    }

    // Initialize the logger object for self logging
    var selfLogger = globals.selfLogger = project('debuggify');
    selfLogger.genericMessage([], '_init');

    // Overload the window.console
    try {
      if(!w.console || typeof w.console.isLogger === "undefined") {
        var console = project('global');
        console.addTransport('Console', {});
        w.console = console;
      }
    } catch (e) {
      selfLogger.warn('error overloading window.console: ' + e);
    }


    registerForErrors();

    return {
      create: project,
      get: getProject,
      getByNamespace: getByNamespace
    };


  }(debuggify.win, debuggify.doc, debuggify.extend, debuggify.Utils, debuggify.globals, debuggify.envs));

}(debuggify));