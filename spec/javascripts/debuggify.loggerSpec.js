describe("Debuggify Logger", ['debuggify.logger'], function() {

  var logger;

  beforeEach(function() {
    debugger;
    logger = debuggify.Logger;
  });

  it("Debuggify logger", function() {

    // logger object
    expect(logger).toBeDefined();

    // Environments
    expect(logger.env).toBeDefined();
    // expect(typeof logger.extend === 'function').toEqual(true);


  });
});