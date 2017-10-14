var chokidar = require("chokidar");
var build = require("./build");

module.exports = function(livereload){
	chokidar.watch(__dirname + "/docs").on("change", function(){
		build(livereload);
	});
};