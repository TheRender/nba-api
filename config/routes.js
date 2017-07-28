/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
   * etc. depending on your default view engine) your home page.              *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  'GET /': {
    controller: 'team',
    action: 'home'
  },

  'GET /teams': {
    controller: 'team',
    action: 'getAll'
  },

  'POST /team/new': {
    controller: 'team',
    action: 'new'
  },

  'POST /team/edit': {
    controller: 'team',
    action: 'edit'
  },

  'DELETE /team/delete': {
    controller: 'team',
    action: 'delete'
  },

  'GET /players': {
    controller: 'player',
    action: 'getAll'
  },

  'GET /player/exists/id/:playerID': {
    controller: 'player',
    action: 'existsID'
  },

  'GET /player/exists/nbaid/:playerID': {
    controller: 'player',
    action: 'existsNBAID'
  },

  'GET /team/exists/id/:teamID': {
    controller: 'team',
    action: 'existsID'
  },

  'GET /team/exists/nbaid/:teamID': {
    controller: 'team',
    action: 'existsNBAID'
  },

  'GET /team/:teamID': {
    controller: 'team',
    action: 'get'
  },

  'POST /player/playerSearch': {
    controller: 'player',
    action: 'searchPlayerNamesAutoComplete'
  },

  'POST /player/new': {
    controller: 'player',
    action: 'new'
  },

  'POST /player/edit': {
    controller: 'player',
    action: 'edit'
  },

  'DELETE /player/delete': {
    controller: 'player',
    action: 'delete'
  },

  'GET /player/:playerID': {
    controller: 'player',
    action: 'get'
  },

  'POST /gamelog/new': {
    controller: 'gamelog',
    action: 'new'
  },

  'GET /gamelog/exists/nbaid/:gameID/:playerID': {
    controller: 'gamelog',
    action: 'existsNBAID'
  },

  'POST /gamelog/edit': {
    controller: 'gamelog',
    action: 'edit'
  },

  'DELETE /gamelog/delete': {
    controller: 'gamelog',
    action: 'delete'
  },

  'GET /gamelog/:logID': {
    controller: 'gamelog',
    action: 'get'
  },

  'POST /game/new': {
    controller: 'game',
    action: 'new'
  },

  'GET /games': {
    controller: 'game',
    action: 'getAll'
  },

  'GET /game/exists/nbaid/:gameID': {
    controller: 'game',
    action: 'existsNBAID'
  },

  'POST /game/edit': {
    controller: 'game',
    action: 'edit'
  },

  'DELETE /game/delete': {
    controller: 'game',
    action: 'delete'
  },

  'GET /game/:gameID': {
    controller: 'game',
    action: 'get'
  },

  'POST /playerstat/new': {
    controller: 'playerstat',
    action: 'new'
  },

  'POST /playerstat/edit': {
    controller: 'playerstat',
    action: 'edit'
  },

  'DELETE /playerstat/delete': {
    controller: 'playerstat',
    action: 'delete'
  },

  'GET /playerstat/:statID': {
    controller: 'playerstat',
    action: 'get'
  },

  'GET /gamelogs': {
    controller: 'gamelog',
    action: 'getAll'
  },


  /***************************************************************************
   *                                                                          *
   * Custom routes here...                                                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the custom routes above, it   *
   * is matched against Sails route blueprints. See `config/blueprints.js`    *
   * for configuration options and examples.                                  *
   *                                                                          *
   ***************************************************************************/

};
