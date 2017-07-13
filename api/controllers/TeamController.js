/**
 * @type :: CLASS
 * @class :: TeamController
 * @author :: Steven Hanna
 * @description :: Controller logic for Teams.
 * @see :: /models/Team.js
 */

module.exports = {

  /**
   * @type :: REST
   * @route :: /team/new
   * @crud :: post
   * @param :: Data sent as a post object should include:
   * `name, city, teamID, players, logo, seasonWins, seasonLosses, location, logs`
   * @sample :: `{ success: true, team: object }`
   * @sample :: `{ error: true, message: "Team already exists"}`
   * @sample :: `500`
   */
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

  /**
   * @type :: REST
   * @route :: /team/:teamID
   * @crud :: get
   * @description :: Retrieves the team, the objects of all of the teams players,
   * the teams game logs, and statistics, in addition to general information.
   * @param :: teamID - the ID of the team to look up
   * @sample :: `{team: object}`
   * @sample :: `500`
   */
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

  /**
   * @type :: REST
   * @route :: /team/edit
   * @crud :: post
   * @description :: Edit the given team's information.  Only edits the data given
   * @param :: Post object with an object representation of the data that has to
   * be changed.
   * @sample :: `{success: true}`
   * @sample :: `500`
   */
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

  /**
   * @type :: REST
   * @route :: /team/delete
   * @crud :: DELETE
   * @description :: Delete the data about a given team
   * @note :: This will not delete information about any players
   * @param :: Post object wih the teamID: `{teamID: 12345}`
   * @sample :: `{success: true}`
   * @sample :: `500`
   */
  delete: function(req, res) {
    var post = req.body;
    var team;
    async.series([
      function(callback) {
        Team.findOne({
          id: post.teamID
        }).exec(function(err, teamName) {
          if (err || teamName == undefined) {
            console.log("There was an error finding the team.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            team = teamName;
          }
        });
      },
      function(callback) {
        Gamelog.delete({
          id: team.logs
        }).exec(function(err) {
          if (err) {
            console.log("There was an error deleting the game logs.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            callback();
          }
        });
      },
      function(callback) {
        Team.destroy({
          id: team.id
        }).exec(function(err) {
          if (err) {
            console.log("There was an error destroying the team.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            callback();
          }
        });
      }
    ], function(callback) {
      res.send({
        success: true
      });
    });
  },
};
