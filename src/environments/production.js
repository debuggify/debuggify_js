(function(envs) {
  /**
   * Production Environment
   * @type {Object}
   */
  envs.production = envs.production || {
    silent: true,
    optimize: true,
    timestamp: false,
    level: 2,
    transports: []
  };

}(__dfy.envs));