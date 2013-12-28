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