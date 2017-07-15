/**
 * @type :: CLASS
 * @class :: PlayerStatController
 * @author :: David Sa and Steven Hanna
 * @description :: Controller logic for Player Stats.
 * @see :: /models/PlayerStat.js
 * @parent :: /models/Player.js
 */

module.exports = {

  /**
   * @type :: REST
   * @route :: /playerstat/new
   * @crud :: post
   * @param :: Data sent as a post object should include:
   * `season, gamesPlayed, minutes, ppg, rpg, apg, spg, bpg, topg, fieldGoalPercentage,
   * threePointsPercentage, freeThrowPercentage`
   * @note :: Make sure to include the `playerID` so this can be linked properly
   * @sample :: `{ success: true, log: object}`
   * @sample :: `500`
   */
  new: function(req, res) {
    var post = req.body;
    var player;
    var playerstat;
    async.series([
      function(callback) {
        Player.findOne({
          id: post.playerID
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
          season: post.season,
          gamesPlayed: post.gamesPlayed,
          minutes: post.minutes,
          ppg: post.ppg,
          rpg: post.rpg,
          apg: post.apg,
          spg: post.spg,
          bpg: post.bpg,
          topg: post.topg,
          fieldGoalPercentage: post.fieldGoalPercentage,
          threePointPercentage: post.threePointPercentage,
          freeThrowPercentage: post.freeThrowPercentage
        };
        PlayerStat.create(obj).exec(function(err, ps) {
          if (err || ps == undefined) {
            console.log("There was an error creating the player stat.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            playerstat = ps;
            callback();
          }
        });
      },
      function(callback) {
        if (player.stats == undefined) {
          player.stats = [];
        }
        player.stats.unshift(playerstat.id);
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
        stat: playerstat
      });
    });
  },

  /**
   * @type :: REST
   * @route :: /playerstat/:statID
   * @crud :: get
   * @description :: Retrieves the player stats information
   * @param :: statID - the ID of the stat to look up
   * @sample :: `{log: object}`
   * @sample :: `500`
   */
  get: function(req, res) {
    req.validate({
      statID: 'string'
    });
    PlayerStat.findOne({
      id: req.param('statID')
    }).exec(function(err, stat) {
      if (err || stat == undefined) {
        console.log("There was an error finding the stat.");
        console.log("Error = " + err);
        res.serverError();
      } else {
        res.send({
          stat: stat
        });
      }
    });
  },

  /**
   * @type :: REST
   * @route :: /playerstat/edit
   * @crud :: post
   * @description :: Edit the given playerstat's information.  Only edits the data
   * given
   * @param :: Post object with an object representation of the data that has to
   * be changed. **Must contain the playerstat ID as id**
   * @sample :: `{success: true}`
   * @sample :: `500`
   */
  edit: function(req, res) {
    var post = req.body;
    PlayerStat.update({
      id: post.id
    }, post).exec(function(err) {
      if (err) {
        console.log("There was an error updating the playerstat.");
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
   * @route :: /playerstat/delete
   * @crud :: DELETE
   * @description :: Delete the data about a given playerstat.  Also removes the
   * playerstat from it's associated player
   * @param :: Post object wih the statID: `{statID: 12345}`
   * @sample :: `{success: true}`
   * @sample :: `500`
   */
  delete: function(req, res) {
    var post = req.body;
    var playerstat;
    var player;
    async.series([
      function(callback) {
        PlayerStat.findOne({
          id: post.statID
        }).exec(function(err, s) {
          if (err || s == undefined) {
            console.log("There was an error finding the player stat.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            playerstat = s;
            console.log("stat" + playerstat);
            callback();
          }
        });
      },
      function(callback) {
        Player.findOne({
          id: playerstat.playerID
        }).exec(function(err, p) {
          if (err || p == undefined) {
            console.log("There was an error finding the player.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            player = p;
            callback();
          }
        });
      },
      function(callback) {
        var index = player.stats.indexOf(playerstat.id);
        if (index > -1) {
          player.stats.splice(index, 1);
        }
        player.save(function(err) {
          if (err) {
            console.log("There was an error saving the player after removing the stats.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            callback();
          }
        });
      },
      function(callback) {
        PlayerStat.destroy({
          id: playerstat.id
        }).exec(function(err) {
          if (err) {
            console.log("There was an error deleting the playerstat.");
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
