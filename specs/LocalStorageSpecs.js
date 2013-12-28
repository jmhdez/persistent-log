describe('LocalStorage', function() {

  var storage = new plog.storage.LocalStorage({
    maxSize: 10
  });

  beforeEach(function() {
    storage.clear();
  });

  it('can add events to local storage', function() {
    storage.append({msg: 'one'});
    storage.append({msg: 'two'});

    var events = storage.getEvents();
    expect(events[0].msg).toBe('one');
    expect(events[1].msg).toBe('two');
  })

  describe('when size grows over max size', function() {

    var events;

    beforeEach(function() {
      for (var i = 0; i < 10; i++) {
        storage.append({msg: i});
      }
      storage.append({msg: 'the last one'});
      events = storage.getEvents();
    });

    it('reduces size by 20% before adding more events', function() {
      expect(events.length).toBe(9);
    });

    it('drops older events', function() {
      expect(events[0].msg).toBe(2);
      expect(events[8].msg).toBe('the last one');
    })
  })

});