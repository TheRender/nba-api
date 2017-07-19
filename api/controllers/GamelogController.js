/**
 * @type :: CLASS
 * @class :: GamelogController
 * @author :: Steven Hanna
 * @description :: Controller logic for Gamelogs.
 * @see :: /models/Gamelog.js
 * @parent :: /models/Team.js
 */

module.exports = {

  /**
   * @type :: REST
   * @route :: /gamelog/new
   * @crud :: post
   * @param :: Data sent as a post object should include:
   * `teamID, date, location, gameOpponent, opponentTeamID, score, minutes, points,
   * rebounds, steals, blocks, fieldGoalsMade, fieldGoalsAttempted,
   * fieldGoalPercentage, threePointsMade, threePointsAttempted,
   * threePointsPercentage, freeThrowsMade, freeThrowsAttempted,
   * freeThrowsPercentage, fouls, plusMinus`
   * @note :: Make sure to include the `teamID` so this can be linked properly
   * @sample :: `{ success: true, log: object}`
   * @sample :: `500`
   */
  new: function(req, res) {
    var post = req.body;
    var team;
    var gamelog;
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
        var obj = {
          date: post.date,
          location: post.location,
          teamID: team.id,
          gameOpponent: post.gameOpponent,
          opponentTeamID: post.opponentTeamID,
          score: post.score,
          minutes: post.minutes,
          points: post.points,
          rebounds: post.rebounds,
          steals: post.steals,
          blocks: post.blocks,
          fieldGoalsMade: post.fieldGoalsMade,
          fieldGoalsAttempted: post.fieldGoalsAttempted,
          fieldGoalPercentage: post.fieldGoalPercentage,
          threePointsMade: post.threePointsMade,
          threePointsAttempted: post.threePointsAttempted,
          threePointsPercentage: post.threePointsPercentage,
          freeThrowsMade: post.freeThrowsMade,
          freeThrowsAttempted: post.freeThrowsAttempted,
          freeThrowsPercentage: post.freeThrowsPercentage,
          fouls: post.fouls,
          plusMinus: post.plusMinus,
          gameID: post.gameID
        };
        Gamelog.create(obj).exec(function(err, gl) {
          if (err || gl == undefined) {
            console.log("There was an error creating the gamelog.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            gamelog = gl;
            callback();
          }
        });
      },
      function(callback) {
        if (team.logs == undefined) {
          team.logs = [];
        }
        team.logs.unshift(gamelog.id);
        team.save(function(err) {
          if (err) {
            console.log("There was an error saving the team.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            callback();
          }
        });
      }
    ], function(callback) {
      res.send({
        success: true,
        log: gamelog
      });
    });
  },

  existsNBAID: function(req, res) {
    req.validate({
      logID: 'string'
    });
    Gamelog.findOne({
      gameID: req.param('logID')
    }).exec(function(err, game) {
      if (err) {
        console.log("There was an error finding the log.");
        console.log("Error = " + err);
        res.serverError();
      } else if (game == undefined) {
        res.send({
          exists: false
        });
      } else {
        res.send({
          exists: true,
          id: game.id
        });
      }
    });
  },

  /**
   * @type :: REST
   * @route :: /gamelog/:logID
   * @crud :: get
   * @description :: Retrieves the gamelog information
   * @param :: logID - the ID of the log to look up
   * @sample :: `{log: object}`
   * @sample :: `500`
   */
  get: function(req, res) {
    req.validate({
      logID: 'string'
    });
    Gamelog.findOne({
      id: req.param('logID')
    }).exec(function(err, log) {
      if (err || log == undefined) {
        console.log("There was an error finding the log.");
        console.log("Error = " + err);
        res.serverError();
      } else {
        res.send({
          log: log
        });
      }
    });
  },

  /**
   * @type :: REST
   * @route :: /gamelog/edit
   * @crud :: post
   * @description :: Edit the given gamelogs's information.  Only edits the data
   * given
   * @param :: Post object with an object representation of the data that has to
   * be changed. **Must contain the gamelog ID as id**
   * @sample :: `{success: true}`
   * @sample :: `500`
   */
  edit: function(req, res) {
    var post = req.body;
    Gamelog.update({
      id: post.id
    }, post).exec(function(err) {
      if (err) {
        console.log("There was an error updating the gamelog.");
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
   * @route :: /gamelog/delete
   * @crud :: DELETE
   * @description :: Delete the data about a given gamelog.  Also removes the
   * gamelog from it's associated team
   * @param :: Post object wih the logID: `{logID: 12345}`
   * @sample :: `{success: true}`
   * @sample :: `500`
   */
  delete: function(req, res) {
    var post = req.body;

    var log;
    var team;
    async.series([
      function(callback) {
        Gamelog.findOne({
          id: post.logID
        }).exec(function(err, gl) {
          if (err || gl == undefined) {
            console.log("There was an error finding the game log.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            log = gl;
            callback();
          }
        });
      },
      function(callback) {
        Team.findOne({
          id: log.teamID
        }).exec(function(err, tm) {
          if (err || tm == undefined) {
            console.log("There was an error finding the team.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            team = tm;
            callback();
          }
        });
      },
      function(callback) {
        var index = team.logs.indexOf(log.id);
        if (index > -1) {
          team.logs.splice(index, 1);
        }
        team.save(function(err) {
          if (err) {
            console.log("There was an error saving the team after removing the log.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            callback();
          }
        });
      },
      function(callback) {
        Gamelog.destroy({
          id: log.id
        }).exec(function(err) {
          if (err) {
            console.log("There was an error deleting the gamelog.");
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
