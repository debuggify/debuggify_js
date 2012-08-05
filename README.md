Debuggify.js (Work In Progress)
===========

A modern multi-transport javascript debugging library for browsers focuses on enhancing development experience.

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

After running the above successfully, check `public/debuggify` path for the build files.


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

    <script type="text/javascript" src="<DIR PATH>/deubuggify.js"></script>

Create a logger object

    var p1 = debuggify.Logger;

You can also use the library with console

    var console =  debuggify.Logger('p1', options);
**NOTE**: The above line will replace the global console(windows.console) if local console variable is not found, so be careful while using it.

Set Development Environment (optional)

    p1.setEnv('development');

Start using logger

    p1.log('some crappy information');
    p1.error('Shit! something breaks');
    p1.warn('You better watch yourself');


Add module specific logger to the project

    var p1_m1 = p1.module('module1');

    p1_m1.log('some crappy information');
    p1_m1.error('Shit! something breaks');
    p1_m1.warn('You better watch yourself');

Get logger object on demand

    var p1 = debuggify.Logger.get('project1'); // Returns the logger object for project1
    p1.log('this is a log for project1');

    var p1_m1 = p1.get('module1'); // Returns the logger object for module1
    p1_m1.log('this is a log for module1');

    // OR
    var p1_m1 = debuggify.Logger.get('project1').get('module1'); // Directly get the module logger object
    p1_m1.log('this is a log for module1');


Modules Hierarchy

    var p1_m1_s1 = debuggify.Logger.get('project1').get('module1'),get('submodule1');
    p1_m1_s1.log('this is a log for submodule1');

Set Logging Level (optional). Every environment has it logging level already set

    p1.setLevel(2); // Set warning and errors only for project on project p1
    p1_m1.setLevel(0); // Show all types messages for all the children on module m1

**NOTE** Calling `.setLevel` on a logger will remove reinstall debugging methods for the new levels. This will also affect the behavior of all the children. For any module its nearest overridden parent level is used

<a name="setFlag"></a>Set Flag for any message type (optional)

    p1.setFlag('error', true); // Set the flag for

**NOTE** Calling `.setFlag` on a logger will only affect the state of current object. Its children module will not be affected

Add a transport to a project

    p1.addTransport('Console', {});

*Control the parameter through URL* by enabline debug mode.Just add query string `p1__debug=true`.
This is very powerful can be used it to change configuration for particular module.Ex.

1.Change the environment.Following will change the environment to testing for p1 project.

    urlString?p1__debug=true&env=testing

2.To disable errors/logs/warnings for a particular module.Following will not throw warnings for m1 module for p1 project.

    urlString?p1__debug=true&p1__m1__info=false&p1__m1__error=false

**NOTE** The above is same as [setFlag]

3.To show or hide properties.Following will not show timestamp property for m1 module for p1 project.

    urlString?p1__debug=true&p1__m1__timestamp=false


Get the *logger object* by its name.Following will return the logger object for p1 if it is exists else it will create a new logger object with p1 name.If you do not want to create a new logger object pass the 2nd parameter as false

    debuggify.Logger.get(p1,true)


Send message for specific type(logs,error,warning).Following will change the error message for module m1 to "This is an error message".

    p1.message("This is an error message", m1, error)

### Collector ###

This component is responsible for collecting the logging messages from the global object and send it to various transports medium. The collector is independent of logger so it can be loaded on demand.


### Transports ###

#### Console ####
Send the logs to the browser console if it exist

    p1.add('Console', options)

## Contributing ##

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

## Inspirations ##
  - [winston]
  - [socket.io]
  - [stacktrace]
  - [requirejs]

#### Contact us on contact@debuggify.net ####
#### Follow us on twitter [@d3buggify] ####
#### IRC server info ####
Server: irc.freenode.net
Port: 6667
Rooms: #debuggify


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
  [architecture]: images/architecture.png "Architecture"
  [setFlag]:#setFlag