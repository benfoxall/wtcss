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
      img:page.renderBase64('png'),
      css:cssrules
    });
  };
  page.open(url);
}


// get('http://bfoxall.com', function(data){
//   console.log("GOT DATA", JSON.stringify(data));
// })

var server, service;

server = webserver.create();

var port = system.env.PORT || 8080;

service = server.listen(port, function (request, response) {
  var url = request.url;
  if(url[1] == '?'){
    console.log(url.substr(2));
    var stripped = url.substr(2);
    get(stripped, function(data){    
      response.statusCode = 200;
      response.write(JSON.stringify(data));
      response.close();
    });
  } else { 
    response.statusCode = 200;
    response.write("<html><h1>'sup");
    response.close();
  }
});

console.log("Listening on " + port);