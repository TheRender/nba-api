var request = require('supertest');
var assert = require('chai').assert;

var agent;
var team;

describe("Player Controller", function() {
  before(function(done) {
    agent = request.agent(sails.hooks.http.app);
    var obj = {
      name: "John Smith",
      city: "Chicago",
      teamID: "12345",
      logo: "http://google.com",
      seasonWins: 20,
      seasonLosses: 0,
      location: "Chicago",
      players: [],
      logs: []
    };
    Team.create(obj).exec(function(err, te) {
      if (err || te == undefined) {
        done(err);
      } else {
        team = te;
        done();
      }
    });
  });
  describe("new", function() {
    it("should create a new player", function(done) {
      agent
        .post('/player/new')
        .send({
          name: "John Smith",
          playerID: "67890",
          headshotURL: "http://google.com",
          teamName: "The Bulls",
          teamID: team.id,
          jerseyNumber: 0,
          position: "Guard",
          careerPPG: 0,
          careerRPG: 0,
          careerAPG: 0
        })
        .expect(200, done);
    });
    it("should find a new player", function(done) {
      Player.findOne({
        playerID: "67890"
      }).exec(function(err, player) {
        if (err || player == undefined) {
          done(err);
        } else {
          assert.equal(player.name, "John Smith");
          done();
        }
      });
    });
    it("should have added the player id to the team", function(done) {
      Team.findOne({
        teamID: "12345"
      }).exec(function(err, t) {
        if (err || t == undefined) {
          done(err);
        } else {
          Player.findOne({
            playerID: "67890"
          }).exec(function(err, player) {
            if (err || player == undefined) {
              done(err);
            } else {
              console.log(t.players);
              console.log(player.id);
              assert.include(t.players, player.id);
              done();
            }
          });
        }
      });
    });
  });
  describe("edit", function() {
    it("should edit a player", function(done) {
      Player.findOne({
        playerID: "67890"
      }).exec(function(err, player) {
        if (err || player == undefined) {
          done(err);
        } else {
          agent
            .post('/player/edit')
            .send({
              id: player.id,
              jerseyNumber: 1
            })
            .expect(200, done)
        }
      });
    });
    it("should have changed the number", function(done) {
      Player.findOne({
        playerID: "67890"
      }).exec(function(err, player) {
        if (err || player == undefined) {
          done(err);
        } else {
          assert.equal(player.jerseyNumber, 1);
          done();
        }
      });
    });
  });
  var pl;
  describe("delete", function() {
    it("should delete the player", function(done) {
      Player.findOne({
        playerID: "67890"
      }).exec(function(err, player) {
        if (err || player == undefined) {
          done(err);
        } else {
          pl = player;
          console.log(player);
          agent
            .delete('/player/delete')
            .send({
              playerID: player.id
            })
            .expect(200, done)
        }
      });
    });
    it("should remove the player id from the team", function(done) {
      Team.findOne({
        id: pl.teamID
      }).exec(function(err, team) {
        if (err || team == undefined) {
          done(err);
        } else {
          var index = team.players.indexOf(pl.id);
          assert.equal(index, -1);
          done();
        }
      });
    });
    it("the player should not be found", function(done) {
      Player.findOne({
        playerID: "67890"
      }).exec(function(err, player) {
        if (err) {
          done(err);
        } else {
          assert.equal(undefined, player);
          done();
        }
      });
    });
  });
});
