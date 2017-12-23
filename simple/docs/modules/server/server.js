define("server", ["logger"], function(require, exports, module){
	const logger = require("logger");
	const log = logger(true);

	const server = module.exports = new WebSocket("ws://" + window.location.host);

	server.addEventListener("open", function(){
		log("server connected");
		server.send("connection!");
	});

	server.addEventListener("message", function(e){
		if (e.data === "reload"){
			window.location.reload();
		} else {
			log(e.data);
		}
	});
})