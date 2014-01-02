describe('plog', function() {

  describe('when configuring plog', function() {

    beforeEach(function() {
      plog.reset();
    });

    it('is initialized with default settings', function() {
      var storage = plog.getStorage();
      var level = plog.getLevel();
      expect(storage instanceof plog.storages.LocalStorage).toBe(true);
      expect(level).toBe(plog.level.INFO);
    });

    it('can use another storage', function() {
      var storage = { append: function(event) {} };
      plog.useStorage(storage);
      expect(plog.getStorage()).toBe(storage);
    });

  });

  describe('when working with levels', function() {
    it ('can get the level name using the level number', function() {
      expect(plog.level.getName(plog.level.DEBUG)).toBe('DEBUG');
      expect(plog.level.getName(plog.level.INFO)).toBe('INFO');
      expect(plog.level.getName(plog.level.WARN)).toBe('WARN');
      expect(plog.level.getName(plog.level.ERROR)).toBe('ERROR');
      expect(plog.level.getName(plog.level.FATAL)).toBe('FATAL');
    });
  });

  describe('when logging a text message', function() {

    var events = [];
    var storage = {
      append: function(event) { events.push(event); }
    };

    beforeEach(function() {
      events = [];
      plog.useStorage(storage);
    });

    describe('when the log level is below message level', function() {

      beforeEach(function() {
        plog.setLevel(plog.level.DEBUG);
      });

      it('adds an event to the storage', function() {
        plog.info('sample message');
        expect(events[0].level).toBe(plog.level.INFO);
        expect(events[0].message).toBe('sample message');
        var now = new Date();
        expect(+events[0].date/1000).toBeCloseTo(+now/1000, 0);
      });
      
      it('adds the event with the specified level', function() {
        plog.warn('this is a warning');
        expect(events[0].level).toBe(plog.level.WARN);
      });

    });

    describe('when the log level is above message level', function() {

      beforeEach(function() {
        plog.setLevel(plog.level.WARN);
      });

      it('ignores the event', function() {
        plog.info('sample message');
        expect(events.length).toBe(0);

        plog.debug('other message');
        expect(events.length).toBe(0);
      });

    });
    
  });
});

