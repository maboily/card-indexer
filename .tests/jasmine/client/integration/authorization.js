describe('Methods Authorization', function() {
  beforeEach(function() {

  });

  it('should deny logged out users to add cards', function(done) {
      spyOn(Meteor, "call").and.callThrough();

      Meteor.call('addCard', function (error, result) {
          expect(error).not.toBeNull();
          expect(error.message).toContain('not-authorized');
          done();
      });

      expect(Meteor.call).toHaveBeenCalled();
  });

  it('should deny logged out users to update cards', function(done) {
      spyOn(Meteor, "call").and.callThrough();

      Meteor.call('updateCard', function (error, result) {
          expect(error).not.toBeNull();
          expect(error.message).toContain('not-authorized');
          done();
      });

      expect(Meteor.call).toHaveBeenCalled();
  });

  it('should deny logged out users to synchronize all cards', function(done) {
      spyOn(Meteor, "call").and.callThrough();

      Meteor.call('synchronizeCard', function (error, result) {
          expect(error).not.toBeNull();
          expect(error.message).toContain('not-authorized');
          done();
      });

      expect(Meteor.call).toHaveBeenCalled();
  });

  it('should deny logged out users to remove cards', function(done) {
      spyOn(Meteor, "call").and.callThrough();

      Meteor.call('removeCard', function (error, result) {
          expect(error).not.toBeNull();
          expect(error.message).toContain('not-authorized');
          done();
      });

      expect(Meteor.call).toHaveBeenCalled();
  });

  it('should deny logged out users to make a collection', function(done) {
      spyOn(Meteor, "call").and.callThrough();

      Meteor.call('setCollectionEntry', function (error, result) {
          expect(error).not.toBeNull();
          expect(error.message).toContain('not-authorized');
          done();
      });

      expect(Meteor.call).toHaveBeenCalled();
  });

  it('should deny logged out users to add a card set', function(done) {
      spyOn(Meteor, "call").and.callThrough();

      Meteor.call('addCardSet', function (error, result) {
          expect(error).not.toBeNull();
          expect(error.message).toContain('not-authorized');
          done();
      });

      expect(Meteor.call).toHaveBeenCalled();
  });

  it('should deny logged out users to update a card set', function(done) {
      spyOn(Meteor, "call").and.callThrough();

      Meteor.call('updateCardSet', function (error, result) {
          expect(error).not.toBeNull();
          expect(error.message).toContain('not-authorized');
          done();
      });

      expect(Meteor.call).toHaveBeenCalled();
  });

  it('should deny logged out users to remove a card set', function(done) {
      spyOn(Meteor, "call").and.callThrough();

      Meteor.call('removeCardSet', function (error, result) {
          expect(error).not.toBeNull();
          expect(error.message).toContain('not-authorized');
          done();
      });

      expect(Meteor.call).toHaveBeenCalled();
  });

  it('should deny logged out users to synchronize a card set', function(done) {
      spyOn(Meteor, "call").and.callThrough();

      Meteor.call('synchronizeSet', function (error, result) {
          expect(error).not.toBeNull();
          expect(error.message).toContain('not-authorized');
          done();
      });

      expect(Meteor.call).toHaveBeenCalled();
  });

  it('should deny logged out users to set last visited', function(done) {
      spyOn(Meteor, "call").and.callThrough();

      Meteor.call('setLastVisited', function (error, result) {
          expect(error).not.toBeNull();
          expect(error.message).toContain('not-authorized');
          done();
      });

      expect(Meteor.call).toHaveBeenCalled();
  });

  it('should deny logged out users to toggle scheduler', function(done) {
      spyOn(Meteor, "call").and.callThrough();

      Meteor.call('schedulerToggleActive', function (error, result) {
          expect(error).not.toBeNull();
          expect(error.message).toContain('not-authorized');
          done();
      });

      expect(Meteor.call).toHaveBeenCalled();
  });

  it('should deny logged out users to change scheduler runtime', function(done) {
      spyOn(Meteor, "call").and.callThrough();

      Meteor.call('schedulerChangeRunAt', function (error, result) {
          expect(error).not.toBeNull();
          expect(error.message).toContain('not-authorized');
          done();
      });

      expect(Meteor.call).toHaveBeenCalled();
  });
});
