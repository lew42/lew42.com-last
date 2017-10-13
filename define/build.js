var fs = require("fs");

var basePath = __dirname + "/docs/";

var getFile = function(file){
	return "// " + file + "\r\n" + fs.readFileSync(basePath + file, "utf8") + "\r\n\r\n\r\n\r\n";
};

var load = fs.readFileSync.bind(fs);
var save = fs.writeFileSync.bind(fs);

var build = module.exports = function(){
	console.log("building define.js...");
	var bundle = 
		getFile("1_define_root.js") +
		getFile("2_assign.js") +
		getFile("3_Base.js") +
		getFile("4_log.js") +
		getFile("5_Module.js") +
		getFile("6_define.js");

	save(__dirname + "/../lew42.github.io/define.js", bundle);
	save(__dirname + "/../simple/docs/define.js", bundle);
	save(__dirname + "/docs/define.js", bundle);

	console.log("done building define.js");
};

build();