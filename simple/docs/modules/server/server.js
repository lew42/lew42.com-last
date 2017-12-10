define("server", function(require, exports, module){
	const log = logger(true);

	const server = module.exports = new WebSocket("ws://" + window.location.host);

	server.addEventListener("open", function(){
		log("server connected");
	});

	server.addEventListener("message", function(e){
		if (e.data === "reload"){
			window.location.reload();
		} else {
			log("message from server", e);
		}
	});
})