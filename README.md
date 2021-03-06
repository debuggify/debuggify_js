Debuggify.js
===========

A modern multi-transport javascript debugging library for browsers focuses on enhancing development experience.

**NOTE:** Work In Progress.

![][architecture]

### Motivation ###

In Browsers, the debugging is done using native(Chrome Development Tools) or external development tools (Firebug for firefox  etc. There are no common api's which work across every browser. Also development is extended to mobile devices on which debugging is even tougher. Along with the advancement of technology the use of remote debugging is growing. With increase in amount of javascript, rivers of logs flood the console, so its hard to find any message. The browser consoles also don't support module specific log management which are common in other development environments

Debuggify.js is designed to be a simple and universal debugging library to work cross browsers. Currently its focuses on Logging aspect of debugging. This library decouple logging process in to two parts (`logger` & `collector`)  to make it more flexible and extensible.

### Goals ###

   - Make debugging easy for medium to large size projects
   - Flexible & Extensible
   - Deliver high performance
   - Cross Browser support

### Features ###

  - Multiple environments support ex. development, production etc
  - Multiple debugging message supported ex. info, warnings, errors etc
  - Multiple project can use it on the same page
  - Multiple Modules can be managed very easily within a project
  - Manage debugging message for any module on the fly
  - Use URL parameters to manage settings
  - Optimizations for Production environment

## Build Status ##

**Master** [![Build Status](https://secure.travis-ci.org/debuggify/debuggify_js.png?branch=master)](http://travis-ci.org/debuggify/debuggify_js)

**Development** [![Build Status](https://secure.travis-ci.org/debuggify/debuggify_js.png?branch=development)](http://travis-ci.org/debuggify/debuggify_js)

**Testing** [![Build Status](https://secure.travis-ci.org/debuggify/debuggify_js.png?branch=testing)](http://travis-ci.org/debuggify/debuggify_js)

## Getting Started ##

### Installation ###

Run the following command to get started:

    $ git clone git@github.com:debuggify/debuggify_js.git
    $ git submodule update --init

You need to have npm(node package manager), you can install npm by following:

    $ curl http://npmjs.org/install.sh | sh

Install requirejs to using npm

    $ [sudo] npm install -g requirejs

Install Ruby Gems

    $ bundle install

### Build ###

Run the following to build the debuggify scripts.

    $ rake build

After running the above successfully, check `public/js` path for the build files.


### Test ###

    $ rake test


### Deployment ###

Set the Environment variable in the ~/.bashrc

    export DEBUGGIFY_CDN=<AWS S3 Bucket>
    export DEBUGGIFY_AWS_ACCESS_KEY_ID=<AWS KEY>
    export DEBUGGIFY_AWS_SECRET_ACCESS_KEY=<AWS SECTRET>

Run the deployment

    $ rake deploy


## Components ##

  - [Logger]
  - [Collector]
  - [Transports]

### Logger ###

This logger exposes simple apis to create, get logger object which can manage projects of various sizes. All the logs are collected in to a global project.

**Usage**
Include the script in the project

    <script type="text/javascript" src="<DIR PATH>/debuggify.allinone.js"></script>

Or use the cdn hosted script

    <script type="text/javascript" src="http://cdn.debuggify.net/latest/debuggify.allinone.js"></script>

Create a logger object

    var project1 = debuggify.Logger.create('project1');

You can also use the library with console

    var console =  debuggify.Logger('project1', options);
**NOTE**: The above line will replace the global console(windows.console) if local console variable is not found, so be careful while using it.

Set Development Environment (optional)

    project1.setEnv('development');

  If no environment is set, then the defaults are used.

**NOTE** User should make sure that `src/eviroments/<enviroment Name>.js`file has been include.

Start using logger

    project1.log('some crappy information');
    project1.error('Shit! something breaks');
    project1.warn('You better watch yourself');


Add module specific logger to the project

    var project1_module1 = project1.addModule('module1');

    project1_module1.log('some crappy information');
    project1_module1.error('Shit! something breaks');
    project1_module1.warn('You better watch yourself');

Get logger object on demand

    var project1 = debuggify.Logger.get('project1'); // Returns the logger object for project1
    project1.log('this is a log for project1');

    var project1_module1 = project1.get('module1'); // Returns the logger object for module1
    project1_module1.log('this is a log for module1');

    // OR
    var project1_module1 = debuggify.Logger.get('project1').get('module1'); // Directly get the module logger object
    project1_module1.log('this is a log for module1');


Modules Hierarchy

    var project1_module1_submodule1 = debuggify.Logger.get('project1').get('module1'),get('submodule1');
    project1_module1_submodule1.log('this is a log for submodule1');

Set Logging Level (optional). Every environment has it logging level already set

    project1.setLevel(2); // Set warning and errors only for project on project project1
    project1_module1.setLevel(0); // Show all types messages for all the children on module module1

**NOTE** Calling `.setLevel` on a logger will remove reinstall debugging methods for the new levels. This will also affect the behavior of all the children. For any module its nearest overridden parent level is used

<a name="setFlag"></a>Set Flag for any message type (optional)

    project1.setFlag('error', true); // Set the flag for

**NOTE** Calling `.setFlag` on a logger will only affect the state of current object. Its children module will not be affected

Add a transport to a project

    project1.addTransport('Console', {});

*Control the parameter through URL* by enabline debug mode.Just add query string `project1__debug=true`.
This is very powerful can be used it to change configuration for particular module.Ex.

1.Change the environment.Following will change the environment to testing for project1 project.

    urlString?project1__debug=true&env=testing

2.To disable errors/logs/warnings for a particular module.Following will not throw warnings for module1 module for project1 project.

    urlString?project1__debug=true&project1__module1__info=false&project1__module1__error=false

**NOTE** The above is same as [setFlag]

3.To show or hide properties.Following will not show timestamp property for module1 module for project1 project.

    urlString?project1__debug=true&project1__module1__timestamp=false


Get the *logger object* by its name.Following will return the logger object for project1 if it is exists else it will create a new logger object with project1 name.If you do not want to create a new logger object pass the 2nd parameter as false

    debuggify.Logger.get(project1,true)


Send message for specific type(logs,error,warning).Following will change the error message for module module1 to "This is an error message".

    project1.message("This is an error message", module1, error)

### Collector ###

This component is responsible for collecting the logging messages from the global object and send it to various transports medium. The collector is independent of logger so it can be loaded on demand.


### Transports ###

#### Console ####
Send the logs to the browser console if it exist

    project1.add('Console', options)

## Bookmarklets##

  - Create a new bookmark on the browser toolbar
  - Copy the code below and paste the it in the URL field

        javascript:void((function(){var%20e=document.createElement('script');e.setAttribute('type','text/javascript');e.setAttribute('charset','UTF-8');e.setAttribute('src','http://cdn.debuggify.net/latest/debuggify.logger.console.global.js?r='+Math.random()*99999999);document.body.appendChild(e)})()) "Drag me to the toolbar"

  - For other scripts change the name of the script in the src
    - `debuggify.logger.console.js` Logger component bundled with Console Transport
    - `debuggify.logger.console.global.js` Overload window.console with debuggify Logger object and transport console
    - `debuggify.allinone.js` All the stable components are bundle together

## Contributing ##

  - Fork debuggify_js
  - Create a topic branch - git checkout -b my_branch
  - Rebase your branch so that all your changes are reflected in one commit
  - Push to your branch - git push origin my_branch
  - Create a Pull Request from your branch, include as much documentation as you can in the commit message/pull request, following these guidelines on writing a good commit message
  - That's it!

### Bugs & Suggestions ###
Make a new ticket for new bugs / suggestions at [github issue tracker]

### Roadmap ###
1. Added Test Cases
2. Cross Browser Testing
3. Add examples
4. Add Transports
  1. Websockets
  2. Http


**NOTE**: currently the `debuggify.js` file comes with console transport. In future we will be supporting many different transports like `websockets`, `http`


### Contacts ####

**Email**: contact@debuggify.net

**Mailing List**: debuggify@googlegroups.com

**Twitter**: [@d3buggify]

**IRC**:

    Server: irc.freenode.net
    Port: 6667
    Rooms: #debuggify



## Inspirations ##
  - [winston]
  - [socket.io]
  - [stacktrace]
  - [requirejs]

#### Author: [@Agarwal_Ankur] ####

#### Contributors: [@geniussandy] ####

*Free Software, Fuck Yeah!*

  [winston]: https://github.com/flatiron/winston
  [socket.io]: https://github.com/learnboost/socket.io
  [github issue tracker]: https://github.com/debuggify/debuggify_js/issues
  [@Agarwal_Ankur]: https://twitter.com/Agarwal_Ankur
  [@geniussandy]: https://twitter.com/geniussandy
  [@d3buggify]: https://twitter.com/d3buggify
  [Logger]: #logger
  [Collector]: #collector
  [Transports]: #transports
  [stacktrace]: https://github.com/eriwen/javascript-stacktrace
  [requirejs]: https://github.com/jrburke/requirejs
  [architecture]: http://cdn.debuggify.net/images/architecture.png "Architecture"
  [setFlag]:#setFlag
  [logger.console.global]: javascript:void((function(){var%20e=document.createElement('script');e.setAttribute('type','text/javascript');e.setAttribute('charset','UTF-8');e.setAttribute('src','http://cdn.debuggify.net/latest/debuggify.logger.console.global.js?r='+Math.random()*99999999);document.body.appendChild(e)})()) "Drag me to the toolbar"
