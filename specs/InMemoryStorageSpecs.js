describe('InMemoryStorage', function() {

  var storage = new plog.storage.InMemoryStorage();

  beforeEach(function() {
    storage.clear();
  });

  it('stores new events', function() {
    storage.append({
      logger: 'one logger',
      date: new Date(),
      msg: 'first message'
    });
  });

  it('retrieves stored events', function() {
    storage.append({msg: 'one'});
    storage.append({msg: 'two'});

    var events = storage.getEvents();
    expect(events.length).toBe(2);
    expect(events[0].msg).toBe('one');
    expect(events[1].msg).toBe('two');
  });

  it('clears stored events', function() {
    storage.append({msg: 'one'});
    storage.clear();

    expect(storage.getEvents().length).toBe(0);
  });

});