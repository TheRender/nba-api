/**
 * @type :: CLASS
 * @class :: GameController
 * @author :: David Sa
 * @description :: Controller logic for Games.
 * @see :: /models/Game.js
 * @parent :: /models/Team.js
 */

module.exports = {

	/**
   * @type :: REST
   * @route :: /game/new
   * @crud :: post
   * @param :: Data sent as a post object should include:
   * `date, gameID, startTime, clock, quarter, isBuzzerBeater, isHalfTime, homeTeamScore,
	 * homeTeamID, homeTriCode, awayTeamScore, awayTeamID, awayTriCode, homePlayers, awayPlayers`
   * @note :: Make sure to include the `teamID` so this can be linked properly
   * @sample :: `{ success: true, game: object}`
   * @sample :: `500`
   */
	new: function(req, res) {
		var post = req.body;
		var homeTeam;
		var awayTeam;
		var game;
		async.series([
			function(callback) {
				Team.findOne({
					teamID: post.homeTeamID
				}).exec(function(err, teamName) {
					if (err || teamName == undefined) {
						console.log("There was an error finding the home team.");
						console.log("Error = " + err);
						res.serverError();
					} else {
						homeTeam = teamName;
						callback();
					}
				});
			},
			function(callback) {
				Team.findOne({
					teamID: post.awayTeamID
				}).exec(function(err, teamName) {
					if (err || teamName == undefined) {
						console.log('There was an error finding the away team.');
						console.log("Error = " + err);
						res.serverError();
					} else {
						awayTeam = teamName;
						callback();
					}
				});
			},
			function(callback) {
				var obj = {
					date: post.date,
					gameID: post.gameID,
					startTime: post.startTime,
					clock: post.clock,
					quarter: post.quarter,
					isBuzzerBeater: post.isBuzzerBeater,
					homeTeamScore: post.homeTeamScore,
					homeTeamID: homeTeam.id,
					homeTriCode: post.homeTriCode,
					awayTeamScore: post.awayTeamScore,
					awayTeamID: awayTeam.id,
					awayTriCode: post.awayTriCode,
					homePlayers: post.homePlayers,
					awayPlayers: post.awayPlayers
				};
				Game.create(obj).exec(function(err, g) {
					if (err || g == undefined) {
						console.log("There was an error creating the game");
						console.log("Error = " + err);
						res.serverError();
					} else {
						game = g;
						callback();
					}
				});
			},
			function(callback) {
				if (homeTeam.games == undefined) {
					homeTeam.games = [];
				}
				homeTeam.games.unshift(game.id);
				homeTeam.save(function(err) {
					if (err) {
						console.log("There was an error saving the home team.");
						console.log("Error = " + err);
						res.serverError();
					} else {
						callback();
					}
				});
			},
			function(callback) {
				if (awayTeam.games == undefined) {
					awayTeam.games = [];
				}
				awayTeam.games.unshift(game.id);
				awayTeam.save(function(err) {
					if (err) {
						console.log("There was an error saving the away team.");
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
				game: game
			});
		});
	},

	/**
   * @type :: REST
   * @route :: /game/:gameID
   * @crud :: get
   * @description :: Retrieves the game information
   * @param :: gameID - the ID from the DB of the game to look up
   * @sample :: `{game: object}`
   * @sample :: `500`
   */
	 get: function(req, res) {
		 req.validate({
			 gameID: 'string'
		 });
		 Game.findOne({
			 id: req.param('gameID')
		 }).exec(function(err, game) {
			 if (err || game == undefined) {
				 console.log("There was an error finding the game");
				 console.log("Error = " + err);
				 res.serverError();
			 } else {
				 res.send({
					 game: game
				 });
			 }
		 });
	 },

	 existsNBAID: function(req, res) {
     req.validate({
       gameID: 'string'
     });
     Game.findOne({
       gameID: req.param('gameID')
     }).exec(function(err, game) {
       if (err) {
         console.log("There was an error finding the game.");
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
    * @route :: /game/edit
    * @crud :: post
    * @description :: Edit the given game's information.  Only edits the data
    * given
    * @param :: Post object with an object representation of the data that has to
    * be changed. **Must contain the game ID as id**
    * @sample :: `{success: true}`
    * @sample :: `500`
    */
		edit: function(req, res) {
			var post = req.body;
			Game.update({
				id: post.id
			}, post).exec(function(err) {
				if (err) {
					console.log("There was an error updating the game");
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
	   * @route :: /game/delete
	   * @crud :: DELETE
	   * @description :: Delete the data about a given game.  Also removes the
	   * game from it's associated team
	   * @param :: Post object wih the gameID: `{gameID: 12345}`
	   * @sample :: `{success: true}`
	   * @sample :: `500`
	   */
		 delete: function(req, res) {
			 var post = req.body;
			 var game;
			 var homeTeam;
			 var awayTeam;
			 async.series([
				 function(callback) {
					 Game.findOne({
						 id: post.gameID
					 }).exec(function(err, g) {
						 if (err || g == undefined) {
							 console.log("There was an error finding the game.");
							 console.log("Error = " + err);
							 res.serverError();
						 } else {
							 game = g;
							 callback();
						 }
					 });
				 },
				 function(callback) {
					 Team.findOne({
						 id: post.homeTeamID
					 }).exec(function(err, tm) {
						 if (err || tm == undefined) {
							 console.log("There was an error finding the home team.");
							 console.log("Error = " + err);
							 res.serverError();
						 } else {
							 homeTeam = tm;
							 callback();
						 }
					 });
				 },
				 function(callback) {
					 Team.findOne({
						 id: post.awayTeamID
					 }).exec(function(err, tm) {
						 if (err || tm == undefined) {
							 console.log("There as an error finding the away team.");
							 console.log("Error = " + err);
							 res.serverError();
						 } else {
							 awayTeam = tm;
							 callback();
						 }
					 });
				 },
				 function(callback) {
					 var index = homeTeam.games.indexOf(game.id);
					 if (index > -1) {
						 homeTeam.games.splice(index, 1);
					 }
					 homeTeam.save(function(err) {
						 if (err) {
							 console.log("There was an error saving the home team.");
							 console.log("Error = " + err);
							 res.serverError();
						 } else {
							 callback();
						 }
					 });
				 },
				 function(callback) {
					 var index = awayTeam.games.indexOf(game.id);
					 if (index > -1) {
						 awayTeam.games.splice(index, 1);
					 }
					 awayTeam.save(function(err) {
						 if (err) {
							 console.log("There was an error saving the away team.");
							 console.log("Error = " + err);
							 res.serverError();
						 } else {
							 callback();
						 }
					 });
				 },
				 function(callback) {
					 Game.destroy({
						 id: game.id
					 }).exec(function(err) {
						 if (err) {
							 console.log("There was an error deleting the game.");
							 console.log("Error = " + err);
							 res.serverError();
						 } else {
							 callback();
						 }
					 });
				 },
			 ], function(callback) {
				 res.send({
					 success: true
				 });
			 });
		 },
};
