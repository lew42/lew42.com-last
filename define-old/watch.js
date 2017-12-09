var chokidar = require("chokidar");
var build = require("./build");

chokidar.watch(__dirname + "/docs").on("change", build);