/**
 * @type :: CLASS
 * @class :: GamelogController
 * @author :: Steven Hanna
 * @description :: Controller logic for Gamelogs.
 * @see :: /models/Gamelog.js
 * @parent :: /models/Player.js
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
   * @note :: Make sure to include the `playerID` so this can be linked properly
   * @sample :: `{ success: true, log: object}`
   * @sample :: `500`
   */
  new: function(req, res) {
    var post = req.body;
    var player;
    var gamelog;
    async.series([
      function(callback) {
        Player.findOne({
          playerID: post.playerID
        }).exec(function(err, playerName) {
          if (err || playerName == undefined) {
            console.log("There was an error finding the player.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            player = playerName;
            callback();
          }
        });
      },
      function(callback) {
        var obj = {
          playerID: player.id,
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
        if (player.gamelogs == undefined) {
          player.gamelogs = [];
        }
        player.gamelogs.unshift(gamelog.id);
        player.save(function(err) {
          if (err) {
            console.log("There was an error saving the player.");
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
    var player;
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
        Player.findOne({
          id: log.playerID
        }).exec(function(err, pl) {
          if (err || pl == undefined) {
            console.log("There was an error finding the player.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            player = pl;
            callback();
          }
        });
      },
      function(callback) {
        var index = player.gamelogs.indexOf(log.id);
        if (index > -1) {
          player.gamelogs.splice(index, 1);
        }
        player.save(function(err) {
          if (err) {
            console.log("There was an error saving the player after removing the log.");
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
