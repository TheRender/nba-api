/**
 * @type :: CLASS
 * @class :: PlayerService
 * @parent :: PlayerController
 * @description :: A collection of useful functions and methods regarding
 * manipulating and retrieving player information
 * @see :: /models/Player.js
 * @author :: Steven Hanna
 */

module.exports = {

  /**
   * @type :: FUNC
   * @name :: getPlayerStats
   * @param :: playerObj - the complete playerobject
   * @param :: cb - the callback, contains `(error, playerObj)`
   * @description :: Retrieves the player stats for a given player, and returns
   * the entire player object
   * @return :: The entire player object with playerstats
   */
  getPlayerStats: function(playerObj, cb) {
    async.parallel([
      function(callback) {
        PlayerStat.find({
          id: playerObj.stats
        }).exec(function(err, stats) {
          if (err || stats == undefined) {
            console.log("There was an error finding the stats.");
            console.log("Error = " + err);
            cb(err, undefined);
          } else {
            playerObj.stats = stats;
            callback();
          }
        });
      },
      function(callback) {
        Gamelog.find({
          id: playerObj.gamelogs
        }).exec(function(err, gamelogs) {
          if (err || gamelogs == undefined) {
            console.log("There was an error finding the gamelogs.");
            console.log("Error = " + err);
            cb(err, undefined);
          } else {
            playerObj.gamelogs = gamelogs;
            callback();
          }
        });
      },
    ], function(callback) {
      cb(undefined, playerObj);
    });
  },

  /**
   * @type :: FUNC
   * @name :: fetchPlayerWithID
   * @param :: playerID - the ID of the player to fetch
   * @param :: cb - the callback, contains `(error, playerObject)`
   * @description :: Retrieves a player in its entirety
   * @return :: The entire player object including playerStats
   */
  fetchPlayerWithID: function(playerID, cb) {
    var player;
    async.series([
      function(callback) {
        Player.findOne({
          id: playerID
        }).exec(function(err, playerObj) {
          if (err || playerObj == undefined) {
            console.log("There was an error finding the player.");
            console.log("Error = " + err);
            cb(err, undefined);
          } else {
            player = playerObj;
            callback();
          }
        });
      },
      function(callback) {
        PlayerService.fetchPlayerWithObj(player, function(err, result) {
          if (err || result == undefined) {
            console.log("There was an error getting the player.");
            console.log("Error = " + err);
            cb(err, undefined);
          } else {
            player = result;
            callback();
          }
        });
      },
    ], function(callback) {
      cb(undefined, player);
    });
  },

  /**
   * @type :: FUNC
   * @name :: fetchPlayerWithObj
   * @param :: player - the object of the player to fetch
   * @param :: cb - the callback, contains `(error, playerObject)`
   * @description :: Retrieves a player in its entirety
   * @return :: The entire player object including playerStats
   */
  fetchPlayerWithObj: function(player, cb) {
    async.series([
      function(callback) {
        PlayerService.getPlayerStats(player, function(err, results) {
          if (err || results == undefined) {
            console.log("There was an error finding the player stats.");
            console.log("Error = " + err);
            cb(err, undefined);
          } else {
            player = results;
            callback();
          }
        });
      },
    ], function(callback) {
      cb(undefined, player);
    });
  }
}
