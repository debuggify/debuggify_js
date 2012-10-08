var __dfy = __dfy || {};

(function(d) {

  // Set the default environment
  d.env = d.env || 'development';

  d.envs = d.envs || {};

  /**
   * Defaults values for Environment
   * @type {Object}
   */
  d.envs.defaults = {

    /**
     * Logger Settings
     *
     * @type {Object}
     * @todo Implement it
     */
    Logger: {

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
     */

    // These defaults values are set according to the development environment
    // To use in production set custom values in the production file

//>>includeStart("websocketsInclude", pragmas.consoleInclude);

    Console: {},

//>>includeEnd("consoleInclude");

//>>includeStart("websocketsInclude", pragmas.websocketsInclude);

    Websockets: {
      prefix: 'debuggify',
      publish: null,
      subscribe: null
    },

//>>includeEnd("websocketsInclude");

//>>includeStart("httpInclude", pragmas.httpInclude);

    Http: {
      level: 0,
      timestamp: true,
      domain: 'debuggify.net',
      port: '9001',
    },

//>>includeEnd("httpInclude");

    all: {
      apikey: 'local'
    }

  };
}(__dfy));