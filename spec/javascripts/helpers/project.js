/*
 * Helper functions for testing
 */

// All the supported message types
var messageType = ['info', 'warn', 'error', 'log'];

// Define the configurations
var defaults = {
  show: true,
  namespace: 'project',
  optimize: false
};


var development = {
  show: true
};

var production = {
  show: false,
  optimize: true
};

var testing = {
  show: true
};

var urlParameters = queryString(document.location.href);
var websocketHostname = urlParameters.websocketHostname || document.location.hostname;
var websocketPort = urlParameters.websocketPort || 9999;

websocketConfig = {
  host: websocketHostname,
  port: websocketPort
};


var config = {

  defaults: defaults,
  development: development,
  production: production,
  testing: testing
};

var messages = [
  ['single message'],
  ['multiple message1', 'multiple messages2', 'multiple message3', 'multiple messages4'],

  [{key1: 'value1',key2: 'value2'}],
  [{key1: 'value1',key2: 'value2'}, {key1: 'value1',key2: 'value2'}],

  [['value1', 'value2', 'value3']],
  [['value1.1', 'value1.2', 'value1.3'],['value2.1', 'value2.2', 'value3.3']],

  ['mixed', {key1: 'value1',key21: 'value2'}, ['value1', 'value2', 'value3']]
];

function testMessages(context, func) {
  var m;

  for (m in messages) {
    if(messages.hasOwnProperty(m)) {
      func.apply(context, messages[m]);
    }
  }


}

function testDebugging(l) {

//  console.log(l);
  var i;
  addChildren(l.parent.namespace, l.namespace);

  for (i in messageType) {
    if(messageType.hasOwnProperty(i)) {

      addChildren(l.namespace, messageType[i]);
      testMessages(l, l[messageType[i]]);
    }
  }

}

var foreachMessageType = function(func, types) {

 types = types || messageType;

 for (i in types) {
    if(types.hasOwnProperty(i)) {
      func(types[i]);
    }
  }

};


function extend(options, defaults) {

  var i;

  for(i in defaults) {
    if (defaults.hasOwnProperty(i) && typeof options[i] === 'undefined') {
      options[i] = defaults[i];
    }
  }
  return(options);
}

function normalizeId(id) {
  return id.replace('.', '_');
}

function treeLevel(id) {
  var count = 0;

  try {

    var l = debuggify.globals.namespaces[id];
    while(typeof l.parent !== 'undefined') {

      count++;
      l = l.parent;

      if(count >4 ) {
        break;
      }
    }

    return count;
  } catch (e) {
    return false;
  }


}

function getColorClass(level) {
  switch (level) {

    case 3:
      return 'danger';

    case 2:
      return 'info';

    case 1:
      return 'inverse';

    case 0:
      return 'success';

    default:
      return '';
  }
}

function getModuleHtml(id) {

  var level = treeLevel(id);
  var colorClass = 'label-' + getColorClass(level);
  var btnClass = '';

  var spanClass = "";

  if(level !== false) {
    spanClass = 8 / ( treeLevel(id) + 1 );

    if(spanClass < 0) {
      span = "";
    }
  } else {
    btnClass = 'btn';
  }
  return '<div class="span' + spanClass + ' well label ' + colorClass + '" style="padding:0px !important; padding-left:20px !important; margin-bottom:1px ;"  data-module="' + id + '" id="'+ normalizeId(id)  + '"><a class="'+btnClass+'" href="#' + id+'"> ' + id + '</a></div>';
}

function addChildren(parentId, childId) {
  $('#' + normalizeId(parentId)).append(getModuleHtml(childId));

  $('#' + normalizeId(childId) + '>a').unbind().bind('click', function() {

    try{
      var typeObject = $(this);
      var typeId = typeObject.parent().attr('id');
      var moduleId = typeObject.parent().parent().attr('data-module');
      var module = debuggify.globals.namespaces[moduleId];
      testMessages(module, module[typeId]);

      return false;

    }catch (e){
      console.error(e);
    }

  });
}


function throwError() {
  console.log('thowing error')
  throw 'manually thowing error';
}

function manualMessage() {
  debuggify.globals.projects.foo.message('aa', 'y', 'log');
}

function testProject(projectName, env) {

  addChildren('projects', projectName);

  // Setup a new project
  var logger = debuggify.Logger.create(projectName, env || config);

  // Add the project in html
  // $('#projects').append('')

  // Set the development environment
  // logger.setEnv('development');

  // Setup debugging for module1
  var module1logger = logger.addModule('module1', {});

  // Setup debugging for module2
  var module2logger = logger.addModule('module2', {});

  // Setup debugging for module3f
  var module3logger = logger.addModule('module3', {});

  // Setup debugging for module3.1
  var module31logger = module3logger.addModule('module3.1');

  // Setup debugging for module3.2
  var module32logger = logger.addModule('module3.2', {}, module3logger);

  testDebugging(module1logger);
  // testDebugging(module2logger);
  // testDebugging(module3logger);
  // testDebugging(module31logger);
  // testDebugging(module32logger);
}

/**
 * Extract query string from input url
 * @param  {string} url URL need to processed
 * @return {Object}     query string as key value pair of object
 */
function queryString(url) {

  try {

    var q = url.split('?')[1];
    var a = q.split('&');

    if (a === '') {
      return {};
    }

    var i;
    var b = {};

    for (i = 0; i < a.length; i = i + 1) {

      try {

        var p = a[i].split('=');

        if (p.length !== 2) {
          throw 'continue';
        }

        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));

      } catch (e) {

      }
    }
    return b;

  } catch (err) {

    return {};

  }

}

emptyFunctionRegex = /function\s*\(.*\)\s*\{\s*\}/;