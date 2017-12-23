const fs = require("pify")(require('fs'));

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
		action(ws, data.action, data.data);
	}
}

function action(ws, action, data){
	switch (action){
		case "test":
			data.prop++;
			ws.send(JSON.stringify(data));
			break;
	}
}