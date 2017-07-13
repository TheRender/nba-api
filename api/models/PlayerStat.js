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
      type: 'float'
    },

    rpg: {
      type: 'float'
    },

    apg: {
      type: 'float'
    },

    spg: {
      type: 'float'
    },

    bpg: {
      type: 'float'
    },

    topg: {
      type: 'float'
    },

    fieldGoalPercentage: {
      type: 'float'
    },

    threePointPercentage: {
      type: 'float'
    },

    freeThrowPercentage: {
      type: 'float'
    }

  }
};
