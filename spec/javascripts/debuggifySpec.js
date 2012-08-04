/**
*
* @author Ankur Agarwal
*
*/

describe("Debuggify", ['debuggify'], function(debuggify) {

  beforeEach(function() {


  });

  function checkForMessageType(logger) {

    foreachMessageType(function(type) {

      expect(logger[type]).toBeDefined();

      expect(typeof logger[type] === 'function').toEqual(true);

    });
  }

  it("API functions", function() {

    // debuggify object
    expect(debuggify).toBeDefined();

    // Constants
    expect(debuggify.version).toBeDefined();

    // Variables
    expect(debuggify.doc).toBeDefined();
    expect(debuggify.win).toBeDefined();
    expect(debuggify.globals).toBeDefined();

    //Functions
    expect(debuggify.extend).toBeDefined();
    expect(typeof debuggify.extend === 'function').toEqual(true);


  });
});