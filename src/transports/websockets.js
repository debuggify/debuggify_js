/**
 *
 * Debuggify Transports Websockets
 * version 0.0.1
 *
 * @author Ankur Agarwal
 *
 */

(function (debuggify, undefined) {

  var transports = debuggify.Transports;
  var websockets = transports.Websockets = transports.Websockets || (function (w, d, extend, globals, transports) {


    var sockets_ = {};

    // Websocket
    function Websocket (options) {

      // Validate the input
      options = options || {};

      var self = this;
      self.defaults = {
        level: 0,
        timestamp: true,
        host: 'localhost',
        port: '9999'
      };

      self.options = extend(options, self.defaults);

      // Initialize the Transport Constructor
      self.initialize(self.options.level, self.options.timestamp);

      self.options.hostname = 'http://' + self.options.host + ':' + self.options.port;

      // Reuse socket if already exist for this hostname
      if( typeof sockets_[self.options.hostname] === 'undefined') {

        var info = sockets_[self.options.hostname] = {
          prefix: 'dummy',
          status: false,
          autoReconnect: true,
          verbose: false,
          reconnectAttempts: 0,
          maxReconnectAttemps: 10,
          socket: null
        };

        var socket = info.socket = io.connect(self.options.hostname) || io.connect('http://localhost:4000');

        // On connect update the socket list
        socket.on('connect', function() {
          info.status = true;
          socket.emit('join_room', {prefix: info.prefix, agent: 'client'});
        });

        socket.on('disconnect', function() {
          info.status = false;

          // Reconnect
          if(info.autoReconnect && !info.autoReconnect && info.maxReconnectAttemps > info.reconnectAttempts) {

            maxReconnectAttemps = maxReconnectAttemps + 1;

            info.socket.connect();
          }
        });

        socket.on('module', function(message) {

          globals.selfLogger.log(message);
        });

        socket.on('message', function(message) {

          globals.selfLogger.log(message);

          switch(message.cmd){

            case 'reload':
              // Set the url instead of reload to avoid refresh action
              d.location.href = d.location.href;
              break;

            case 'dummy':

              break;

            default:

          }

        });

      }

      self.socket = sockets_[self.options.hostname];

    }

    Websocket.prototype = new transports('Websockets');

    Websocket.prototype.send = function (message, info) {

        info.message = message;
        this.socket.socket.json.send(info);
    };

    Websocket.prototype.serviceUrl = function () {
      if(w.remoteJsServiceUrl) {
        return w.remoteJsServiceUrl;
      }
      var script, scripts = d.getElementsByTagName('script');
      for (var i in scripts) {
        script = scripts[i].src;
        if (script && script.match('/client.js')) break;
      }
      if(!script) {
        var msg = "Could not find window.remoteJsServiceUrl try setting it explicitly";
        alert(msg);
        throw new Error(msg);
      }
      return script.replace('/client.js', '/');
    };


    Websocket.prototype.loadScript = function (src, loadCallback) {
      var script = d.createElement("script");
      script.src = src;
      script.type = "text/javascript";
      if (loadCallback) script.onload = loadCallback;
      d.getElementsByTagName("head")[0].appendChild(script);
    };

    return Websocket;

  }(debuggify.win, debuggify.doc, debuggify.extend, debuggify.globals, transports));

}(debuggify));

