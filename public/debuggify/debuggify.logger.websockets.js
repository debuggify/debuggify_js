// Copyright (c) 2012 Ankur Agarwal <ankur@debuggify.net>

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

function printStackTrace(options) {
    options = options || {
        guess: !0
    };
    var ex = options.e || null, guess = !!options.guess, p = new printStackTrace.implementation, result = p.run(ex);
    return guess ? p.guessAnonymousFunctions(result) : result;
}

(function(global, w, undefined) {
    var debuggify = global.debuggify = global.debuggify || function() {
        function extend(options, defaults) {
            var i;
            for (i in defaults) defaults.hasOwnProperty(i) && typeof options[i] == "undefined" && (options[i] = defaults[i]);
            return options;
        }
        var version = "0.0.1", globals = {
            projects: {},
            namespaces: {},
            transports: {},
            delimiter: "__",
            selfLogger: null
        };
        return {
            win: w,
            doc: w.document,
            console: w.console || null,
            extend: extend,
            globals: globals,
            version: version
        };
    }();
})(this, window), printStackTrace.implementation = function() {}, printStackTrace.implementation.prototype = {
    run: function(ex, mode) {
        return ex = ex || this.createException(), mode = mode || this.mode(ex), mode === "other" ? this.other(arguments.callee) : this[mode](ex);
    },
    createException: function() {
        try {
            this.undef();
        } catch (e) {
            return e;
        }
    },
    mode: function(e) {
        return e.arguments && e.stack ? "chrome" : typeof e.message == "string" && typeof window != "undefined" && window.opera ? e.stacktrace ? e.message.indexOf("\n") > -1 && e.message.split("\n").length > e.stacktrace.split("\n").length ? "opera9" : e.stack ? e.stacktrace.indexOf("called from line") < 0 ? "opera10b" : "opera11" : "opera10a" : "opera9" : e.stack ? "firefox" : "other";
    },
    instrumentFunction: function(context, functionName, callback) {
        context = context || window;
        var original = context[functionName];
        context[functionName] = function() {
            return callback.call(this, printStackTrace().slice(4)), context[functionName]._instrumented.apply(this, arguments);
        }, context[functionName]._instrumented = original;
    },
    deinstrumentFunction: function(context, functionName) {
        context[functionName].constructor === Function && context[functionName]._instrumented && context[functionName]._instrumented.constructor === Function && (context[functionName] = context[functionName]._instrumented);
    },
    chrome: function(e) {
        var stack = (e.stack + "\n").replace(/^\S[^\(]+?[\n$]/gm, "").replace(/^\s+(at eval )?at\s+/gm, "").replace(/^([^\(]+?)([\n$])/gm, "{anonymous}()@$1$2").replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, "{anonymous}()@$1").split("\n");
        return stack.pop(), stack;
    },
    firefox: function(e) {
        return e.stack.replace(/(?:\n@:0)?\s+$/m, "").replace(/^\(/gm, "{anonymous}(").split("\n");
    },
    opera11: function(e) {
        var ANON = "{anonymous}", lineRE = /^.*line (\d+), column (\d+)(?: in (.+))? in (\S+):$/, lines = e.stacktrace.split("\n"), result = [];
        for (var i = 0, len = lines.length; i < len; i += 2) {
            var match = lineRE.exec(lines[i]);
            if (match) {
                var location = match[4] + ":" + match[1] + ":" + match[2], fnName = match[3] || "global code";
                fnName = fnName.replace(/<anonymous function: (\S+)>/, "$1").replace(/<anonymous function>/, ANON), result.push(fnName + "@" + location + " -- " + lines[i + 1].replace(/^\s+/, ""));
            }
        }
        return result;
    },
    opera10b: function(e) {
        var lineRE = /^(.*)@(.+):(\d+)$/, lines = e.stacktrace.split("\n"), result = [];
        for (var i = 0, len = lines.length; i < len; i++) {
            var match = lineRE.exec(lines[i]);
            if (match) {
                var fnName = match[1] ? match[1] + "()" : "global code";
                result.push(fnName + "@" + match[2] + ":" + match[3]);
            }
        }
        return result;
    },
    opera10a: function(e) {
        var ANON = "{anonymous}", lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i, lines = e.stacktrace.split("\n"), result = [];
        for (var i = 0, len = lines.length; i < len; i += 2) {
            var match = lineRE.exec(lines[i]);
            if (match) {
                var fnName = match[3] || ANON;
                result.push(fnName + "()@" + match[2] + ":" + match[1] + " -- " + lines[i + 1].replace(/^\s+/, ""));
            }
        }
        return result;
    },
    opera9: function(e) {
        var ANON = "{anonymous}", lineRE = /Line (\d+).*script (?:in )?(\S+)/i, lines = e.message.split("\n"), result = [];
        for (var i = 2, len = lines.length; i < len; i += 2) {
            var match = lineRE.exec(lines[i]);
            match && result.push(ANON + "()@" + match[2] + ":" + match[1] + " -- " + lines[i + 1].replace(/^\s+/, ""));
        }
        return result;
    },
    other: function(curr) {
        var ANON = "{anonymous}", fnRE = /function\s*([\w\-$]+)?\s*\(/i, stack = [], fn, args, maxStackSize = 10;
        while (curr && curr.arguments && stack.length < maxStackSize) fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON, args = Array.prototype.slice.call(curr.arguments || []), stack[stack.length] = fn + "(" + this.stringifyArguments(args) + ")", curr = curr.caller;
        return stack;
    },
    stringifyArguments: function(args) {
        var result = [], slice = Array.prototype.slice;
        for (var i = 0; i < args.length; ++i) {
            var arg = args[i];
            arg === undefined ? result[i] = "undefined" : arg === null ? result[i] = "null" : arg.constructor && (arg.constructor === Array ? arg.length < 3 ? result[i] = "[" + this.stringifyArguments(arg) + "]" : result[i] = "[" + this.stringifyArguments(slice.call(arg, 0, 1)) + "..." + this.stringifyArguments(slice.call(arg, -1)) + "]" : arg.constructor === Object ? result[i] = "#object" : arg.constructor === Function ? result[i] = "#function" : arg.constructor === String ? result[i] = '"' + arg + '"' : arg.constructor === Number && (result[i] = arg));
        }
        return result.join(",");
    },
    sourceCache: {},
    ajax: function(url) {
        var req = this.createXMLHTTPObject();
        if (req) try {
            return req.open("GET", url, !1), req.send(null), req.responseText;
        } catch (e) {}
        return "";
    },
    createXMLHTTPObject: function() {
        var xmlhttp, XMLHttpFactories = [ function() {
            return new XMLHttpRequest;
        }, function() {
            return new ActiveXObject("Msxml2.XMLHTTP");
        }, function() {
            return new ActiveXObject("Msxml3.XMLHTTP");
        }, function() {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } ];
        for (var i = 0; i < XMLHttpFactories.length; i++) try {
            return xmlhttp = XMLHttpFactories[i](), this.createXMLHTTPObject = XMLHttpFactories[i], xmlhttp;
        } catch (e) {}
    },
    isSameDomain: function(url) {
        return typeof location != "undefined" && url.indexOf(location.hostname) !== -1;
    },
    getSource: function(url) {
        return url in this.sourceCache || (this.sourceCache[url] = this.ajax(url).split("\n")), this.sourceCache[url];
    },
    guessAnonymousFunctions: function(stack) {
        for (var i = 0; i < stack.length; ++i) {
            var reStack = /\{anonymous\}\(.*\)@(.*)/, reRef = /^(.*?)(?::(\d+))(?::(\d+))?(?: -- .+)?$/, frame = stack[i], ref = reStack.exec(frame);
            if (ref) {
                var m = reRef.exec(ref[1]);
                if (m) {
                    var file = m[1], lineno = m[2], charno = m[3] || 0;
                    if (file && this.isSameDomain(file) && lineno) {
                        var functionName = this.guessAnonymousFunction(file, lineno, charno);
                        stack[i] = frame.replace("{anonymous}", functionName);
                    }
                }
            }
        }
        return stack;
    },
    guessAnonymousFunction: function(url, lineNo, charNo) {
        var ret;
        try {
            ret = this.findFunctionName(this.getSource(url), lineNo);
        } catch (e) {
            ret = "getSource failed with url: " + url + ", exception: " + e.toString();
        }
        return ret;
    },
    findFunctionName: function(source, lineNo) {
        var reFunctionDeclaration = /function\s+([^(]*?)\s*\(([^)]*)\)/, reFunctionExpression = /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*function\b/, reFunctionEvaluation = /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*(?:eval|new Function)\b/, code = "", line, maxLines = Math.min(lineNo, 20), m, commentPos;
        for (var i = 0; i < maxLines; ++i) {
            line = source[lineNo - i - 1], commentPos = line.indexOf("//"), commentPos >= 0 && (line = line.substr(0, commentPos));
            if (line) {
                code = line + code, m = reFunctionExpression.exec(code);
                if (m && m[1]) return m[1];
                m = reFunctionDeclaration.exec(code);
                if (m && m[1]) return m[1];
                m = reFunctionEvaluation.exec(code);
                if (m && m[1]) return m[1];
            }
        }
        return "(?)";
    }
}, function(debuggify, undefined) {
    var utils = debuggify.Utils = debuggify.Utils || function() {
        function processTemplate(str, data) {
            var caller = processTemplate;
            return caller.cache = caller.cache || {}, caller.tmpl = caller.tmpl || function(str, data) {
                var fn = /\W/.test(str) ? new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" + str.replace(/[\r\t\n]/g, " ").split("<%").join("	").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("	").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');") : caller.cache[str] = caller.cache[str] || caller.tmpl(doc.getElementById(str).innerHTML);
                return data ? fn(data) : fn;
            }, caller.tmpl(str, data);
        }
        function queryString(url) {
            try {
                var q = url.split("?")[1], a = q.split("&");
                if (a === "") return {};
                var i, b = {};
                for (i = 0; i < a.length; i += 1) try {
                    var p = a[i].split("=");
                    if (p.length !== 2) throw "continue";
                    b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
                } catch (e) {}
                return b;
            } catch (err) {
                return {};
            }
        }
        function getStackTrace() {
            if (win.printStackTrace) return win.printStackTrace.apply(this, arguments);
        }
        var win = window, doc = win.document;
        return {
            processTemplate: processTemplate,
            queryString: queryString,
            getStackTrace: getStackTrace
        };
    }();
}(debuggify), function(debuggify, undefined) {
    var logger = debuggify.Logger = debuggify.Logger || function(w, d, extend, utils, globals) {
        function Logger(name, environments, options) {
            this.initialize(name, environments, options);
        }
        function getFileInfo(frame) {
            try {
                var m = fileInfoRegex.exec(frame);
                if (m) return {
                    file: m[1],
                    fileName: m[1].substr(m[1].lastIndexOf("/") + 1),
                    lineNo: m[2],
                    charNo: m[3]
                };
            } catch (e) {
                return !1;
            }
        }
        function genericMessage(messageArray, type) {
            var self = this, stack = utils.getStackTrace(self.options.optimize ? {} : {
                guess: !0
            }), elNo = 2, stackLength = stack.length, stackElement;
            while (elNo <= stackLength) {
                stackElement = stack[elNo];
                if (stackRegex.test(stackElement)) {
                    elNo += 2;
                    break;
                }
                elNo += 1;
            }
            var appStack = stack.slice(elNo), info = getFileInfo(appStack[0]) || {};
            info.type = type, info.name = self.name, info.namespace = self.namespace, info.stack = appStack, info.timestamp = new Date, self.sendToCollector([ type, messageArray, info ]);
        }
        function getFunc(type, options) {
            return options.optimize ? emptyFunction : function() {
                var namespace = this.namespace, options = this.options;
                typeof flags_[namespace][options.flagPrefix + type] != "undefined" && flags_[namespace][options.flagPrefix + type] && flags_[namespace][options.flagPrefix + type] !== "false" && this.genericMessage(arguments, type);
            };
        }
        function installFunctions(context, options) {
            var type, types = options.messagesTypes;
            for (type in types) types.hasOwnProperty(type) && types[type] >= options.level ? context[options.functionPrefix + type] = getFunc(type, options) : context[options.functionPrefix + type] = emptyFunction;
        }
        function installFlags(context, namespace) {
            var options = context.options, type, types = options.messagesTypes;
            flags_[namespace] = flags_[namespace] || {};
            for (type in types) flags_[namespace][options.flagPrefix + type] = getFirstDefinedValue(urlParameters[namespace + globals.delimiter + type], urlParameters[namespace], urlParameters[type], types[type] >= options.level, !options.silent);
        }
        function getFirstDefinedValue() {
            var i, l = arguments.length;
            for (i = 0; i < l; i += 1) if (typeof arguments[i] != "undefined") return arguments[i];
        }
        function extendEnvironments(environments, returnEmpty) {
            if (typeof environments == "undefined") return !1;
            var env = {}, defaults = typeof environments.defaults != "undefined" ? extend(environments.defaults, environments_.defaults) : environments_.defaults, i, count = 0;
            for (i in environments) environments.hasOwnProperty(i) && (typeof environments_[i] == "undefined" ? environments_[i] = extend(environments[i], defaults) : env[i] = extend(extend(environments[i], environments_[i]), defaults)), count += 1;
            return typeof returnEmpty != "undefined" && returnEmpty === !0 && count === 0 ? !1 : env;
        }
        function project(name, environments) {
            function Project(name) {
                this.modules = {}, this.collectorQueue = [], this.transports = [];
            }
            if (typeof name == "undefined") throw "No name defined";
            typeof environments == "undefined" && (environments = {
                defaults: {}
            });
            var env = extendEnvironments(environments);
            Project.prototype = new Logger(name, env, {}), installFunctions(Project.prototype, Project.prototype.options);
            var project = new Project(name);
            return globals.namespaces[project.namespace] = project, globals.projects[project.name] = project, installUrlOptions(project), installFlags(project, project.namespace), installTransports(project), project.genericMessage([ project.name, project.namespace, project.options, !1 ], "_addProject"), debuggify && debuggify.Collector && debuggify.Collector.process && debuggify.Collector.process(), project;
        }
        function installTransports(project) {
            var transports = project.options.transports;
            for (var transport in transports) project.addTransport(transport, transports[transport]);
        }
        function checkForBoolean(obj) {
            var prop, value;
            for (prop in obj) if (obj.hasOwnProperty(prop)) {
                value = obj[prop];
                switch (value.toLowerCase()) {
                  case "true":
                    obj[prop] = !0;
                    break;
                  case "false":
                    obj[prop] = !1;
                    break;
                  default:
                }
            }
            return obj;
        }
        function installUrlOptions(context) {
            try {
                urlParameters = urlParameters || checkForBoolean(utils.queryString(d.location.href));
                var prefix = context.namespace;
                if (urlParameters && typeof urlParameters[prefix + globals.delimiter + "debug"] != "undefined") {
                    typeof urlParameters.env != "undefined" && context.setEnv(urlParameters.env);
                    var property, options = {}, count = 0, temp;
                    for (property in context.options) temp = prefix + globals.delimiter + property, context.options.hasOwnProperty(property) && typeof urlParameters[temp] != "undefined" && (options[property] = urlParameters[temp], count += 1);
                    count > 0 && (context.options = extend(options, context.options));
                }
            } catch (e) {
                genericMessage([ "something went wrong" + e ], "error");
            }
        }
        function registerForErrors() {
            var fe = w.onerror;
            w.onerror = function(message, file, lineNo, e) {
                var info = {
                    type: "error",
                    lineNo: lineNo,
                    file: file,
                    fileName: file.substr(file.lastIndexOf("/") + 1) || "",
                    charNo: null,
                    name: globals.selfLogger.name,
                    namespace: globals.selfLogger.namespace,
                    stack: null
                };
                return typeof message == "undefined" && (message = "No message"), globals.selfLogger.sendToCollector([ "error", [ message ], info ]), fe && typeof fe == "function" && fe.apply(this, arguments), !1;
            };
        }
        function getProject(name, createNew) {
            return typeof globals.projects[name] != "undefined" ? globals.projects[name] : typeof createNew != "undefined" && createNew === !1 ? !1 : project(name);
        }
        function getByNamespace(namespace) {
            return globals.namespaces[namespace] || !1;
        }
        var stackRegex = /Object.genericMessage/, fileInfoRegex = /\((.*?)(?::(\d+))(?::(\d+))?(?: -- .+)?\)$/, urlParameters, environments_ = {
            defaults: {
                silent: !1,
                optimize: !1,
                collector: !0,
                history: !0,
                timestamp: !0,
                level: 0,
                flagPrefix: "__",
                functionPrefix: "",
                messageFormat: "",
                compiledTemplate: !1,
                messagesTypes: {
                    log: 0,
                    info: 1,
                    warn: 2,
                    error: 3
                },
                transports: {}
            },
            development: {},
            production: {
                silent: !0,
                optimize: !0,
                timestamp: !1,
                level: 2,
                transports: []
            },
            testing: {
                silent: !0,
                level: 2
            }
        }, flags_ = {}, emptyFunction = function() {};
        return Logger.prototype = {
            setEnv: function(environmentName) {
                var env = this.environments;
                if (typeof env == "undefined" || typeof env[environmentName] == "undefined") throw "Invalid environment name " + environmentName + " for project " + this.name;
                this.options = extend(env[environmentName], {}), this.env = environmentName;
            },
            initialize: function(name, environments, options) {
                var self = this;
                self.name = name, self.isLogger = !0, self._childrens = {}, self.history = [], environments && (self.environments = environments, self.options = options, self.setEnv("defaults")), self.setNamespace();
            },
            setLevel: function(level) {
                this.options.level = level, installFunctions(this, this.options);
            },
            setFlag: function(type, value) {
                return flags_[this.namespace] && typeof flags_[this.namespace][this.options.flagPrefix + type] != "undefined" ? (flags_[this.namespace][this.options.flagPrefix + type] = value, !0) : !1;
            },
            addModule: function(name, environments, parent) {
                try {
                    if (typeof name == "undefined") throw "Need name of the module";
                    typeof environments == "undefined" && (environments = {
                        defaults: {}
                    }), typeof parent == "undefined" && (parent = this);
                    if (typeof this.modules[name] != "undefined") throw "Module " + name + " already initialized";
                    environments = extendEnvironments(environments, !0);
                    function Module() {}
                    Module.prototype = parent;
                    var module = new Module;
                    return module.initialize(name, environments, extend(extend({}, this.options), environments)), parent._childrens[name] = module, module.parent = parent, globals.namespaces[module.namespace] = module, installFlags(module, module.namespace), this.modules[module.name] = module, module.genericMessage([ module.name, module.namespace, module.options, parent.namespace ], "_addModule"), module;
                } catch (e) {
                    return genericMessage([ "Cannot add module name" + name + "due to error:" + e ], "error"), !1;
                }
            },
            get: function(name, createNew) {
                return typeof this.modules[name] != "undefined" ? this.modules[name] : typeof createNew != "undefined" && createNew === !1 ? !1 : this.addModule(name, {});
            },
            message: function(message, moduleName, type) {
                this.get(moduleName).genericMessage([ message ], type);
            },
            setNamespace: function() {
                this.namespace ? this.namespace = this.namespace + globals.delimiter + this.name : this.namespace = this.name;
            },
            addTransport: function(transportName, options) {
                this.genericMessage([ transportName, options ], "_addTransport");
            },
            sendToCollector: function(data) {
                var self = this, options = self.options;
                data[2].location = d.location.href, options.collector && self.collectorQueue.push(data), !options.optimize && options.history && self.history.push(data);
            },
            genericMessage: genericMessage
        }, globals.selfLogger = project("debuggify"), globals.selfLogger.genericMessage([], "_init"), registerForErrors(), {
            create: project,
            get: getProject,
            getByNamespace: getByNamespace
        };
    }(debuggify.win, debuggify.doc, debuggify.extend, debuggify.Utils, debuggify.globals);
}(debuggify), function(debuggify, undefined) {
    var transports = debuggify.Transports = debuggify.Transports || function(w, d, extend, globals) {
        function Transports(name) {
            this.name = name, typeof globals.transports[name] == "undefined" && (globals.transports[name] = {});
        }
        return Transports.prototype = {
            initialize: function(level, silent, timestamp) {
                this.level = level, this.silent = silent, this.timestamp = timestamp;
            },
            setLevel: function(level) {
                this.level = level;
            },
            send: function() {
                throw "Send is Not Implemented for transport" + this.name;
            }
        }, Transports;
    }(debuggify.win, debuggify.doc, debuggify.extend, debuggify.globals);
}(debuggify), function(debuggify, undefined) {
    var collector = debuggify.Collector = debuggify.Collector || function(w, d, extend, globals, transports) {
        function isArray(obj) {
            return toString.call(obj) === "[object Array]";
        }
        function deleteArray(arr) {
            arr.splice(0, arr.length);
        }
        function init() {
            processProjects();
        }
        function processProjects() {
            var project, projectList = globals.projects;
            for (project in projectList) projectList.hasOwnProperty(project) && processQueue(projectList[project]);
        }
        function processQueue(project) {
            var queue = project.collectorQueue = project.collectorQueue || [];
            if (typeof queue.isCollector != "undefined") return !1;
            if (!isArray(queue)) throw "Queue must be array";
            var l = queue.length;
            for (var i = 0; i < l; i++) processCmd(queue[i], project);
            deleteArray(queue), project.collectorQueue = new Collector(project);
        }
        function processCmd(cmd, self) {
            if (!isArray(cmd)) throw console.log(cmd), "Expecting array, got " + typeof cmd;
            var func = cmd[0], args = Array.prototype.slice.call(cmd, 1);
            if (func[0] === "_" && typeof funcs[func] == "function") funcs[func].apply(self, args[0]); else {
                var l = self.transports.length, transport;
                for (transport in self.transports) if (self.transports.hasOwnProperty(transport)) try {
                    self.transports[transport].send.apply(self.transports[transport], args);
                } catch (e) {
                    console.warn(self.transports[transport].name + ": Sending via transport failed: " + e);
                }
            }
        }
        function Collector(project) {
            this.isCollector = !0, this.project = project;
        }
        var funcs = {
            _addTransport: function(transportName, options) {
                if (!globals.transports[transportName] || !transports[transportName]) throw "transport " + transportName + " is not defined";
                this.transports.push(new transports[transportName](options));
            }
        }, toString = Object.prototype.toString;
        return Collector.prototype = {
            push: function(cmd) {
                return processCmd(cmd, this.project);
            }
        }, {
            init: init,
            process: processProjects
        };
    }(debuggify.win, debuggify.doc, debuggify.extend, debuggify.globals, debuggify.Transports);
}(debuggify), !function(debuggify, undefined) {
    var transports = debuggify.Transports, websockets = transports.Websockets = transports.Websockets || function(w, d, extend, globals, transports) {
        function Websocket(options) {
            options = options || {};
            var self = this;
            self.defaults = {
                level: 0,
                silent: !0,
                timestamp: !0,
                host: "ankur.debuggify.net",
                port: "80"
            }, self.options = extend(options, self.defaults), self.initialize(self.options.level, self.options.silent, self.options.timestamp), self.options.hostname = "http://" + self.options.host + ":" + self.options.port;
            if (typeof sockets_[self.options.hostname] == "undefined") {
                var info = sockets_[self.options.hostname] = {
                    status: !1,
                    autoReconnect: !0,
                    verbose: !1,
                    reconnectAttempts: 0,
                    maxReconnectAttemps: 10,
                    socket: null
                }, socket = info.socket = io.connect(self.options.hostname) || io.connect("http://localhost:4000");
                socket.on("connect", function() {
                    info.status = !0;
                }), socket.on("disconnect", function() {
                    info.status = !1, info.autoReconnect && !info.autoReconnect && info.maxReconnectAttemps > info.reconnectAttempts && (maxReconnectAttemps += 1, info.socket.connect());
                }), socket.on("module", function(message) {
                    console.log(message);
                }), socket.on("message", function(message) {
                    console.log(message);
                    switch (message.cmd) {
                      case "reload":
                        d.location.href = d.location.href;
                        break;
                      case "dummy":
                        break;
                      default:
                    }
                });
            }
            self.socket = sockets_[self.options.hostname];
        }
        var sockets_ = {};
        return Websocket.prototype = new transports("Websockets"), Websocket.prototype.send = function(message, info) {
            info.message = message, this.socket.socket.json.send(info);
        }, Websocket;
    }(debuggify.win, debuggify.doc, debuggify.extend, debuggify.globals, transports);
}(debuggify);