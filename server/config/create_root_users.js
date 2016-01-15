/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';


var User = require('../api/user/user.model');
var config = require('./local.env');

console.log('Seeding roots');
(config.ROOTS || []).forEach(function(rootUser) {
  console.log('Seeding root', rootUser)
  rootUser.provider = 'local';
  rootUser.role = 'admin';

  User.findOne({name: rootUser.name}).then(function(usr) {
    if (!usr) {
      User.create(rootUser).then(function() {
        console.log('Root user ' + rootUser.name + ' created');
      });
    }
    console.log('Root user ' + rootUser.name + ' created');
  });
});
