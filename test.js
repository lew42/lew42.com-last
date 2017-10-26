var http = require("http");

var server = http.createServer(function(req, res){
	console.log(req);
	res.end();
});

server.listen(80, function(){
	console.log("listening");
});