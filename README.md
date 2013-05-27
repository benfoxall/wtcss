# WTCSS

The main parts of this are:

* a phantomjs script that launches the webserver and loads the pages
* a node.js proxy to get around some cors issues (which I'm having trouble reproducing at the moment)
* a script that is injected by the phantomjs to find the css rules, and the items they impact - lib/findStyles.js
* a frontend page that makes the requests and renders the interactions with canvas - public/index.html

## Running

This requires [phantom.js](http://phantomjs.org/),  once you have that installed - you can fire up the server with:

    phantomjs app.js

By default, this will run on http://localhost:8080

### [optional] cors proxy

The cors proxy is a [node.js](http://nodejs.org/) app - you can run it with

    npm install
    node proxy.js

Then tell the phantomjs script to use that by setting the `PROX` env variable

    PROX="http://localhost:5000/?url=" phantomjs app.js

## Contributing

It would be ace if you wanted to help improve this tool.  It's fairly hacked together at the moment so could do with a lot of love. If you have any questions about it at all ping me @benjaminbenben
