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

    homeMinutes: {
      type: 'float'
    },

    homePoints: {
      type: 'float'
    },

    homeRebounds: {
      type: 'float'
    },

    homeAssists: {
      type: 'float'
    },

    homeSteals: {
      type: 'float'
    },

    homeBlocks: {
      type: 'float'
    },

    homeFieldGoalsMade: {
      type: 'float'
    },

    homeFieldGoalsAttempted: {
      type: 'float'
    },

    homeFieldGoalPercentage: {
      type: 'float'
    },

    homeThreePointsMade: {
      type: 'float'
    },

    homeThreePointsAttempted: {
      type: 'float'
    },

    homeThreePointsPercentage: {
      type: 'float'
    },

    homeFreeThrowsMade: {
      type: 'float'
    },

    homeFreeThrowsAttempted: {
      type: 'float'
    },

    homeFreeThrowsPercentage: {
      type: 'float'
    },

    homeFouls: {
      type: 'float'
    },

    homePlusMinus: {
      type: 'float'
    },

    awayMinutes: {
      type: 'float'
    },

    awayPoints: {
      type: 'float'
    },

    awayRebounds: {
      type: 'float'
    },

    awayAssists: {
      type: 'float'
    },

    awaySteals: {
      type: 'float'
    },

    awayBlocks: {
      type: 'float'
    },

    awayFieldGoalsMade: {
      type: 'float'
    },

    awayFieldGoalsAttempted: {
      type: 'float'
    },

    awayFieldGoalPercentage: {
      type: 'float'
    },

    awayThreePointsMade: {
      type: 'float'
    },

    awayThreePointsAttempted: {
      type: 'float'
    },

    awayThreePointsPercentage: {
      type: 'float'
    },

    awayFreeThrowsMade: {
      type: 'float'
    },

    awayFreeThrowsAttempted: {
      type: 'float'
    },

    awayFreeThrowsPercentage: {
      type: 'float'
    },

    awayFouls: {
      type: 'float'
    },

    awayPlusMinus: {
      type: 'float'
    },

  }
};
