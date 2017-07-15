var request = require('supertest');
var assert = require('chai').assert;

var agent;
var player;

describe("PlayerStat Controller", function() {
  before(function(done) {
    agent = request.agent(sails.hooks.http.app);
    var obj = {
      name: "Russell Westbrook",
      playerID: "12345",
      headshotURL: "https://google.com",
      teamName: "OKC Thunder",
      teamID: "12345",
      jerseyNumber: 0,
      position: "Point Guard",
      careerPPG: 30,
      careerRPG: 10,
      careerAPG: 10,
      stats: []
    };
    Player.findOne({
      playerID: "12345"
    }).exec(function(err, pl) {
      if (err) {
        done(err);
      } else if (pl == undefined) {
        Player.create(obj).exec(function(err, p) {
          if (err || p == undefined) {
            done(err);
          } else {
            player = p;
            done();
          }
        });
      } else {
        player = pl;
        done();
      }
    });
  });
  describe("new", function() {
    it("should create a new player stat", function(done) {
      var obj = {
        playerID: "12345",
        season: "2016-17",
        gamesPlayed: "82",
        minutes: "36",
        ppg: 30,
        rpg: 10,
        apg: 10,
        spg: 5,
        bpg: 1,
        topg: 5,
        fieldGoalPercentage: 50,
        threePointPercentage: 35,
        freeThrowPercentage: 90
      };
      agent
        .post('/playerstat/new')
        .send(obj)
        .expect(200, done)
    });
  });
  it("should create a player stat", function(done) {
    Player.findOne({
      playerID: "12345"
    }).exec(function(err, playerstat) {
      if (err || playerstat == undefined) {
        done(err);
      } else {
        done();
      }
    });
  });
  it("should have added the player stat to the player", function(done) {
    PlayerStat.findOne({
      playerID: "12345"
    }).exec(function(err, player) {
      if (err || player == undefined) {
        done(err);
      } else {
        PlayerStat.findOne({
          playerID: "12345"
        }).exec(function(err, playerstat) {
          if (err || playerstat == undefined) {
            done(err);
          } else {
            assert.include(player.stats, playerstat.id);
            done();
          }
        });
      }
    });
  });
  describe("get", function() {
    it("should get a player stat", function(done) {
      PlayerStat.findOne({
        playerID: "12345"
      }).exec(function(err, playerstat) {
        if (err || playerstat == undefined) {
          done(err);
        } else {
          agent
            .get('/playerstat/' + playerstat.id)
            .set('Accept', 'application/json')
            .end(function(err, res) {
              if (err) done(err);
              var post = res.body.stats;
              assert.equal(post.playerID, "12345");
              done();
            });
        }
      })
    });
  });
  describe("edit", function() {
    it("should edit a player stat", function(done) {
      PlayerStat.findOne({
        playerID: "12345"
      }).exec(function(err, stat) {
        if (err || stat == undefined) {
          done(err);
        } else {
          agent
            .post('/playerstat/edit')
            .send({
              ppg: 25,
              rpg: 5
            })
            .expect(200, done)
        }
      });
    });
    it("should have changed the player stat", function(done) {
      PlayerStat.findOne({
        playerID: "12345"
      }).exec(function(err, stat) {
        if (err || stat == undefined) {
          done(err);
        } else {
          assert.equal(stat.ppg, 25);
          done();
        }
      });
    });
  });
  describe("delete", function() {
    it("should delete the player stat", function(done) {
      PlayerStat.find({
        playerID: "12345"
      }).exec(function(err, stat) {
        if (err || stat == undefined) {
          done(err);
        } else {
          agent
            .delete('/playerstat/delete')
            .send({
              statID: stat.id,
            })
            .expect(200, done)
        }
      })
    });
    it("should remove the player stat from the player", function(done) {
      Player.find({
        playerID: "12345"
      }).exec(function(err, player) {
        if (err || player == undefined) {
          done(err);
        } else {
          assert.equal(player.stats.length, 0);
          done();
        }
      });
    });
    it("should have deleted the player stat record", function(done) {
      PlayerStat.findOne({
        playerID: "12345"
      }).exec(function(err, stat) {
        if (err) {
          done(err);
        } else {
          assert.equal(undefined, stat);
          done();
        }
      });
    });
  });
});
