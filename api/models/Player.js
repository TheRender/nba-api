/**
 * Player.js
 *
 * @description :: Player model
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    name: {
      type: 'string'
    },

    // Specific ID that the NBA gives
    playerID: {
      type: 'string'
    },

    headshotURL: {
      type: 'url'
    },

    teamName: {
      type: 'string'
    },

    // This should correspond with a team ID listed in our database
    teamID: {
      type: 'string'
    },

    jerseyNumber: {
      type: 'float'
    },

    position: {
      type: 'string'
    },

    careerPPG: {
      type: 'float'
    },

    careerRPG: {
      type: 'float'
    },

    careerAPG: {
      type: 'float'
    },

    // Array of stat ID's
    stats: {
      type: 'array',
      defaultsTo: []
    },

    gamelogs: {
      type: 'array',
      defaultsTo: []
    },

  }
};
