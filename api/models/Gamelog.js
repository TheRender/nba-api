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

    teamID: {
      type: 'string'
    },

    gameOpponent: {
      type: 'string'
    },

    score: {
      type: 'string'
    },

    minutes: {
      type: 'integer'
    },

    points: {
      type: 'integer'
    },

    rebounds: {
      type: 'integer'
    },

    assists: {
      type: 'integer'
    },

    steals: {
      type: 'integer'
    },

    blocks: {
      type: 'integer'
    },

    fieldGoalsMade: {
      type: 'integer'
    },

    fieldGoalsAttempted: {
      type: 'integer'
    },

    fieldGoalPercentage: {
      type: 'integer'
    },

    threePointsMade: {
      type: 'integer'
    },

    threePointsAttempted: {
      type: 'integer'
    },

    threePointsPercentage: {
      type: 'integer'
    },

    freeThrowsMade: {
      type: 'integer'
    },

    freeThrowsAttempted: {
      type: 'integer'
    },

    freeThrowsPercentage: {
      type: 'integer'
    },

    fouls: {
      type: 'integer'
    },

    plusMinus: {
      type: 'integer'
    },

  }
};
