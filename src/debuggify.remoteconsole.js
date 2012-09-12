/**
 * Debuggify Remote Console
 * @module debuggify/remoteconsole
 * @author Ankur Agarwal
 */
(function( debuggify, undefined ) {

  var remoteConsole = debuggify.RemoteConsole = debuggify.RemoteConsole || (function(debuggify, globals) {

    function RemoteConsole() {

      try {

        if (debuggify.RemoteConsole.instance === undefined) {
          var self = this;
          debuggify.RemoteConsole.instance = this;

          // Check for the transport
          if (debuggify.Transports.Websockets) {
            var transport = new debuggify.Transports.Websockets({
              prefix: 'debuggify',
              publish: null,
              subscribe: 'remoteconsole',
              onMessage: function (packet) {
                self.process(packet);
              }
            });

            this.transport = transport;
            this.socket = transport.socket.socket;

            // this.connect();
          }

        }

        return debuggify.RemoteConsole.instance;

      } catch (e){
        globals.selfLogger.error('Cannot create remote logger object' + e);
        return false;
      }
    }

    RemoteConsole.prototype = {

      process: function(packet) {

        var data = packet.data;

        switch(data.cmd) {

          case '_eval':
            packet.data.result = eval.apply(window, data.args);
            this.transport.sendTo(data, packet.from);
            break;

          default:

        }
      },

      socketOpen: function () {
        globals.selfLogger.log('Socket open');
      },

      socketGetMessage: function (msg) {
        try {
          this.run(msg);
        } catch(exception) {
          this.send('exception', exception);
        }
      },

      run: function (command) {
        this.commands[command.cmd].apply(this, [command.data]);
      },

      socketClose: function () {
        RemoteConsole.console.log('Socket closed');
      },

      // connect: function () {
      //   var socket = this.socket;
      //   socket.on('connect',    this.socketOpen);
      //   socket.on('command',    this.socketGetMessage);
      //   socket.on('disconnect', this.socketClose);
      // },

      send: function (msg, object) {
        this.socket.emit("message", {msg: msg, data: object});
      },

      sendResult: function (result) {
        try {
          this.send('cmdresult', result);
        } catch(ex) {
          // can't send it the easy way send a simplified version.
          var data = {};
          for(var k in result) {
            if(result[k]) {
              data[k] = result[k].toString();
            } else {
              data[k] = result[k];
            }
          }
          this.send('cmdresult', data);
        }
      },


      stringify: function (o, simple) {
        var json = '', i, type = ({}).toString.call(o), parts = [], names = [];

        if (type == '[object String]') {
          json = '"' + o.replace(/\n/g, '\\n').replace(/"/g, '\\"') + '"';
        } else if (type == '[object Array]') {
          json = '[';
          for (i = 0; i < o.length; i++) {
            parts.push(stringify(o[i], simple));
          }
          json += parts.join(', ') + ']';
          // json;
        } else if (type == '[object Object]') {
          json = '{';
          for (i in o) {
            names.push(i);
          }
          names.sort(sortci);
          for (i = 0; i < names.length; i++) {
            parts.push(stringify(names[i]) + ': ' + stringify(o[names[i] ], simple));
          }
          json += parts.join(', ') + '}';
        } else if (type == '[object Number]') {
          json = o+'';
        } else if (type == '[object Boolean]') {
          json = o ? 'true' : 'false';
        } else if (type == '[object Function]') {
          json = o.toString();
        } else if (o === null) {
          json = 'null';
        } else if (o === undefined) {
          json = 'undefined';
        } else if (simple == undefined) {
          json = type + '{\n';
          for (i in o) {
            names.push(i);
          }
          names.sort(sortci);
          for (i = 0; i < names.length; i++) {
            parts.push(names[i] + ': ' + stringify(o[names[i]], true)); // safety from max stack
          }
          json += parts.join(',\n') + '\n}';
        } else {
          try {
            json = o+''; // should look like an object
          } catch (e) {}
        }
        return json;
      },

      commands: {
        run: function (cmd) {
          this.sendResult(eval(cmd));
        }
      }

    };

    // RemoteConsole.prototype.serviceUrl = function () {
    //   if(window.remoteJsServiceUrl) {
    //     return window.remoteJsServiceUrl;
    //   }
    //   var script, scripts = document.getElementsByTagName('script');
    //   for (var i in scripts) {
    //     script = scripts[i].src;
    //     if (script && script.match('/client.js')) break;
    //   }
    //   if(!script) {
    //     var msg = "Could not find window.remoteJsServiceUrl try setting it explicitly";
    //     alert(msg);
    //     throw new Error(msg);
    //   }
    //   return script.replace('/client.js', '/');
    // };
    //

    // RemoteConsole.prototype.loadScript = function (src, loadCallback) {
    //   var script = document.createElement("script");
    //   script.src = src;
    //   script.type = "text/javascript";
    //   if (loadCallback) script.onload = loadCallback;
    //   document.getElementsByTagName("head")[0].appendChild(script);
    // };

    return RemoteConsole;

  }(debuggify,debuggify.globals));

  var rjs = new remoteConsole();

}(debuggify));