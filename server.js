var express = require('express')
var app = express()
var livereload = require("./livereload")(app);
var root = __dirname + "/lew42.github.io";

// this will trigger a build for each
// so build define first, then simple
var define = require("./define/server.js")(app);
var simple = require("./simple/server.js")(app);

app.use(express.static(root));



app.listen(80, function () {
  console.log('Listening on port 80!')
});