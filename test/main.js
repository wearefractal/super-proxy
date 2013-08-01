var superProxy = require('../');
var should = require('should');
require('mocha');

var request = require('request');
var express = require('express');
var testPort = process.env.TEST_PORT || 9080;

describe('super-proxy', function() {
  describe('constructor()', function() {
    it('should return a bouncy instance', function(done) {
      var proxy = superProxy();
      should.exist(proxy);
      should.exist(proxy.listen);
      done();
    });
  });

  describe('use()', function() {
    it('should run middleware in a stack', function(done) {
      var proxy = superProxy();
      should.exist(proxy.use);
      proxy.use(function(req, res, next){
        should.exist(req);
        req.url.should.equal("/test");
        should.exist(res);
        should.exist(res.bounce);
        should.exist(next);
        next();
      });
      proxy.use(function(req, res, next){
        should.exist(req);
        should.exist(res);
        should.exist(res.bounce);
        should.exist(next);
        proxy.close();
        done();
      });
      proxy.use(function(req, res, next){
        throw new Error("next not called but middleware continued");
      });
      proxy.listen(testPort, function(){
        request("http://localhost:"+testPort+"/test")
      });
    });

    it('should run express middleware', function(done) {
      var proxy = superProxy();
      should.exist(proxy.use);
      proxy.use(express.basicAuth('test', 'test123'));
      proxy.use(function(req, res, next){
        proxy.close();
        done();
      });
      proxy.listen(testPort, function(){
        request("http://test@test123:localhost:"+testPort+"/test")
      });
    });

  });
});
