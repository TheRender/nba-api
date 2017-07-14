/**
 * @type :: CLASS
 * @class :: PlayerController
 * @author :: Steven Hanna
 * @description :: Controller logic for Players.
 * @see :: /models/Player.js
 */

module.exports = {

  /**
   * @type :: REST
   * @route :: /player/new
   * @crud :: post
   * @param :: Data sent as a post object should include:
   * `name, playerID, headshotURL, teamName, teamID, jerseyNumber, position,
   * careerPPG, careerRPG, careerAPG`
   * @note :: The stats field will initially be empty
   * @sample :: `{ success: true, player: object }`
   * @sample :: `{ error: true, message: "The player already exists" }`
   * @sample :: `{ error: true, message: "That team does not exist" }`
   * @sample :: `500`
   */
  new: function(req, res) {
    var post = req.body;
    var player;
    var team;
    async.series([
      function(callback) {
        // Determine if the player already exists
        Player.findOne({
          name: post.name
        }).exec(function(err, player) {
          if (err) {
            console.log("There was an error finding the player.");
            console.log("Error = " + err);
            res.serverError();
          } else if (player != undefined) {
            res.send({
              error: true,
              message: "The player already exists"
            });
          } else {
            callback();
          }
        });
      },
      function(callback) {
        var playerObj = {
          name: post.name,
          playerID: post.playerID,
          headshotURL: post.headshotURL,
          teamName: post.teamName,
          teamID: post.teamID,
          jerseyNumber: post.jerseyNumber,
          position: post.position,
          careerPPG: post.careerPPG,
          careerRPG: post.careerRPG,
          careerAPG: post.careerAPG,
          stats: []
        };
        Player.create(playerObj).exec(function(err, play) {
          if (err || play == undefined) {
            console.log("There was an error creating the player.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            player = play
            callback();
          }
        });
      },
      function(callback) {
        // Add the player to the team
        Team.findOne({
          id: player.teamID
        }).exec(function(err, teamName) {
          if (err) {
            console.log("There was an error finding the team.");
            console.log("Error = " + err);
            res.serverError();
          } else if (teamName == undefined) {
            res.serverError({
              error: true,
              message: "That team does not exist."
            });
          } else {
            team = teamName;
            callback();
          }
        });
      },
      function(callback) {
        if (team.players == undefined) {
          team.players = [];
        }
        team.players.push(player.id);
        team.save(function(err) {
          if (err) {
            console.log("There was an error adding the player to a team.");
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
        player: player
      });
    });
  },

  /**
   * @type :: REST
   * @route :: /player/edit
   * @crud :: post
   * @description :: Edit the given players's information.  Only edits the data
   * given
   * @param :: Post object with an object representation of the data that has to
   * be changed. **Must contain the player ID**
   * @sample :: `{success: true}`
   * @sample :: `500`
   */
  edit: function(req, res) {
    var post = req.body;
    Player.update({
      id: post.id
    }, post).exec(function(err) {
      if (err) {
        console.log("There was an error updating the player.");
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
