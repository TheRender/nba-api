var request = require('supertest');
var assert = require('chai').assert;

var agent;
var team;

describe("Player Controller", function() {
  before(function(done) {
    Player.destroy().exec(function(err) {
      if (err) {
        console.log(err);
        done(err);
      } else {
        Team.destroy().exec(function(err) {
          if (err) {
            console.log(err);
            done(err);
          } else {
            agent = request.agent(sails.hooks.http.app);
            var obj = {
              name: "The Bulls",
              city: "Chicago",
              teamID: "12345",
              logo: "http://google.com",
              seasonWins: 20,
              seasonLosses: 0,
              location: "Chicago",
              players: [],
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
                    team = t;
                    done();
                  }
                });
              } else {
                team = te;
                done();
              }
            });
          }
        })
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
              assert.include(t.players, player.id);
              done();
            }
          });
        }
      });
    });
  });
  describe("exists", function() {
    it("should test existance", function(done) {
      Player.findOne({
        teamID: "67890"
      }).exec(function(err, player) {
        if (err || player == undefined) {
          done(err);
        } else {
          agent
            .get('/player/exists/nbaid/67890')
            .set('Accept', 'application/json')
            .end(function(err, res) {
              if (err) done(err);
              var post = res.body;
              assert.equal(post.exists, true);
              assert.equal(post.id, player.id)
              done();
            });
        }
      });
    });
    it("should test existance", function(done) {
      Player.findOne({
        playerID: "67890"
      }).exec(function(err, player) {
        if (err || player == undefined) {
          done(err);
        } else {
          agent
            .get('/player/exists/id/' + player.id)
            .set('Accept', 'application/json')
            .end(function(err, res) {
              if (err) done(err);
              var post = res.body;
              assert.equal(post.exists, true);
              done();
            });
        }
      });
    });
    it("should fail existance", function(done) {
      Player.findOne({
        playerID: "67890"
      }).exec(function(err, player) {
        if (err || player == undefined) {
          done(err);
        } else {
          agent
            .get('/player/exists/nbaid/12345123')
            .set('Accept', 'application/json')
            .end(function(err, res) {
              if (err) done(err);
              var post = res.body;
              assert.equal(post.exists, false);
              done();
            });
        }
      });
    });
  });
  describe("searchPlayerNamesAutoComplete", function() {
    it("should get a player", function(done) {
      agent
        .post('/player/playerSearch')
        .send({
          searchTerm: 'John'
        })
        .end(function(err, res) {
          if (err) {
            done(err);
          }
          console.log(res.body.results);
          assert.equal(res.body.results[0], "John Smith");
          done();
        });
    });
  });
  describe("findFromName", function() {
    it("should find from a name", function(done) {
      agent
        .post('/player/findFromName')
        .send({
          name: "John Smith"
        })
        .end(function(err, res) {
          if (err) {
            done(err);
          }
          assert.equal("67890", res.body.players[0].playerID);
          done();
        });
    });
  });
  describe("getAll", function() {
    it("should get all the players", function(done) {
      agent
        .get('/players')
        .set('Accept', 'application/json')
        .expect(200, done)
    });
  });
  describe("get", function() {
    it("should get a player", function(done) {
      Player.findOne({
        playerID: "67890"
      }).exec(function(err, player) {
        if (err || player == undefined) {
          done(err);
        } else {
          agent
            .get('/player/' + player.id)
            .set('Accept', 'application/json')
            .end(function(err, res) {
              if (err) done(err);
              var post = res.body.player;
              assert.equal(post.name, "John Smith");
              done();
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
  describe("video", function() {
    it("should create a new gamelog", function(done) {
      Player.findOne({
        playerID: "67890"
      }).exec(function(err, player) {
        if (err || player == undefined) {
          done(err);
        } else {
          var obj = {
            date: "10/10/10",
            playerID: player.id,
            location: "Chicago",
            teamID: "12345",
            gameOpponent: "idk",
            opponentTeamID: "234123",
            score: "1-1",
            minutes: 23,
            points: 23,
            rebounds: 23,
            steals: 23,
            blocks: 23,
            fieldGoalsMade: 23,
            fieldGoalsAttempted: 23,
            fieldGoalPercentage: 23,
            threePointsMade: 23,
            threePointsAttempted: 23,
            threePointsPercentage: 23,
            freeThrowsMade: 23,
            freeThrowsAttempted: 23,
            freeThrowsPercentage: 23,
            fouls: 23,
            plusMinus: 2,
            gameID: "54321"
          };
          agent
            .post('/gamelog/new')
            .send(obj)
            .expect(200, done)
          done();
        }
      });
    });
    it("should create a gamelog", function(done) {
      Gamelog.findOne({
        gameID: "54321"
      }).exec(function(err, gamelog) {
        if (err || gamelog == undefined) {
          done(err);
        } else {
          done();
        }
      });
    });
    it("should have added the gamelog to the player", function(done) {
      Player.findOne({
        playerID: "67890"
      }).exec(function(err, pl) {
        if (err || pl == undefined) {
          done(err);
        } else {
          Gamelog.findOne({
            gameID: "54321"
          }).exec(function(err, gl) {
            if (err || gl == undefined) {
              done(err);
            } else {
              assert.include(pl.gamelogs, gl.id);
              done();
            }
          });
        }
      });
    });
    it("should get youtube information", function(done) {
      Player.findOne({
        playerID: "67890"
      }).exec(function(err, player) {
        if (err || player == undefined) {
          done(err);
        } else {
          agent
            .get('/videos/information/' + player.id)
            .set('Accept', 'application/json')
            .end(function(err, res) {
              if (err) done(err);
              var post = res.body.video;
              console.log("TESTING VIDEO: " + post);
              assert.equal(post.name, "John Smith");
              done();
            });
        }
      });
    });
  });
});
