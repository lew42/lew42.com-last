var chokidar = require("chokidar");
var fs = require("fs");

chokidar.watch(__dirname + "/*file").on("all", function(changed){
	console.log("changed", arguments);
	fs.readFile(__dirname + "/file", "utf8", (err, data) => {
		if (err) throw err;
		console.log("read", data);
		// setTimeout(function(){
		// 	fs.writeFile(__dirname + "/file", data+"2", (err) => {
		// 		if (err) throw err;
		// 		console.log("saved");
		// 	});
		// }, 1000);
	});
});