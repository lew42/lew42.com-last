Module("Base", ["is", "server"], function(require){
	var is = require("is");
	var server = require("server");

	// for convenience
	window.is = is;
	window.server = server;

	return Base;
});