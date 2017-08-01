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
          stats: [],
          gamelogs: []
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
   * @route :: /players
   * @crud :: get
   * @description :: Retrieves all of the players
   * @sample :: `{players: [player]}`
   * @sample :: `500`
   */
  getAll: function(req, res) {
    var players;
    async.series([
      function(callback) {
        Player.find().exec(function(err, playerNames) {
          if (err || playerNames == undefined) {
            console.log("There was an error finding the players.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            players = playerNames;
            callback();
          }
        });
      },
      function(callback) {
        async.map(players, PlayerService.fetchPlayerWithObj, function(err, result) {
          if (err || result == undefined) {
            console.log("There was an error fetching the players.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            players = result;
            callback();
          }
        });
      },
    ], function(callback) {
      res.send({
        players: players
      });
    });
  },

  /**
   * @type :: REST
   * @route :: /player/exists/id/:playerID
   * @crud :: get
   * @description :: Determines if a player exists
   * @sample :: `{exists: false}`
   * @sample :: `{exists: true}`
   * @sample :: `500`
   */
  existsID: function(req, res) {
    req.validate({
      playerID: 'string'
    });
    Player.findOne({
      id: req.param('playerID')
    }).exec(function(err, player) {
      if (err) {
        console.log("There was an error finding the player.");
        console.log("Error = " + err);
        res.serverError();
      } else if (player == undefined) {
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
   * @route :: /player/exists/nbaid/:playerID
   * @crud :: get
   * @description :: Determines if a player exists.
   * If it does exist, sends the regular ID back also
   * @sample :: `{exists: false}`
   * @sample :: `{exists: true, id: string}`
   * @sample :: `500`
   */
  existsNBAID: function(req, res) {
    req.validate({
      playerID: 'string'
    });
    Player.findOne({
      playerID: req.param('playerID')
    }).exec(function(err, player) {
      if (err) {
        console.log("There was an error finding the player.");
        console.log("Error = " + err);
        res.serverError();
      } else if (player == undefined) {
        res.send({
          exists: false
        });
      } else {
        res.send({
          exists: true,
          id: player.id
        });
      }
    });
  },

  /**
   * @type :: REST
   * @route :: /player/:playerID
   * @crud :: get
   * @description :: Retrieves the player, the objects of all of the player,
   * and all other general information
   * @param :: playerID - the ID of the player to look up
   * @sample :: `{player: object}`
   * @sample :: `500`
   */
  get: function(req, res) {
    req.validate({
      playerID: 'string'
    });

    var player;
    async.series([
      function(callback) {
        PlayerService.fetchPlayerWithID(req.param('playerID'), function(err, results) {
          if (err || results == undefined) {
            console.log("There was an error finding the player.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            player = results;
            callback();
          }
        });
      }
    ], function(callback) {
      res.send({
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
    if (post.stats == undefined || post.stats.length == 0) {
      delete post.stats;
    }
    if (post.gamelogs == undefined || post.gamelogs.length == 0) {
      delete post.gamelogs;
    }
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

  /**
   * @type :: REST
   * @route :: /player/delete
   * @crud :: DELETE
   * @description :: Delete the data about a given player
   * @param :: Post object wih the playerID: `{playerID: 12345}`
   * @sample :: `{success: true}`
   * @sample :: `500`
   */
  delete: function(req, res) {
    var post = req.body;
    var player;
    var team;
    async.series([
      function(callback) {
        Player.findOne({
          id: post.playerID
        }).exec(function(err, play) {
          if (err || play == undefined) {
            console.log("There was an error finding the player.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            player = play;
            callback();
          }
        });
      },
      function(callback) {
        Team.findOne({
          id: player.teamID
        }).exec(function(err, teamName) {
          if (err || teamName == undefined) {
            console.log("There was an error finding the team.");
            console.log("Error = " + err);
            console.log(player.teamID);
            res.serverError();
          } else {
            team = teamName;
            callback();
          }
        });
      },
      function(callback) {
        // Remove the player id from the team
        var index = team.players.indexOf(player.id);
        if (index > -1) {
          team.players.splice(index, 1);
        }
        team.save(function(err) {
          if (err) {
            console.log("There was an error saving the team.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            callback();
          }
        });
      },
      function(callback) {
        PlayerStat.destroy({
          id: player.stats
        }).exec(function(err) {
          if (err) {
            console.log("There was an error destroying the player stats.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            callback();
          }
        });
      },
      function(callback) {
        Gamelog.destroy({
          id: player.gamelogs
        }).exec(function(err) {
          if (err) {
            console.log("There was an error deleting the gamelogs.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            callback();
          }
        });
      },
      function(callback) {
        Player.destroy({
          id: player.id
        }).exec(function(err) {
          if (err) {
            console.log("There was an error destroying the player.");
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


  /**
   * @type :: REST
   * @route :: /videos/information/:playerID
   * @crud :: post
   * @description :: Return YouTube information with player stats
   * @param :: Post object with an object with the video information
   * @sample :: `{video: object}`
   * @sample :: `500`
   */
  video: function(req, res) {
    var post = req.body;
    req.validate({
      playerID: 'string'
    });
    var video;
    var game;
    var gamelog;
    async.series([
      function(callback) {
        Gamelog.findOne({
          where: {
            playerID: req.param('playerID')
          },
          sort: 'createdAt',
        }).exec(function(err, log) {
          if (err || log == undefined) {
            console.log("There was an error finding the player logs.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            gamelog = log;
            callback();
          }
        });
      },
      function(callback) {
        var videoObj = {
          id: gamelog.id,
          gameID: gamelog.gameID,
          points: gamelog.points,
          rebounds: gamelog.rebounds,
          assists: gamelog.assists,
        }
        video = videoObj;
        callback();
      },
      function(callback) {
        Player.findOne({
          playerID: gamelog.playerID
        }).exec(function(err, player) {
          if (err || player == undefined) {
            console.log("There was an error finding the player.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            video.name = player.name;
            callback();
          }
        });
      }
      function(callback) {
        Game.findOne({
          where: {
            gameID: video.gameID
          },
          sort: 'createdAt',
        }).exec(function(err, gameInfo) {
          if (err) {
            console.log("There was an error finding the games.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            game = gameInfo;
            callback();
          }
        })
      },
      function(callback) {
        video.date = game.date.replace("/", ".");
        video.teamID = game.homeTeamID;
        video.teamTriCode = game.homeTriCode;
        video.opponentTeamID = game.awayTeamID;
        video.opponentTriCode = game.awayTriCode;
        callback();
      },
      function(callback) {
        // Get home team name
        Team.findOne({
          id: video.teamID
        }).exec(function(err, team) {
          if (err) {
            console.log("There was an error finding the home team.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            video.teamname = team.name;
            callback();
          }
        });
      },
      function(callback) {
        // Get away team name
        Team.findOne({
          id: video.opponentTeamID
        }).exec(function(err, team) {
          if (err) {
            console.log("There was an error finding the away team.");
            console.log("Error = " + err);
            res.serverError();
          } else {
            video.opponentTeamName = team.name;
            callback();
          }
        });
      },
      function(callback) {
        video.title = video.name + " Highlights | " + video.points + " Points | vs. " + video.opponentTeamName + " | " + video.date;
        video.description = "Follow us on Twitter: https://twitter.com/TheRenderNBA \n" + video.teamTriCode + " vs. " + video.opponentTriCode + "\n" + video.points + " Points, " + video.rebounds + " Rebounds, " + video.assists + " Assists \n" + "All clips property of the NBA. No copyright infringement is intended, all videos are edited to follow the \"Free Use\" guideline of YouTube.";
        video.tags = "nba, mix, basketball, 2017, new, hd, " + video.name + ", " + video.teamTriCode + ", " + video.team + ", " + video.opponentTeamTriCode + ", " + video.opponentTeam + ", highlights, Cavs, Cavaliers, Bulls, Wizards, Celtics, Nets, Rockets, Pelicans, Timberwolves, heat, Raptors, Pistons, Lakers, Bucks, Mavericks, Sixers, Magic, Suns, Ximo Pierto, NBATV, HD, Live Stream, Streaming, 720p"
        callback();
      },
    ], function(callback) {
      res.send({
        video: video
      });
    })
  },

  /**
   * @type :: REST
   * @route :: /player/playerSearch
   * @crud :: post
   * @description :: Search for a player with the given name
   * @param :: Post object wih the obj: `{searchTerm: "term"}`
   * @sample :: `{results: [players]}`
   * @sample :: `500`
   */
  searchPlayerNamesAutoComplete: function(req, res) {
    var post = req.body;
    Player.find({
      name: {
        contains: post.searchTerm
      }
    }).exec(function(err, players) {
      if (err || players == undefined) {
        console.log("There was an error finding the players.");
        console.log("Error = " + err);
        res.serverError();
      } else {
        async.map(players, function(p, cb) {
          cb(undefined, p.name);
        }, function(err, results) {
          res.send({
            results: results
          });
        });
      }
    });
  },

  /**
   * @type :: REST
   * @route :: /player/findFromname
   * @crud :: post
   * @description :: Search for a player with the given name
   * @param :: Post object wih the obj: `{name: "name"}`
   * @sample :: `{player: player}`
   * @sample :: `500`
   */
  findFromName: function(req, res) {
    var post = req.body;
    Player.findOne({
      name: post.name
    }).exec(function(err, player) {
      if (err || player == undefined) {
        console.log("There was an error finding the player.");
        console.log("Error = " + err);
        res.serverError();
      } else {
        res.send({
          player: player
        });
      }
    });
  },

};
