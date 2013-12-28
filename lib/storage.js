/* InMemoryStorage */
(function(plog) {

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

  plog.storage.InMemoryStorage = InMemoryStorage;

})(plog);

/* LocalStorage */
(function(plog) {

  // TODO: Save plog-first-id and next-id as a single object: plog-index
  // TODO: Change getAll api to be sync (without callback)

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

  function currentSize() {
    var index = loadIndex(); 
    return index.nextId - index.firstId;
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
    })
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
    })
    return events;
  };

  LocalStorage.prototype.append = function(event) {

    if (currentSize() + 1 > this.maxSize)
      this.purgeOldEvents();

    var index = loadIndex();

    var key = 'plog-event-' + index.nextId;
    localStorage[key] = JSON.stringify(event);

    index.nextId++;
    saveIndex(index);
  };

  plog.storage.LocalStorage = LocalStorage;

})(plog);