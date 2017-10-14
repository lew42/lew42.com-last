var express = require('express')
var root = __dirname + "/public";
// var livereload = require("./livereload");

var watch = require("./watch.js");

var server = module.exports = function(app, livereload){
	var start = false;
	if (!app){
		app = express();
		start = true;
		// livereload(app);

	}

	watch(livereload);

	app.use("/simple/", express.static(__dirname + "/docs"));

	if (start){
		// serve /public/ from server root, but only if we're in standalone mode
		app.use(express.static(root));

		app.listen(80, function () {
		  console.log('Listening on port 80!')
		});
	}
};

// serve(); //?? we don't want to call this if we're running in embedded mode...
// create serve.js (the standalone server script that imports server.js)
// and server.js exports a function to create the server..