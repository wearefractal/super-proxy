var superProxy = require('../');

var proxy = superProxy();

proxy.use(function(req, res, next){
  next();
});

proxy.listen(8080);