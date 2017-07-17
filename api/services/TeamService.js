/**
 * @type :: CLASS
 * @class :: TeamService
 * @parent :: TeamController
 * @description :: A collection of useful functions and methods regarding
 * manipulating and retrieving team information
 * @see :: /models/Team.js
 * @author :: Steven Hanna
 */

module.exports = {

  /**
   * @type :: FUNC
   * @name :: getAllPlayers
   * @param :: teamObj - the complete teamObject
   * @param :: cb - the callback, contains `(error, teamObj)`
   * @description :: Retrieves all of the players of a given team
   * @return :: The entire team object with the players
   */
  getAllPlayers: function(teamObj, cb) {
    async.series([
      function(callback) {
        Player.find({
          id: teamObj.players
        }).exec(function(err, playerNames) {
          if (err || playerNames == undefined) {
            console.log("There was an error getting the players.");
            console.log("Error = " + err);
            cb(err, undefined);
          } else {
            teamObj.players = playerNames;
            callback();
          }
        });
      },
      function(callback) {
        async.map(teamObj.players, PlayerService.getPlayerStats, function(err, results) {
          if (err || results == undefined) {
            console.log("There was an error getting the player stats.");
            console.log("Error = " + err);
            cb(err, undefined);
          } else {
            teamObj.players = results;
            callback();
          }
        });
      },
    ], function(callback) {
      cb(undefined, teamObj);
    });
  },

  /**
   * @type :: FUNC
   * @name :: fetchTeamWithID
   * @param :: teamID - the ID of the team to fetch
   * @param :: cb - the callback, contains `(error, teamObj)`
   * @description :: Retrieves a team in its entirety
   * @return :: The entire team object with the players and gamelog
   */
  fetchTeamWithID: function(teamID, cb) {
    var team;
    async.series([
      function(callback) {
        Team.findOne({
          id: teamID
        }).exec(function(err, teamName) {
          if (err || teamName == undefined) {
            console.log("There was an error finding the team.");
            console.log("Error = " + err);
            cb(err, undefined);
          } else {
            team = teamName;
            callback();
          }
        });
      },
      function(callback) {
        TeamService.fetchTeamWithObj(team, function(err, results) {
          if (err || results == undefined) {
            console.log("There was an error fetching the team.");
            console.log("Error = " + err);
            cb(err, undefined);
          } else {
            team = results;
            callback();
          }
        });
      }
    ], function(callback) {
      cb(undefined, team);
    });
  },

  /**
   * @type :: FUNC
   * @name :: fetchTeamWithObj
   * @param :: team - the object of hte team to fetch
   * @param :: cb - the callback, contains `(error, teamObj)`
   * @description :: Retrieves a team in its entirety from an object
   * @return :: The entire team object with the players and gamelog
   */
  fetchTeamWithObj: function(team, cb) {
    async.series([
      function(callback) {
        TeamService.getAllPlayers(team, function(err, results) {
          if (err || results == undefined) {
            console.log("There was an error getting all of the players.");
            console.log("Error = " + err);
            cb(err, undefined);
          } else {
            team = results;
            callback();
          }
        });
      },
      function(callback) {
        Gamelog.find({
          id: team.logs
        }).exec(function(err, logs) {
          if (err || logs == undefined) {
            console.log("There was an error finding the logs.");
            console.log("Error = " + err);
            cb(err, undefined);
          } else {
            team.logs = logs;
            callback();
          }
        });
      }
    ], function(callback) {
      cb(undefined, team);
    });
  }
}
