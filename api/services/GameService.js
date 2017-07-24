/**
 * @type :: CLASS
 * @class :: GameService
 * @parent :: GameController
 * @description :: A collection of useful functions and methods regarding
 * manipulating and retrieving game information
 * @see :: /models/Game.js
 * @author :: Steven Hanna
 */

module.exports = {

  /**
   * @type :: FUNC
   * @name :: getPlayers
   * @param :: gameObj - the ID of the game to fetch the players
   * @param :: cb - the callback, contains `(error, gameObj)`
   * @description :: Retrieves all of the players of a game
   * @return :: The game object will all of its players
   */
  getPlayers: function(gameObj, cb) {
    async.parallel([
      function(callback) {
        async.map(gameObj.homePlayers, PlayerService.fetchPlayerWithID, function(err, results) {
          if (err || results == undefined) {
            cb(err, undefined);
          } else {
            gameObj.homePlayers = results;
            callback();
          }
        });
      },
      function(callback) {
        async.map(gameObj.awayPlayers, PlayerService.fetchPlayerWithID, function(err, results) {
          if (err || results == undefined) {
            cb(err, undefined);
          } else {
            gameObj.awayPlayers = results;
            callback();
          }
        });
      },
    ], function(callback) {
      cb(undefined, gameObj);
    });
  }


}
