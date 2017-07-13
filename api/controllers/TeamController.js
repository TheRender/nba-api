/**
 * TeamController
 *
 * @description :: Server-side logic for managing teams
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  new: function(req, res) {
    var post = req.body;

    // Determine if the team already exists
    async.series([
      function(callback) {
        Team.findOne({
          name: post.name
        }).exec(function(err, team) {
          if (err) {
            console.log("There was an error finding the team.");
            console.log("Error = " + err);
            res.serverError();
          } else if (team == undefined) {
            callback();
          } else {
            res.send({
              error: true,
              message: "Team already exists"
            });
          }
        });
      },
      function(callback) {
        var obj = {
          name: post.name,
          city: post.city,
          teamID: post.teamID,
          players: post.players,
          logo: post.logo,
          seasonWins: post.seasonWins,
          seasonLosses: post.seasonLosses,
          location: post.location,
          logs: post.logs,
        };

        Team.create(obj).exec(function(err, team) {
          if (err || team == undefined) {
            console.log("There was an error creating the team.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            res.send({
              success: true,
              team: team
            });
          }
        });
      },
    ]);
  },

  get: function(req, res) {
    req.validate({
      teamID: 'string'
    });

    var team;
    async.series([
      function(callback) {
        Team.findOne({
          id: req.param('teamID')
        }).exec(function(err, t) {
          if (err || t == undefined) {
            console.log("There was an error finding the team.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            team = t;
            callback();
          }
        });
      },
      function(callback) {
        Player.find({
          id: team.players
        }).exec(function(err, players) {
          if (err || players == undefined) {
            console.log("There was an error finding the players.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            team.players = players;
            callback();
          }
        });
      },
      function(callback) {
        async.map(team.players, function(player, cb) {
          PlayerStat.find({
            id: player.stats
          }).exec(function(err, stats) {
            if (err || stats == undefined) {
              console.log("There was an error finding the stats.");
              console.log("Error = " + err);
              res.serverError();
            } else {
              player.stats = stats;
              cb(undefined, player);
            }
          })
        }, function(err, results) {
          if (err || results == undefined) {
            console.log("There was an error getting the player stats.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            team.players = results;
            callback();
          }
        });
      },
      function(callback) {
        Gamelog.find({
          id: team.log
        }).exec(function(err, logs) {
          if (err || logs == undefined) {
            console.log("There was an error finding the game logs.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            team.logs = logs;
            callback();
          }
        });
      }
    ], function(callback) {
      res.send({
        team: team
      });
    });
  },

  edit: function(req, res) {
    var post = req.body;
    Team.update({
      id: post.id
    }, post).exec(function(err) {
      if (err) {
        console.log("There was an error updating the team.");
        console.log("Error = " + err);
        res.serverError();
      } else {
        res.send({
          success: true
        });
      }
    });
  },
};
