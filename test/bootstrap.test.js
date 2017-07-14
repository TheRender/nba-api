var sails = require('sails');

before(function(done) {

  // Increase the Mocha timeout so that Sails has enough time to lift
  this.timeout(5000);

  sails.lift({
    // Configuration for testing purposes
  }, function(err, server) {
    if (err) return done(err);
    // Load fixtures here
    done(err, sails);
  });
});

after(function(done) {
  // Clear fixtures heres
  // Increase the Mocha timeout so that Sails has enough time to lower
  // this.timeout(5000);
  // sails.lower(done);
  done();
});
