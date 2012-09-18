// phantom js
// 
// This generates :
// - a screenshot of the page
// - a list of the css rules and where they impact the page

var fs = require('fs'),
    system = require('system'),
    webserver = require('webserver');

function get(url, callback){
  var page = new WebPage();

  page.viewportSize = { width: 800, height: 800 };
  page.clipRect = { top: 0, left: 0, width: 800, height: 1600 };

  page.onLoadStarted = function () {
    console.log('loading:' + url);
  };

  page.onLoadFinished = function (status) {
    console.log('loaded:' + url);
    
    page.injectJs('/lib/findStyles.js');
    
    
    var cssrules = page.evaluate(function () {
      return window._wtcss_styles;
    });

    callback({
      img:'data:image/gif;base64,' + page.renderBase64('png'),
      css:cssrules
    });
  };
  page.open(url);
}


var server, service;

server = webserver.create();

var port = system.env.PORT || 8080;

var html = fs.read('public/index.html');

service = server.listen(port, function (request, response) {
  var url = request.url;
  var idx = url.indexOf('?url=');
  if(idx != -1){
    var stripped = unescape(url.substr(idx + 5));
    console.log(stripped);
    get(stripped, function(data){    
      response.statusCode = 200;
      response.write(JSON.stringify(data));
      response.close();
    });
  } else { 
    //
    var html = fs.read('public/index.html');
    response.statusCode = 200;
    response.write(html);
    response.close();
  }
});

console.log("Listening on " + port);