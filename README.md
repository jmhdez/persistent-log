persistent-log
==============

Persistent log is a a simple logging library for javascript client applications. 

Why another log library? Isn't console.log good enough?
-------------------------------------------------------

With the increasing complexity in javascript client apps, volatile logs like the one offered by `console.log()` are often not enough to track down that elusive bug your users are finding.

persistent-log allows your app to save log messages using `localStorage` and read them whenever you need, event if they were logged in another session.

How to use
----------

Get persistent-log from https://raw.github.com/jmhdez/persistent-log/master/dist/plog.js and include it in your page.

```Javascript
// Create a storage object
var storage = new plog.storages.LocalStorage({maxSize: 200})

// Initialize storage and level (DEBUG, INFO, WARN, ERROR or FATAL)
plog.useStorage(storage);
plog.setLevel(plog.level.INFO);

// Write messages to log
plog.debug('debug message');
plog.info('info message');
plog.warn('warn message');
plog.error('error message');
plog.fatal('fatal message');

// Retrieve stored events
var events = storage.getEvents();
```

Each logged message will be recorded as an event with the following shape:

```
{
	level: plog.level.INFO,
	msg: 'some message',
	date: Date object
}
```

How to build
------------

persistent-log uses [grunt](http://gruntjs.com/), [browserify](http://browserify.org/) and [karma](http://karma-runner.github.io/0.10/index.html). Building your own version of persistent-log is easy:

1. Clone the repo
2. Install grunt-cli globally: ``npm install -g grunt-cli``
3. Install local dependencies: ``npm install``
4. Build using the default grunt task (the result will be placed in './dist/plog.js'): ``grunt``

There is also a very convenient task for development that watches source files and runs the build process (browserify, karma tests, etc.) after each change:

``grunt dev``


License
-------

[MIT License](http://opensource.org/licenses/MIT)

(c) Juan María Hernández Arroyo 2014