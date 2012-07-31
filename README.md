Debuggify.js (Work In Progress)
===========

A modern multi-transport javascript debugging library for browsers focuses on enhancing development experience.

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

### Build ###

Run the following to build the debuggify scripts.

    $ r.js -o config/production.build.js

After running the above successfully, check `debuggify_js/build/release/` path for the build files.


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

You can also over

    var console =  debuggify.Logger('p1',{ options })


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

Add a transport to a project

    p1.addTransport('Console', {});

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

#### Author: [@Agarwal_Ankur] ####

*Free Software, Fuck Yeah!*

  [winston]: https://github.com/flatiron/winston
  [socket.io]: https://github.com/learnboost/socket.io
  [github issue tracker]: https://github.com/debuggify/debuggify_js/issues
  [@Agarwal_Ankur]: http://twitter.com/Agarwal_Ankur
  [Logger]: #logger
  [Collector]: #collector
  [Transports]: #transports