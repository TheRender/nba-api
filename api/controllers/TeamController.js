/**
 * @type :: CLASS
 * @class :: TeamController
 * @author :: Steven Hanna
 * @description :: Controller logic for Teams.
 * @see :: /models/Team.js
 */

module.exports = {

  home: function(req, res) {
    res.send({
      hello: "world"
    });
  },

  /**
   * @type :: REST
   * @route :: /team/new
   * @crud :: post
   * @param :: Data sent as a post object should include:
   * `name, city, teamID, logo, seasonWins, seasonLosses, location`
   * @note :: Both players and logs will be initialzed empty
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
          players: [],
          logo: post.logo,
          seasonWins: post.seasonWins,
          seasonLosses: post.seasonLosses,
          location: post.location,
          logs: [],
          nickname: post.nickname
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
   * @route :: /team/exists/id/:teamID
   * @crud :: get
   * @description :: Determines if a team exists
   * @sample :: `{exists: false}`
   * @sample :: `{exists: true}`
   * @sample :: `500`
   */
  existsID: function(req, res) {
    req.validate({
      teamID: 'string'
    });
    Team.findOne({
      id: req.param('teamID')
    }).exec(function(err, team) {
      if (err) {
        console.log("There was an error finding the team.");
        console.log("Error = " + err);
        res.serverError();
      } else if (team == undefined) {
        res.send({
          exists: false
        });
      } else {
        res.send({
          exists: true
        });
      }
    });
  },

  /**
   * @type :: REST
   * @route :: /team/exists/nbaid/:teamID
   * @crud :: get
   * @description :: Determines if a team exists using the nba id.
   * If it does exist, it provides the normal ID
   * @sample :: `{exists: false}`
   * @sample :: `{exists: true, id: string}`
   * @sample :: `500`
   */
  existsNBAID: function(req, res) {
    req.validate({
      teamID: 'string'
    });
    Team.findOne({
      teamID: req.param('teamID')
    }).exec(function(err, team) {
      if (err) {
        console.log("There was an error finding the team.");
        console.log("Error = " + err);
        res.serverError();
      } else if (team == undefined) {
        res.send({
          exists: false
        });
      } else {
        res.send({
          exists: true,
          id: team.id
        });
      }
    });
  },

  /**
   * @type :: REST
   * @route :: /teams
   * @crud :: get
   * @description :: Retrieves all of the teams, and all of their respective
   * players
   * @sample :: `{teams: [teamObj]}`
   * @sample :: `500`
   */
  getAll: function(req, res) {
    var teams;
    async.series([
      function(callback) {
        Team.find().exec(function(err, teamNames) {
          if (err || teamNames == undefined) {
            console.log("There was an error finding the teams.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            teams = teamNames;
            callback();
          }
        });
      },
      function(callback) {
        async.map(teams, TeamService.fetchTeamWithObj, function(err, results) {
          if (err || results == undefined) {
            console.log("There was an error performing the map.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            teams = results;
            callback();
          }
        });
      },
    ], function(callback) {
      res.send({
        teams: teams
      });
    });
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
        TeamService.fetchTeamWithID(req.param('teamID'), function(err, results) {
          if (err || results == undefined) {
            console.log("There was an error getting the team.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            team = results;
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
   * be changed. **Must contain the team ID**
   * @sample :: `{success: true}`
   * @sample :: `500`
   */
  edit: function(req, res) {
    var post = req.body;
    var tempID = post.id;
    delete post.id;
    if (post.logs == undefined || post.logs.length == 0) {
      delete post.logs;
    }
    if (post.players == undefined || post.players.length == 0) {
      delete post.players;
    }
    Team.update({
      id: tempID
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
            callback();
          }
        });
      },
      function(callback) {
        Gamelog.destroy({
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
