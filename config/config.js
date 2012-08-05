
// Development Configuration File for requriejs

require.config({
  baseUrl: '../src/',
  paths: {
    'stacktrace': ['vendor/javascript-stacktrace/stacktrace'],
    'jquery': ['https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min']

  },
  shim: {

    'debuggify': {

      exports: 'window.debuggify'
    },

    'debuggify.logger': {
      deps: ['debuggify', 'stacktrace', 'utils'],
      exports: 'debuggify.Logger'
    },

    'debuggify.transports': {
      deps: ['debuggify'],
      exports: 'debuggify.Transports'
    },

    'debuggify.collector': {
      deps: ['debuggify', 'debuggify.transports'],
      exports: 'debuggify.Collector'
    },


    'transports/console': {
      deps: ['debuggify.collector'],
      exports: 'debuggify.Transports.Console'
    },

    'transports/websockets': {
      deps: ['debuggify.collector'],
      exports: 'debuggify.Transports.Websockets'
    }

  }

});