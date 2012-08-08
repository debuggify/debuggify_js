describe("Debuggify Logger", ['debuggify.logger'], function(logger) {

  // var logger;

  var loggerObject;
  var api;
  var loggerObjectApis = ['error','warn','info','log','genericMessage','transports','addTransport','message','sendToCollector','name','namespace','module','modules','enviroments','env','setEnv','setLevel','setFlag','setNamespace'];

  function verifyApis(loggerObject){
    for(var api in loggerObjectApis){
        it("verify " + loggerObjectApis[api] + " api to be defined",function(){
          var temp =  loggerObjectApis[api];
          expect(loggerObject[temp]).toBeDefined();
        });
    }
  }


  beforeEach(function() {
    loggerObject = logger.create('project1');
  });

  it("logger is defined", function() {

    // logger object
    expect(logger).toBeDefined();

    // Environments
    // expect(typeof logger.extend === 'function').toEqual(true);


  });

  describe("#create(project)",function(){
    var p1;
    var environments_ = debuggify.envs;

    describe('call with single parameter',function(){
      beforeEach(function(){
        spyOn(logger,'create').andCallThrough();
        p1 = logger.create('project');
      });

      it("have been called",function(){
        expect(logger.create).toHaveBeenCalled();
      });

      it("have been called",function(){
        expect(logger.create).toHaveBeenCalled();
      });

      it("should return a object",function(){
        expect(p1).toEqual(jasmine.any(Object));
      });

      it("should return default environment if no settings passed",function(){
        expect(p1.environments.defaults).toEqual(environments_.defaults);
      });

      it("validate project name",function(){
        expect(p1.name).toEqual('project');
      });

      it("validate project namespace",function(){
        expect(p1.namespace).toEqual('project');
      });

      for(api in loggerObjectApis){
        it("verify " + loggerObjectApis[api] + " api to be defined",function(){
          var temp =  loggerObjectApis[api];
          expect(p1[temp]).toBeDefined();
        });
      }
    });
  });

  describe("#get(project)",function(){
    var p1,p2,p3,p4;
    beforeEach(function(){
      spyOn(logger,'get').andCallThrough();
      p1 = logger.create('p1');
      p2 = logger.get('p1',false);
      p3 = logger.get('project3',false);
      p4 = logger.get('p4',true);
    });

      it("function called",function(){
        expect(logger.get).toHaveBeenCalled();
      });

      it("function called with p1",function(){
        expect(logger.get).toHaveBeenCalledWith('p1',false);
      });

      describe("get('p1',false)",function(){
        it("returns object with correct name",function(){
          expect(p2.name).toEqual('p1');
        });
      });

      describe("get('p3',false)",function(){
        it("return false if createNew is false and cannot find project",function(){
          expect(p3).toBeFalsy();
        });
      });

      describe("get('p4',true)",function(){
        it("return object if createNew is true and cannot find project",function(){
          expect(p4).toBeDefined();
        });
        // verifyApis(p4);
        for(api in loggerObjectApis){
          it("verify " + loggerObjectApis[api] + " api to be defined",function(){
            var temp =  loggerObjectApis[api];
            expect(p1[temp]).toBeDefined();
          });
        }
      });

  });

  describe("#getByNamespace(namespace)",function(){
    var p1,p2,p3,p4;
    beforeEach(function(){
      spyOn(logger,'getByNamespace').andCallThrough();
      p1 = logger.create(new Date(0));
      p2 = logger.getByNamespace('p1');
      p3 = logger.getByNamespace('project3');
      p4 = logger.get('p4',true);
    });

    describe("getByNamespace called with existing namespace",function(){
      it("function called",function(){
        expect(logger.getByNamespace).toHaveBeenCalled();
      });

      it("return object with correct namespace",function(){
        expect(p2.namespace).toEqual('p1');
      });

      it("function called with p1 namespace",function(){
        expect(logger.getByNamespace).toHaveBeenCalledWith('p1');
      });

      for(api in loggerObjectApis){
        it("verify " + loggerObjectApis[api] + " api to be defined",function(){
          var temp =  loggerObjectApis[api];
          expect(p2[temp]).toBeDefined();
        });
      }
    });

    describe("getByNamespace called with non-existing namespace",function(){
      it("function called with invalid namespace",function(){
        expect(p3).toBeFalsy();
      });
    });

  });

  describe("#setLevel",function(){
    var p0,p1,p2,p3,p4,project;
    beforeEach(function() {
      project = logger.create('project');
      spyOn(project,'setLevel');
      project.setLevel(2);
    });

    it("called",function(){
      expect(project.setLevel).toHaveBeenCalled();
    });

    it("called with correct argument",function(){
      expect(project.setLevel).toHaveBeenCalledWith(2);

    });

    it("called only once",function(){
      expect(project.setLevel.calls.length).toEqual(1);
    });

    it("called with integer argument",function(){
      expect(project.setLevel.mostRecentCall.args[0]).toEqual(jasmine.any(Number));
    });

    describe('setlevel with valid parameters',function(){
      p0 = logger.create('p0');
      p0.setLevel(0);
      p1 = logger.create('ps1');
      p1.setLevel(1);
      p2 = logger.create('p2');
      p2.setLevel(2);
      p3 = logger.create('p3');
      p3.setLevel(3);
      p4 = logger.create('p4');
      p4.setLevel(4);

      it('called with setLevel 0',function(){
        expect(p1.options.level).toEqual(jasmine.any(Number));
        expect(p0.log).not.toMatch(emptyFunctionRegex);
        expect(p0.info).not.toMatch(emptyFunctionRegex);
        expect(p0.warn).not.toMatch(emptyFunctionRegex);
        expect(p0.error).not.toMatch(emptyFunctionRegex);
      });

      it('called with setLevel 1',function(){
        expect(p1.options.level).toEqual(jasmine.any(Number));
        expect(p1.log).toMatch(emptyFunctionRegex);
        expect(p1.info).not.toMatch(emptyFunctionRegex);
        expect(p1.warn).not.toMatch(emptyFunctionRegex);
        expect(p1.error).not.toMatch(emptyFunctionRegex);
      });

      it('called with setLevel 2',function(){
        expect(p1.options.level).toEqual(jasmine.any(Number));
        expect(p2.log).toMatch(emptyFunctionRegex);
        expect(p2.info).toMatch(emptyFunctionRegex);
        expect(p2.warn).not.toMatch(emptyFunctionRegex);
        expect(p2.error).not.toMatch(emptyFunctionRegex);
      });

      it('called with setLevel 3',function(){
        expect(p1.options.level).toEqual(jasmine.any(Number));
        expect(p3.log).toMatch(emptyFunctionRegex);
        expect(p3.info).toMatch(emptyFunctionRegex);
        expect(p3.warn).toMatch(emptyFunctionRegex);
        expect(p3.error).not.toMatch(emptyFunctionRegex);
      });

      it('called with setLevel 4',function(){
        expect(p4.log).toMatch(emptyFunctionRegex);
        expect(p4.info).toMatch(emptyFunctionRegex);
        expect(p4.warn).toMatch(emptyFunctionRegex);
        expect(p4.error).toMatch(emptyFunctionRegex);
      });
    });

    describe('setLevel with invalid parameters',function(){
      var p1 =  logger.create('p1');
      p1.setLevel('random');

      it("validates arguement",function(){
        expect(p1.options.level).toEqual(jasmine.any(Number));
      });

    });
  });

  describe("#setFlag",function(){
    var p0,p1,p2,p3,p4,project;
    beforeEach(function() {
      project = logger.create('project');
      spyOn(project,'setFlag').andCallThrough();
      spyOn(project,'genericMessage').andCallThrough();
      project.setFlag('warn',true);
    });

    describe("Validates function call",function(){
      it("called",function(){
        expect(project.setFlag).toHaveBeenCalled();
        // project.warn('error');
        // expect(project.genericMessage).toHaveBeenCalled();
      });

      it("called with correct argument",function(){
        expect(project.setFlag).toHaveBeenCalledWith('warn',true);

      });

      it("called only once",function(){
        expect(project.setFlag.calls.length).toEqual(1);
      });

      it("called with string and boolean argument",function(){
        expect(project.setFlag.mostRecentCall.args[0]).toEqual(jasmine.any(String));
        expect(project.setFlag.mostRecentCall.args[1]).toBeTruthy();
      });
    });

    describe('setFlag for log',function(){

      it('called with setFlag on for log',function(){
        project.setFlag('log',true);
        project.log('log');
        expect(project.genericMessage).toHaveBeenCalled();
      });

      it('called with setFlag off for log',function(){
        project.setFlag('log',false);
        project.log('log');
        expect(project.genericMessage).not.toHaveBeenCalled();
      });

    });

    describe('setFlag for info',function(){

      it('called with setFlag on for info',function(){
        project.setFlag('info',true);
        project.info('info');
        expect(project.genericMessage).toHaveBeenCalled();
      });

      it('called with setFlag off for info',function(){
        project.setFlag('info',false);
        project.info('info');
        expect(project.genericMessage).not.toHaveBeenCalled();
      });

    });

    describe('setFlag for warn',function(){

      it('called with setFlag on for warn',function(){
        project.setFlag('warn',true);
        project.warn('warn');
        expect(project.genericMessage).toHaveBeenCalled();
      });

      it('called with setFlag off for warn',function(){
        project.setFlag('warn',false);
        project.warn('warn');
        expect(project.genericMessage).not.toHaveBeenCalled();
      });

    });

    describe('setFlag for error',function(){

      it('called with setFlag on for error',function(){
        project.setFlag('error',true);
        project.error('error');
        expect(project.genericMessage).toHaveBeenCalled();
      });

      it('called with setFlag off for error',function(){
        project.setFlag('error',false);
        project.error('error');
        expect(project.genericMessage).not.toHaveBeenCalled();
      });

    });

    // describe('setLevel with invalid parameters',function(){
    //   var p1 =  logger.create('p1');
    //   p1.setLevel('random');

    //   it("validates arguement",function(){
    //     expect(p1.options.level).toEqual(jasmine.any(Number));
    //   });

    // });
  });

  // describe("#module - add module",function(){
  //   var p1,p2,p3,p4,project;
  //   beforeEach(function(){
  //     project = logger.create('project_module');
  //   });

  //   it("module add")

  // });





  describe("validate environment",function(){

    it("#logger.env",function(){
      expect(loggerObject.env).toBeDefined();
      expect(loggerObject.env).toEqual(jasmine.any(String));

    });

    it("#setEnv was called",function(){
      spyOn(loggerObject,'setEnv');
      loggerObject.setEnv('development');
      expect(loggerObject.setEnv).toHaveBeenCalled();
    });

    it("#setEnv was called with one argument",function(){
      spyOn(loggerObject,'setEnv');
      loggerObject.setEnv('testing');
      expect(loggerObject.setEnv).toHaveBeenCalledWith('testing');
    });

    it("#setEnv most recent called argument",function(){
      spyOn(loggerObject,'setEnv');
      loggerObject.setEnv('testing');
      expect(loggerObject.setEnv.mostRecentCall.args[0]).toEqual('testing');
    });
  });


});