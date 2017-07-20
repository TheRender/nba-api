var request = require('supertest');
var assert = require('chai').assert;

var agent;
var homeTeam;
var awayTeam;

describe("Game Controller", function() {
  before(function(done) {
    agent = request.agent(sails.hooks.http.app);
    var homeObj = {
      name: "The Bulls",
      city: "Chicago",
      teamID: "12345",
      logo: "http://google.com",
      seasonWins: 20,
      seasonLosses: 0,
      location: "Chicago",
      players: [],
      games: []
    };
    Team.findOne({
      teamID: "12345"
    }).exec(function(err, te) {
      if (err) {
        done(err);
      } else if (te == undefined) {
        Team.create(obj).exec(function(err, t) {
          if (err || t == undefined) {
            done(err);
          } else {
            homeTeam = t;
            done();
          }
        });
      } else {
        homeTeam = te;
        done();
      }
    });
    var awayObj = {
      name: "The Knicks",
      city: "New York",
      teamID: "67890",
      logo: "http://google.com",
      seasonWins: 20,
      seasonLosses: 0,
      location: "New York",
      players: [],
      games: []
    };
    Team.findOne({
      teamID: "67890"
    }).exec(function(err, te) {
      if (err) {
        done(err);
      } else if (te == undefined) {
        Team.create(obj).exec(function(err, t) {
          if (err || t == undefined) {
            done(err);
          } else {
            awayTeam = t;
            done();
          }
        });
      } else {
        awayTeam = te;
        done();
      }
    });
  });
  describe("new", function() {
    it("should create a new game", function(done) {
      var obj = {
        date: '01/01/2017',
        gameID: '54321',
        startTime: '8:00PM',
        clock: '12:00',
        isBuzzerBeater: false,
        isHalfTime: false,
        homeTeamScore: 100,
        homeTeamID: homeTeam.teamID,
        homeTriCode: 'CHI',
        awayTeamScore: 99,
        awayTeamID: awayTeam.teamID,
        awayTriCode: 'NYK',
        homePlayers: [],
        awayPlayers: []
      };
      agent
        .post('/game/new')
        .send(obj)
        .expect(200, done)
    });
    it("should create a game", function(done) {
      Game.findOne({
        gameID: "54321"
      }).exec(function(err, game) {
        if (err || game == undefined) {
          done(err);
        } else {
          done();
        }
      });
    });
    it("should have added the game to the home team", function(done) {
      Team.findOne({
        teamID: "12345"
      }).exec(function(err, team) {
        if (err || team == undefined) {
          done(err);
        } else {
          Game.findOne({
            gameID: "54321"
          }).exec(function(err, game) {
            if (err || game == undefined) {
              done(err);
            } else {
              assert.include(homeTeam.games, game.id);
              assert.include(awayTeam.games, game.id);
              done();
            }
          });
        }
      });
    });
  });
  describe("get", function() {
    it("should get a game", function(done) {
      Game.findOne({
        gameID: "54321"
      }).exec(function(err, game) {
        if (err || game == undefined) {
          done(err);
        } else {
          agent
            .get('/game/' + game.id)
            .set('Accept', 'application/json')
            .end(function(err, res) {
              if (err) done(err);
              var post = res.body.game;
              assert.equal(post.gameID, "54321");
              done();
            });
        }
      });
    })
  });
  describe("edit", function() {
    if("should edit a game", function(done) {
      Game.findOne({
        gameID: "54321"
      }).exec(function(err, game) {
        if (err || game == undefined) {
          done(err);
        } else {
          agent
            .post('/game/edit')
            .send({
              id: game.id,
              date: '02/02/2017'
            })
            .expect(200, done)
        }
      });
    });
    it("should have changed the game", function(done) {
      Game.findOne({
        gameID: "54321"
      }).exec(function(err, game) {
        if (err || game == undefined) {
          done(err);
        } else {
          assert.equal(game.date, "02/02/2017");
          done();
        }
      });
    });
  });
  describe("delete", function() {
    it("should remove the game", function(done) {
      Team.findOne({
        teamID: "12345"
      }).exec(function(err, team) {
        if (err || team == undefined) {
          done(err);
        } else {
          assert.equal(homeTeam.games.length, 0);
          done();
        }
      });
      Team.findOne({
        teamID: "67890"
      }).exec(function(err, team) {
        if (err || team == undefined) {
          done(err);
        } else {
          assert.equal(awayTeam.games.length, 0);
          done();
        }
      });
    });
    it("should have deleted the game record", function(done) {
      Game.findOne({
        gameID: "54321"
      }).exec(function(err, game) {
        if (err || game == undefined) {
          done(err);
        } else {
          assert.equal(undefined, game);
          done();
        }
      });
    });
  });
});
