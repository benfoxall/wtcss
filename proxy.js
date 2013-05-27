var http = require('http'),
    url = require('url'),
    request = require('request');

var pathname = process.env.pathname || '/';
var port = process.env.PORT || 5000;

var app = http.createServer(function (req, resp) {

  var u = url.parse(req.url, true);

  if(u.pathname == pathname && u.query.url){

    resp.setHeader("Access-Control-Allow-Origin", "*");
    resp.setHeader("Access-Control-Allow-Headers", "X-Requested-With");

    request({
      url:u.query.url
    }).pipe(resp);

  } else {
    resp.write("error");
    resp.end();
  }

});

app.listen(port, function() {
  console.log("Listening on " + port);
});