// Copyright (c) 2012 Ankur Agarwal <ankur@debuggify.net>

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

(function(global,w,undefined){var debuggify=global.debuggify=global.debuggify||function(){function extend(options,defaults){var i;for(i in defaults)defaults.hasOwnProperty(i)&&typeof options[i]=="undefined"&&(options[i]=defaults[i]);return options}var version="0.0.1",globals={projects:{},namespaces:{},transports:{},delimiter:"__",selfLogger:null};return{win:w,doc:w.document,console:w.console||null,extend:extend,globals:globals,envs:{},version:version}}()})(this,window),function(debuggify,undefined){var transports=debuggify.Transports=debuggify.Transports||function(w,d,extend,globals){function Transports(name){this.name=name,typeof globals.transports[name]=="undefined"&&(globals.transports[name]={})}return Transports.prototype={initialize:function(level,timestamp){this.level=level,this.timestamp=timestamp},setLevel:function(level){this.level=level},send:function(){throw"Send is Not Implemented for transport"+this.name}},Transports}(debuggify.win,debuggify.doc,debuggify.extend,debuggify.globals)}(debuggify),function(debuggify,undefined){var collector=debuggify.Collector=debuggify.Collector||function(w,d,extend,globals,transports,envs){function isArray(obj){return toString.call(obj)==="[object Array]"}function deleteArray(arr){arr.splice(0,arr.length)}function init(){processProjects()}function processProjects(){var project,projectList=globals.projects;for(project in projectList)projectList.hasOwnProperty(project)&&processQueue(projectList[project])}function processQueue(project){var queue=project.collectorQueue=project.collectorQueue||[];if(typeof queue.isCollector!="undefined")return!1;if(!isArray(queue))throw"Queue must be array";var l=queue.length;for(var i=0;i<l;i++)processCmd(queue[i],project);deleteArray(queue),project.collectorQueue=new Collector(project)}function processCmd(cmd,self){if(!isArray(cmd))throw console.log(cmd),"Expecting array, got "+typeof cmd;var func=cmd[0],args=Array.prototype.slice.call(cmd,1);if(func[0]==="_"&&typeof funcs[func]=="function")funcs[func].apply(self,args[0]);else{var l=self.transports.length,transport;for(transport in self.transports)if(self.transports.hasOwnProperty(transport)){var t=self.transports[transport];try{var level=self.options.messagesTypes[args[1].type];typeof level!="undefined"&&t.options.level<=level&&t.send.apply(self.transports[transport],args)}catch(e){console.warn(t.name+": Sending via transport failed: "+e)}}}}function Collector(project){this.isCollector=!0,this.project=project}var console=globals.selfLogger,funcs={_addTransport:function(transportName,options){globals.transports[transportName]&&transports[transportName]?this.transports.push(new transports[transportName](options)):console.warn("transport "+transportName+" is not defined")}},toString=Object.prototype.toString;return Collector.prototype={push:function(cmd){return processCmd(cmd,this.project)}},{init:init,process:processProjects}}(debuggify.win,debuggify.doc,debuggify.extend,debuggify.globals,debuggify.Transports,debuggify.envs)}(debuggify)