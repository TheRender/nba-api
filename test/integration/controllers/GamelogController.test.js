var request = require('supertest');
var assert = require('chai').assert;

var agent;
var team;

describe("Gamelog Controller", function() {
  before(function(done) {
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
      logs: []
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
  });
  describe("new", function() {
    it("should create a new gamelog", function(done) {
      var obj = {
        date: "10/10/10",
        location: "Chicago",
        teamID: team.id,
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
        gameID: 0481341
      };
      agent
        .post('/gamelog/new')
        .send(obj)
        .expect(200, done)
    });
    it("should create a gamelog", function(done) {
      Gamelog.findOne({
        location: "Chicago"
      }).exec(function(err, gamelog) {
        if (err || gamelog == undefined) {
          done(err);
        } else {
          done();
        }
      });
    });
    it("should have added the gamelog to the team", function(done) {
      Team.findOne({
        teamID: "12345"
      }).exec(function(err, team) {
        if (err || team == undefined) {
          done(err);
        } else {
          Gamelog.findOne({
            location: "Chicago"
          }).exec(function(err, gamelog) {
            if (err || gamelog == undefined) {
              done(err);
            } else {
              assert.include(team.logs, gamelog.id);
              done();
            }
          });
        }
      });
    });
  });
  describe("get", function() {
    it("should get a gamelog", function(done) {
      Gamelog.findOne({
        location: "Chicago"
      }).exec(function(err, gameLog) {
        if (err || gameLog == undefined) {
          done(err);
        } else {
          agent
            .get('/gamelog/' + gameLog.id)
            .set('Accept', 'application/json')
            .end(function(err, res) {
              if (err) done(err);
              var post = res.body.log;
              assert.equal(post.location, "Chicago");
              done();
            });
        }
      })
    });
  });
  describe("edit", function() {
    it("should edit a gamelog", function(done) {
      Gamelog.findOne({
        location: "Chicago"
      }).exec(function(err, log) {
        if (err || log == undefined) {
          done(err);
        } else {
          agent
            .post('/gamelog/edit')
            .send({
              id: log.id,
              plusMinus: 3
            })
            .expect(200, done)
        }
      });
    });
    it("should have changed the log", function(done) {
      Gamelog.findOne({
        location: "Chicago"
      }).exec(function(err, log) {
        if (err || log == undefined) {
          done(err);
        } else {
          assert.equal(log.plusMinus, 3);
          done();
        }
      });
    });
  });
  describe("delete", function() {
    it("should remove the gamelog", function(done) {
      Gamelog.findOne({
        location: "Chicago"
      }).exec(function(err, log) {
        if (err || log == undefined) {
          done(err);
        } else {
          agent
            .delete('/gamelog/delete')
            .send({
              logID: log.id,
            })
            .expect(200, done)
        }
      });
    });
    it("should remove the log from the team", function(done) {
      Team.findOne({
        teamID: "12345"
      }).exec(function(err, team) {
        if (err || team == undefined) {
          done(err);
        } else {
          assert.equal(team.logs.length, 0);
          done();
        }
      });
    });
    it("should have deleted the gamelog record", function(done) {
      Gamelog.findOne({
        location: "Chicago"
      }).exec(function(err, log) {
        if (err) {
          done(err);
        } else {
          assert.equal(undefined, log);
          done();
        }
      });
    });
  });
});
