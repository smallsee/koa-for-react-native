'use strict'

var mongoose = require('mongoose');
var xss = require('xss');
var User = mongoose.model('User');

exports.signup = function *(next){

  //var phoneNumber = this.request.body.phoneNumber;
  var phoneNumber = this.query.phoneNumber;
  var user = yield User.findOne({
    phoneNumber:phoneNumber
  }).exec();
  console.log(phoneNumber);

  if (!user){
    user = new User({
      phoneNumber: xss(phoneNumber)
    })
  }
  else{
    user.verifyCode = '1234'
  }

  console.log(user);

  try {
    console.log(user);
    user = yield user.save();
  }catch (e){
    this.body = {
      success:false
    }

    return
  }

  console.log(user);


  this.body = {
    success: true
  }
};

exports.verify = function *(next){
  this.body = {
    success: true
  }
};

exports.update = function *(next){
  this.body = {
    success: true
  }
};