'use strict'

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