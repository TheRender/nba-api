/**
 * Gamelog.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    date: {
      type: 'string'
    },

    location: {
      type: 'string'
    },

    teamID: {
      type: 'string'
    },

    gameOpponent: {
      type: 'string'
    },

    opponentTeamID: {
      type: 'string'
    },

    score: {
      type: 'string'
    },

    minutes: {
      type: 'float'
    },

    points: {
      type: 'float'
    },

    rebounds: {
      type: 'float'
    },

    assists: {
      type: 'float'
    },

    steals: {
      type: 'float'
    },

    blocks: {
      type: 'float'
    },

    fieldGoalsMade: {
      type: 'float'
    },

    fieldGoalsAttempted: {
      type: 'float'
    },

    fieldGoalPercentage: {
      type: 'float'
    },

    threePointsMade: {
      type: 'float'
    },

    threePointsAttempted: {
      type: 'float'
    },

    threePointsPercentage: {
      type: 'float'
    },

    freeThrowsMade: {
      type: 'float'
    },

    freeThrowsAttempted: {
      type: 'float'
    },

    freeThrowsPercentage: {
      type: 'float'
    },

    fouls: {
      type: 'float'
    },

    plusMinus: {
      type: 'float'
    },

  }
};
