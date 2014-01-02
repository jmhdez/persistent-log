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