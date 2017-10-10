define("devsocket", [], function(){

var ws = window.socket = new WebSocket("ws://localhost");

ws.addEventListener("open", function(e){
	console.log("websocket connected");
});

ws.addEventListener("message", function(e){
	console.log("message", e);
	if (e.data === "reload"){

		window.location.reload();
	}
});

}); // yee haw