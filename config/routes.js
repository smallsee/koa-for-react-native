'use strict'

var Router = require('koa-router');
var User = require('../app/controller/user');
var App = require('../app/controller/app');

module.exports = function(){
  var router = new Router({
    prefix:'/api/1'
  })
  router.get('/u/signup',User.signup);
  router.post('/u/verify',User.verify);
  router.post('/u/update',User.update);

  router.post('/signature',App.signature);

  return router;
}