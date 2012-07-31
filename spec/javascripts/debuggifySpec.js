/**
*
* @author Ankur Agarwal
*
*/

describe("Debuggify", function() {
  var debuggify;

  require(['debuggify'], function(d) {
    console.log(d);
    debuggify = d;
  });

  beforeEach(function() {

  });

  function checkForMessageType(logger) {

    foreachMessageType(function(type) {

      expect(logger[type]).toBeDefined();
//      console.log(logger, type);
      expect(typeof logger[type] === 'function').toEqual(true);

    })
  }

  it("API functions", function() {

    // debuggify object
    expect(debuggify).toBeDefined();

    // Constants
    expect(debuggify.version).toBeDefined();

    // functions
    expect(debuggify.project).toBeDefined();

  });

  describe("#project", function() {

    var projectName =  'foo';
    var projectLogger;

    beforeEach(function() {
      projectLogger = debuggify.project(projectName, config);
    });

    it("check for the project setup", function() {

      expect(projectLogger).toBeDefined();

      // variables
      expect(projectLogger.name).toEqual(projectName);
      expect(projectLogger.namespace).toEqual(projectName);
      expect(projectLogger.config).toEqual(config);
      expect(projectLogger.options).toEqual(config.defaults);
      expect(projectLogger.env).toEqual('defaults');
      expect(projectLogger.modules).toBeDefined();

      // Functions
      expect(projectLogger.set).toBeDefined();
      expect(projectLogger.module).toBeDefined();
      checkForMessageType(projectLogger);

    });

    describe("#set", function() {
      for(var i in config) {

        it("environment:" + i, function() {

          var tempConfig;
          projectLogger.set(i);
          tempConfig = extend(extend({}, config.defaults), config[i]);
          expect(projectLogger.env).toEqual(i);
          expect(projectLogger.options).toEqual(tempConfig);

        });
      }
    })

    describe("#module", function() {

      var modules = ['module1', 'module2', 'module3'];

      for(var i in modules) {
        var moduleName = modules[i];

        it("modules:" + moduleName, function() {
          var tempModule;

          var moduleNamespace = projectName + ':' +moduleName
          tempModule = projectLogger.module(moduleName);


          expect(tempModule.namespace).toEqual(moduleNamespace);

          // Check inside the module list
          expect(projectLogger.modules[moduleNamespace]).toBeDefined();


          // Name of the module
          expect(tempModule.name).toEqual(moduleName);

          // Options
          expect(projectLogger.options).toBeDefined();

          // Config
          expect(projectLogger.config).toBeDefined();

          // Check for messagetype Functions
          checkForMessageType(tempModule);

        });

      }
    })

  });

});