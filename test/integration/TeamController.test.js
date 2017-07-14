var request = require('supertest');
var assert = require('chai').assert;

var agent;

describe("Team Controller", function() {
  before(function(done) {
    agent = request.agent(sails.hooks.http.app);
    done();
  });
  describe("new", function() {
    it("should create a new team", function(done) {
      agent
        .post('/team/new')
        .send({
          name: "The Bulls",
          city: "Chicago",
          teamID: 12345,
          logo: "http://google.com",
          seasonWins: 20,
          seasonLosses: "0",
          location: "Chicago",
        })
        .expect(200)
        .end(function(err, res) {
          // Look for the bulls
          Team.findOne({
            name: "The Bulls"
          }).exec(function(err, team) {
            if (err || team == undefined) {
              return done(err);
            } else {
              done();
            }
          });
        });
    });
  });
});
