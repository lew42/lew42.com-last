var chokidar = require("chokidar");
var build = require("./build");
debugger;
chokidar.watch(__dirname + "/docs").on("change", build);