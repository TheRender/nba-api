/**
 * Game.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    date: {
      type: 'string'
    },

    gameID: {
      type: 'string'
    },

    startTime: {
      type: 'string'
    },

    clock: {
      type: 'string'
    },

    quarter: {
      type: 'integer'
    },

    isBuzzerBeater: {
      type: 'boolean'
    },

    isHalfTime: {
      type: 'boolean'
    },

    homeTeamScore: {
      type: 'integer'
    },

    homeTeamID: {
      type: 'string'
    },

    homeTriCode: {
      type: 'string'
    },

    awayTeamScore: {
      type: 'integer'
    },

    awayTeamID: {
      type: 'string'
    },

    awayTriCode: {
      type: 'string'
    },

    homePlayers: {
      type: 'array',
      defaultsTo: []
    },

    awayPlayers: {
      type: 'array',
      defaultsTo: []
    },

  }
};
