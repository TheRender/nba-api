/**
 * PlayerStat.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    season: {
      type: 'string'
    },

    gamesPlayed: {
      type: 'string'
    },

    minutes: {
      type: 'string'
    },

    ppg: {
      type: 'integer'
    },

    rpg: {
      type: 'integer'
    },

    apg: {
      type: 'integer'
    },

    spg: {
      type: 'integer'
    },

    bpg: {
      type: 'integer'
    },

    topg: {
      type: 'integer'
    },

    fieldGoalPercentage: {
      type: 'integer'
    },

    threePointPercentage: {
      type: 'integer'
    },

    freeThrowPercentage: {
      type: 'integer'
    }

  }
};
