var concat = require("concat");
var chokidar = require("chokidar");
var fs = require("fs");
var File = require("../File");

File("./define.js")
	.concat(File("./log.js"))
	.concat(");")
	.concat(File("./auto/*").join())
	.write("../lew42.github.io/simple.js");

var update = function(){
	console.log("updating...");
	var log = fs.readFileSync("./log.js");
	var autoFiles = fs.readdir("./auto/", (err, files) => {
		files = files.map(file => "./auto/" + file);
		console.log(files);
		concat(["./define.js"].concat(files)).then((str) => {
			str += log + ");"
			fs.writeFileSync("../lew42.github.io/simple.js", str);
		});
	});
};

chokidar.watch(".").on("change", () => {
	update();
});