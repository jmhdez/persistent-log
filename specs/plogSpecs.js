describe('plog', function() {

  describe('when configuring plog', function() {

    beforeEach(function() {
      plog.reset();
    });

    it('is initialized with default settings', function() {
      var storage = plog.getStorage();
      var level = plog.getLevel();
      expect(storage instanceof plog.storage.InMemoryStorage).toBe(true);
      expect(level).toBe(plog.level.INFO);
    })

    it('can use another storage', function() {
      var storage = { append: function(event) {} };
      plog.useStorage(storage);
      expect(plog.getStorage()).toBe(storage);
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
      })

      it('adds an event to the storage', function() {
        plog.info('sample message');
        expect(events[0].level).toBe(plog.level.INFO);
        expect(events[0].message).toBe('sample message');
        expect(+events[0].date/1000).toBeCloseTo(+new Date/1000, 0);
      });

    })

    describe('when the log level is above message level', function() {

      beforeEach(function() {
        plog.setLevel(plog.level.WARN);
      })

      it('ignores the event', function() {
        plog.info('sample message');
        expect(events.length).toBe(0);

        plog.debug('other message');
        expect(events.length).toBe(0);
      });

    })
    
  });
})

