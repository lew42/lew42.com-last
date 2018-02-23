// const fs = require("pify")(require('fs'));
const fs = require("fs");

module.exports = (ws) => {
	ws.on("message", (data) => {
		incoming(ws, data);
	});
};

function parse(data){
	try {
		return JSON.parse(data);
	} catch (e){
		return false;
	}
}

function incoming(ws, data){
	data = parse(data);
	if (data && data.action){
		action(ws, data.action, data);
	}
}

function action(ws, action, data){
	switch (action){
		case "test":
			data.prop++;
			ws.send(JSON.stringify(data));
			break;
		// case ""
		case "module.load":
			ws.send(JSON.stringify({
				action: "module.load",
				path: data.module,
				data: require(data.module)
			}));
			break;
		case "save":
			save(data);
			break;
	}
}

function save(data){
	fs.writeFile("." + data.path, data.data, err => {
		if (err) {
			console.log("path", data.path);
			console.log("data", data.data);
			console.log(err);
			throw "woops";
		}
		console.log("save successful");
	});
}