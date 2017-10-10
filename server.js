var http = require("http");
var fs = require("fs");
var chokidar = require("chokidar");
var WebSocket = require("ws");
var fallback = require('express-history-api-fallback')
var express = require('express')
var app = express()
var root = __dirname + "/lew42.github.io";

require("./simple/index.js");

app.use(express.static(root));
app.use(fallback( root + "/index.html"));

var server = http.createServer(app);
var wss = new WebSocket.Server({
	perMessageDeflate: false,
	server: server
});

wss.on("connection", function(ws){
	console.log("connected");

	chokidar.watch(root).on("change", () => {
		console.log("changed --> reload");
		ws.send("reload", (err) => {
			if (err) console.log("error");
			else console.log("reload message sent");
		});
	});
});


server.listen(80, function () {
  console.log('Example app listening on port 80!')
});