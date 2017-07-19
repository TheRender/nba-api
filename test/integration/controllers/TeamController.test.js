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
          name: "Chicago Bulls",
          city: "Chicago",
          teamID: "12345",
          logo: "http://google.com",
          seasonWins: 20,
          seasonLosses: "0",
          location: "Chicago",
          nickname: "The Bulls"
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
  describe("getAll", function() {
    it("should get all the teams", function(done) {
      agent
        .get('/teams')
        .set('Accept', 'application/json')
        .end(function(err, res) {
          if (err) done(err);
          var post = res.body;
          console.log(post);
          done();
        });
    });
  });
  describe("get", function() {
    it("should get a team", function(done) {
      Team.findOne({
        teamID: "12345"
      }).exec(function(err, team) {
        if (err || team == undefined) {
          done(err);
        } else {
          agent
            .get('/team/' + team.id)
            .set('Accept', 'application/json')
            .end(function(err, res) {
              if (err) done(err);
              var post = res.body.team;
              assert.equal(post.name, team.name);
              assert.equal(post.location, team.location);
              done();
            });
        }
      });
    });
  });
  describe("exists", function() {
    it("should test existance", function(done) {
      Team.findOne({
        teamID: "12345"
      }).exec(function(err, team) {
        if (err || team == undefined) {
          done(err);
        } else {
          agent
            .get('/team/exists/nbaid/12345')
            .set('Accept', 'application/json')
            .end(function(err, res) {
              if (err) done(err);
              var post = res.body;
              assert.equal(post.exists, true);
              assert.equal(post.id, team.id)
              done();
            });
        }
      });
    });
    it("should test existance", function(done) {
      Team.findOne({
        teamID: "12345"
      }).exec(function(err, team) {
        if (err || team == undefined) {
          done(err);
        } else {
          agent
            .get('/team/exists/id/' + team.id)
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
      Team.findOne({
        teamID: "12345"
      }).exec(function(err, team) {
        if (err || team == undefined) {
          done(err);
        } else {
          agent
            .get('/team/exists/nbaid/12345123')
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
  describe("edit", function() {
    it("should edit a team", function(done) {
      Team.findOne({
        teamID: "12345"
      }).exec(function(err, team) {
        if (err || team == undefined) {
          done(err);
        } else {
          agent
            .post('/team/edit')
            .send({
              id: team.id,
              location: "New York"
            })
            .expect(200, done)
        }
      });
    });
    it("should have edited the team", function(done) {
      Team.findOne({
        teamID: "12345"
      }).exec(function(err, team) {
        if (err || team == undefined) {
          done(err);
        } else {
          assert.equal(team.location, "New York");
          done();
        }
      });
    });
    it("should edit the team back", function(done) {
      Team.findOne({
        teamID: "12345"
      }).exec(function(err, team) {
        if (err || team == undefined) {
          done(err);
        } else {
          agent
            .post('/team/edit')
            .send({
              id: team.id,
              location: "Chicago"
            })
            .expect(200, done)
        }
      });
    });
  });
  describe("delete", function() {
    it("should delete a team", function(done) {
      Team.findOne({
        teamID: "12345"
      }).exec(function(err, team) {
        if (err || team == undefined) {
          done(err);
        } else {
          agent
            .delete('/team/delete')
            .send({
              teamID: team.id
            })
            .expect(200, done)
        }
      });
    });
  });
});
