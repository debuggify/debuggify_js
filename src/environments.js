(function(envs) {

  /**
   * Defaults values for Environment
   * @type {Object}
   */
  envs.defaults = {

    apikey: null,

    /**
     * Logger Settings
     *
     * @type {Object}
     * @todo Implement it
     */
    logger: {

      /**
       * Optimize for logger if enabled, normally to be enabled in production mode
       *
       * @type {Boolean}
       * @todo Implement it
       */
      optimize: false,

      /**
       * To push the data to collector or not
       *
       * @type {Boolean}
       * @todo Implement it
       */
      collector: true,

      /**
       * Save module history
       *
       * @type {Boolean}
       * @todo Implement it
       */
      history: true,

      /**
       * Enable timestamp with messages or not
       *
       * @type {Boolean}
       * @todo Implement it
       */
      timestamp: true,

      /**
       * Control the message types
       *
       * @type {Enum}
       *
       * TRACE: 0,
       * INFO: 1,
       * WARN: 2,
       * ERROR: 3,
       * SILENT: 4
       */
      level: 0,

      /**
       * Prefix for the flag variable
       *
       * @type {String}
       */
      flagPrefix: '__',

      /**
       * Prefix for the function name
       *
       * @type {String}
       */
      functionPrefix: '',

      /**
       * Different types of message types supported
       *
       * @type {Object}
       * @todo Add more messagetypes
       *
       */
      messagesTypes: {
        'log': 0,
        'info': 1,
        'warn': 2,
        'error': 3
      },

      transports: {
        'Console': {},
        'Websockets': {
          prefix: 'debuggify',
          publish: 'logger',
          subscribe: null
        }
      }
    },

    /**
     * Message format
     *
     * @type {String}
     * @todo Implement basic template support
     */
    messageFormat: '',

    /**
     * Compiled template to optimize the recompilation of template
     *
     * @type {String}
     */
    compiledTemplate: false,


    /**
     * All the transports supported
     *
     * @type {Object}
     * @todo Convert to array
     */
    transports: {
      'Console': {},
      'Websockets': {
        prefix: 'debuggify',
        publish: null,
        subscribe: null
      }
    }

  };
}(debuggify.envs));