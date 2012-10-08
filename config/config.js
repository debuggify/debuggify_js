/**
 * Configuration File for requriejs
 * @author Ankur Agarwal
 */

require.config({

  baseUrl: '../src/',

  paths: {
    'stacktrace': 'vendor/javascript-stacktrace/stacktrace',
    'janky.post': 'vendor/janky.post/janky.post',
    'jquery': 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min',
    'socketio': 'vendor/socketio/socket.io'
  },

  shim: {

    // 'environments': {},

    'debuggify': {
      exports: 'window.debuggify',
      deps: ['environments']
    },


    'environments/development': {
      deps: ['environments']
    },

    'environments/production': {
      deps: ['environments']
    },

    'environments/testing': {
      deps: ['environments']
    },

    'utils': {
      deps: ['debuggify']
    },

    'debuggify.logger': {
      deps: ['debuggify', 'environments', 'stacktrace', 'utils'],
      exports: 'debuggify.Logger'
    },

    'debuggify.remoteconsole': {
      deps: ['debuggify', 'environments', 'transports/websockets'],
      exports: 'debuggify.RemoteConosle'
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

    'transports/http': {
      deps: ['debuggify.collector', 'janky.post'],
      exports: 'debuggify.Transports.Http'
    },

    'transports/websockets': {
      deps: ['debuggify.collector', 'socketio'],
      exports: 'debuggify.Transports.Websockets'
    }

  }

});