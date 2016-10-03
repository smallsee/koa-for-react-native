'use strict'

var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var db = 'mongodb://localhost/xiaohai-app';

mongoose.Promise = require('bluebird');
mongoose.connect(db);

// require('./app/models/user');

var models_path = path.join(__dirname,'/app/models');
var walk = function(modelPath){
  fs
    .readdirSync(modelPath)
    .forEach(function(file){
      var filePath = path.join(modelPath,'/' + file)
      var stat = fs.statSync(filePath)

      if (stat.isFile()){
        if (/(.*)\.(js|coffee)/.test(file)){
          require(filePath)
        }
      }else if (stat.isDirectory()){
        walk(filePath)
      }

    })
};

walk(models_path);

var koa = require('koa');
var logger = require('koa-logger');
var session = require('koa-session');
var bodyParser = require('koa-bodyparser');

var app = koa();

app.keys = ['xiaohai'];
app.use(logger());
app.use(session(app));
app.use(bodyParser());


// app.use(function *(next) {
//     console.log(this.href);
//     console.log(this.href);
//     this.body = {
//         success: true
//     };
//
//     yield next;
// });

var router = require('./config/routes')();

app
  .use(router.routes())
  .use(router.allowedMethods())





app.listen(1234);
console.log('已经在监听了:1234');