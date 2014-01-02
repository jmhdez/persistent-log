!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.plog=e():"undefined"!=typeof global?global.plog=e():"undefined"!=typeof self&&(self.plog=e())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var InMemoryStorage = function() {
  this.events = [];
};

InMemoryStorage.prototype.append = function(event) {
  this.events.push(event);
};

InMemoryStorage.prototype.clear = function() {
  this.events = [];
};

InMemoryStorage.prototype.getEvents = function() {
  return this.events;
};

module.exports = InMemoryStorage;
},{}],2:[function(require,module,exports){
var INDEX_KEY = 'plog-index';

function initialize() {
  saveIndex({firstId: 0, nextId: 0});
}

function saveIndex(index) {
  localStorage[INDEX_KEY] = JSON.stringify(index);
}

function loadIndex() {
  return JSON.parse(localStorage[INDEX_KEY]);
}

function foreachKey(callback) {
  var index = loadIndex();
  for (var id = index.firstId; id < index.nextId; id++) {
    callback('plog-event-' + id);
  }
}

var LocalStorage = function(opts) {
  opts = opts || {};
  this.maxSize = opts.maxSize || 100;

  if (typeof localStorage[INDEX_KEY] === 'undefined') {
    initialize();
  }
};

LocalStorage.prototype.clear = function() {
  foreachKey(function(key) {
    delete localStorage[key];
  });
  initialize();
};

LocalStorage.prototype.purgeOldEvents = function() {
  var eventsToPurge = Math.round(this.maxSize * 0.2);
  var index = loadIndex();

  for (var i = 0; i < eventsToPurge; i++) {
    var key = 'plog-event-' + (index.firstId + i);
    delete localStorage[key];
  }

  index.firstId += eventsToPurge;
  saveIndex(index);
};

LocalStorage.prototype.getEvents = function() {
  var events = [];
  foreachKey(function(key) {
    var event = localStorage[key];
    events.push(JSON.parse(event));
  });
  return events;
};

LocalStorage.prototype.append = function(event) {

  var index = loadIndex();
  var currentSize = index.nextId - index.firstId;

  if (currentSize + 1 > this.maxSize) {
    this.purgeOldEvents();
    index = loadIndex();
  }
    
  var key = 'plog-event-' + index.nextId;
  localStorage[key] = JSON.stringify(event);

  index.nextId++;
  saveIndex(index);
};

module.exports = LocalStorage;
},{}],3:[function(require,module,exports){
var plog = {};

plog.storages = {
  LocalStorage: require('./LocalStorage'),
  InMemoryStorage: require('./InMemoryStorage')
};

plog.level = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4,
  getName: function(level) {
    for (var x in this) {
      if (this[x] === level) return x;
    }
    return level;
  }
};

var currentStorage, currentLevel;

plog.reset = function() {
  currentStorage = new plog.storages.LocalStorage();
  currentLevel = plog.level.INFO;
};

plog.reset();

plog.useStorage = function(storage) {
  currentStorage = storage;
};

plog.getStorage = function() {
  return currentStorage;
};

plog.getLevel = function() {
  return currentLevel;
};

plog.setLevel = function(level) {
  currentLevel = level;
};

function write(level, msg) {
  if (level < currentLevel) return;

  var event = {
    level: level,
    date: new Date(),
    message: msg
  };

  currentStorage.append(event);

  console.log(event.date.toISOString() + ': ' + plog.level.getName(level) + ': ' + event.message);
}

function createWriteFunc(level) {
  return function(msg) {
    write(level, msg);
  };
}

for (var levelName in plog.level) {
  if (plog.level.hasOwnProperty(levelName)) {
    plog[levelName.toLowerCase()] = createWriteFunc(plog.level[levelName]);
  }
}

module.exports = plog;
},{"./InMemoryStorage":1,"./LocalStorage":2}]},{},[3])
(3)
});