var express = require('express')
var livereload = require("./livereload");
var app = express();

var server = livereload(app, [
	"./lew42.github.io",
	"!lew42.github.io/simple.js",
	"./simple/docs",
	"!simple/docs/built/simple.js",
	"./define/docs"
	, "!**/*.css"
]);

var root = __dirname + "/lew42.github.io";

// this will immediately trigger an initial build for each
// so we must build define.js first, then simple.js
// (because simple.js imports the compiled define.js)
var define = require("./define/server.js")(app, livereload);

chokidar.watch(__dirname + "/Module/docs")
app.use("/Module/", express.static(__dirname + "/Module/docs"));


var simple = require("./simple/server.js")(app, livereload);

app.use(express.static(root));



server.listen(80, function () {
  console.log('Listening on port 80!')
});