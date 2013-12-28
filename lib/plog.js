(function(plog) {

  var currentStorage, currentLevel;

  plog.reset = function() {
    currentStorage = new plog.storage.InMemoryStorage();
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
      level: plog.level.INFO,
      date: new Date(),
      message: msg
    };

    currentStorage.append(event);
  }

  for (var levelName in plog.level) {
    if (plog.level.hasOwnProperty(levelName)) {
      plog[levelName.toLowerCase()] = (function(name) {
        return function(msg) {
          write(name, msg);
        };
      })(plog.level[levelName]);
    }
  };

})(plog);