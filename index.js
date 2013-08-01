var bouncy = require('bouncy');
var async = require('async');
var handleError = require('./lib/handleError');
var express = require('express');

module.exports = function (opts) {
  var proxy = bouncy(opts, function(req, res, bounce) {
    // Augment req/res
    req.__proto__ = express.request;
    res.__proto__ = express.response;

    res.bounce = function(){
      bounce();
      return res;
    };
    res.error = function(code, msg) {
      handleError(req, res, code, msg);
      return res;
    };

    // Trigger middleware stack
    if (proxy._stack.length === 0) return;
    async.forEachSeries(proxy._stack, function (fn, done) {
      fn(req, res, done);
    });
  });

  // Augment bouncy with middleware
  proxy._stack = [];
  proxy.use = function(fn) {
    proxy._stack.push(fn);
    return proxy;
  };
  return proxy;
};