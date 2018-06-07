const fs = require("fs");
const path = require("path");

module.exports = function(ws, data){
	console.log("file-explorer", data);
	if (data.file){
		var filePath = path.resolve(__dirname, "modules/tests/file-explorer/", data.file);
		console.log(filePath);
		if (data.data){
			fs.writeFileSync(filePath, data.data, "utf8")
		} else {
			ws.send(JSON.stringify({
				action: "file-explorer",
				file: data.file,
				data: fs.readFileSync(filePath, "utf8")
			}));
		}
	} else {
		ws.send(JSON.stringify({
			action: "file-explorer",
			data: fs.readdirSync("./modules/tests/file-explorer/")
		}));
	}
};