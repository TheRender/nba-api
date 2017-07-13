/**
 * Team.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    name: {
      type: 'string'
    },

    city: {
      type: 'string'
    },

    // ID specific from the NBA API
    teamID: {
      type: 'string'
    },

    players: {
      type: 'array',
      defaultsTo: []
    },

    logo: {
      type: 'url'
    },

    seasonWins: {
      type: 'array',
      defaultsTo: []
    },

    seasonLosses: {
      type: 'array',
      defaultsTo: []
    },

    location: {
      type: 'string'
    },

    logs: {
      type: 'array',
      defaultsTo: []
    }

  }
};
