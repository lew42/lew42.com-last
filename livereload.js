var http = require("http");
var chokidar = require("chokidar");
var WebSocket = require("ws");

var livereload = module.exports = function(app, path){
	if (!app)
		throw "need an app";

	var server = http.createServer(app);
	var wss = new WebSocket.Server({
		perMessageDeflate: false,
		server: server
	});

	wss.on("connection", function(ws){
		console.log("connected");

		chokidar.watch(path).on("change", () => {
			if (livereload.block){
				console.log("blocking a reload");
			} else {
				
				console.log("something changed, sending reload message");
				ws.send("reload", (err) => {
					if (err) console.log("livereload transmit error");
					else console.log("reload message sent");
				});
			}
		});
	});

	return server;
};