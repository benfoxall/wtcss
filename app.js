// this generates the data and also provides a proxy for external css stylesheets

var express = require('express'),
    request = require('request'),
    spawn = require('child_process').spawn;

var app = express.createServer();

app.configure(function(){
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var fnCount = 0;

app.post('/', function(req, res){
  
  var url = req.body.url;
  var key = fnCount++;
  
  var proc  = spawn('./bin/phantomjs', ['generate.js', url, key]);
  
  console.log('spawned:', proc.pid, url, key);
  
  
  proc.stdout.on('data', function (data) {
    console.log('stdout[' + proc.pid + ']: ' + data);
  });

  proc.stderr.on('data', function (data) {
    console.log('stderr[' + proc.pid + ']: ' + data);
  });
  
  proc.on('exit', function (code) {
    console.log('exit[' + proc.pid + ']: ' + code);
    if(code == 0){
      res.send({success:key});
    } else {
      res.send({error:'exitcode='+code});
    }
  });
  
  
});


// proxy a request giving CORS headers
app.get(/\/px\/([^\/]+)\/(.+)/, function(req, res){
  // todo 
  // if(req.params[0] !== proxkey);
  
  // console.log(req.url.substr(1));
  var url = req.params[1];
  if(!url || url == 'favicon.ico'){
    res.send('');
    return;
  }
  
  request(url, function (error, response, body) {
    console.log('proxying:', url);
    if (!error && response.statusCode == 200) {
      res.writeHead(200,{'Access-Control-Allow-Origin':'*'});
      res.write(body || '');
      res.end();
    }
  })
});

app.listen(3000);