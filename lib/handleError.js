function templ(opt) {
  var html = '<html><head><title>Error</title></head>';
  html += '<body><center><h3>';
  html += opt.code + ' - ' + opt.error;
  html += '</h3></center></body></html>';
  return html;
}

module.exports = function(req, res, code, msg) {
  if (code) res.statusCode = code;
  if (res.statusCode < 400) res.statusCode = 500;
  var accept = req.headers.accept || '';

  // html
  if (~accept.indexOf('html')) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(templ({error: msg, code: res.statusCode}));
  // json
  } else if (~accept.indexOf('json')) {
    var json = JSON.stringify({error: msg, code: res.statusCode});
    res.setHeader('Content-Type', 'application/json');
    res.end(json);
  // plain text
  } else {
    res.setHeader('Content-Type', 'text/plain');
    res.end(err.stack);
  }
};