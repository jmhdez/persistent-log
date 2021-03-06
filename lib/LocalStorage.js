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
    localStorage.removeItem[key];
  });
  initialize();
};

LocalStorage.prototype.purgeOldEvents = function() {
  var eventsToPurge = Math.round(this.maxSize * 0.2);
  var index = loadIndex();

  for (var i = 0; i < eventsToPurge; i++) {
    var key = 'plog-event-' + (index.firstId + i);
    localStorage.removeItem[key];
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
