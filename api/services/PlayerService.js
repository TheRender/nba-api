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
    PlayerStat.find({
      id: playerObj.stats
    }).exec(function(err, stats) {
      if (err || stats == undefined) {
        console.log("There was an error finding the stats.");
        console.log("Error = " + err);
        cb(err, undefined);
      } else {
        playerObj.stats = stats;
        cb(undefined, playerObj);
      }
    });
  }
}
