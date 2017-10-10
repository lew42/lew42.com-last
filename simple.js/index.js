// var concat = require("concat");
var chokidar = require("chokidar");
var fs = require("fs");

// var File = require("../File");

// File("./define.js")
// 	.concat(File("./log.js"))
// 	.concat(");")
// 	.concat(File("./auto/*").join())
// 	.write("../lew42.github.io/simple.js");

var update = function(){
	console.log("updating...");
	var bundle = "";
	var define = fs.readFileSync(__dirname + "/define.js");
	var log = fs.readFileSync(__dirname + "/log.js");
	bundle = define + log + ");" + "\r\n"; 
	var autoFiles = fs.readdir(__dirname + "/auto/", (err, files) => {
		files = files.map(file => __dirname + "/auto/" + file);
		files.forEach((file) => bundle += "\r\n\r\n\r\n/*" + file + "*/\r\n" + fs.readFileSync(file));
		// concat(["./define.js"].concat(files)).then((str) => {
		// 	str += log + ");"
		// 	fs.writeFileSync("../lew42.github.io/simple.js", str);
		// });
		fs.writeFileSync(__dirname + "/../lew42.github.io/simple.js", bundle);
	});

};



chokidar.watch(".").on("change", function() {
	console.log('changed', arguments);
	update();
});