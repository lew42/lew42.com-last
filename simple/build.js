var fs = require("fs");

var basePath = __dirname + "/docs/";

var getFile = function(file){
	return "// " + file + "\r\n" + 
		fs.readFileSync(basePath + file, "utf8") + "\r\n\r\n\r\n\r\n";
};

var getModule = function(file){
	return getFile("modules/" + file + "/" + file + ".js")
}


var load = fs.readFileSync.bind(fs);
var save = fs.writeFileSync.bind(fs);

var build = module.exports = function(livereload){
	console.log("\r\nbuilding simple.js...");

	// if (livereload){
	// 	console.log("block livereload");
	// 	livereload.block = true;
	// }

	var bundle = 
		getFile("define.js");

	[ "is", "Base"].forEach((file) => bundle += getModule(file)); 

	bundle += getFile("modules/mixin/events.js");

	["mixin", "Base2", "View", "Test", "Server", "simple"].forEach((file) => bundle += getModule(file));
	// console.log(bundle);

	save(__dirname + "/../lew42.github.io/simple.js", bundle);
	// save(__dirname + "/../define/docs/simple.js", bundle); // i think this would bomb - watch -> change -> watch -> change loop of death
		// no - probably not, because its synchronous?
		// chokidar doesn't seem to know about these file writes
	save(__dirname + "/docs/built/simple.js", bundle);

	// if (livereload){
	// 	console.log("unblock livereload");
	// 	livereload.block = false;
	// }

	console.log("done building simple.js\r\n");
};

build();