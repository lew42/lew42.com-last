var fs = require("fs");

var basePath = __dirname + "/docs/";

var getFile = function(file){
	return 
		"// " + file + "\r\n" + // a comment with the filename
			fs.readFileSync(basePath + file, "utf8") + "\r\n\r\n\r\n\r\n";
};

var load = fs.readFileSync.bind(fs);
var save = fs.writeFileSync.bind(fs);

var build = module.exports = function(){
	console.log("building simple.js...");
	var bundle = 
		getFile("define.js");

	console.log(bundle);

	save(__dirname + "/../lew42.github.io/simple.js", bundle);
	// save(__dirname + "/../define/docs/simple.js", bundle); // i think this would bomb - watch -> change -> watch -> change loop of death
	save(__dirname + "/docs/simple.js", bundle);

	console.log("done building simple.js");
};

build();