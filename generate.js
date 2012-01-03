// phantom js
// 
// This generates :
// - a screenshot of the page
// - a list of the css rules and where they impact the page

var fs = require('fs');

console.log(phantom.args);

var url   = phantom.args[0] || 'http://bfoxall.com';
var fnKey = phantom.args[1] || '_output';

var page = new WebPage();

page.viewportSize = { width: 800, height: 800 };
page.clipRect = { top: 0, left: 0, width: 800, height: 1600 };

page.onLoadStarted = function () {
  console.log('loading...');
};

page.onLoadFinished = function (status) {
  console.log('loaded.');
  
  page.injectJs('/lib/findStyles.js');
  
  
  var cssrules = page.evaluate(function () {
    return window._wtcss_styles;
  });
  
  var f = fs.open('public/data/'+fnKey+'.json', 'w');
  f.write(JSON.stringify(cssrules));
  f.close();

  page.render('public/data/'+fnKey+'.png');
  phantom.exit();

};

page.open(url);