define("Base", ["is", "server"], function(is, server){
	// for convenience
	window.is = is;
	window.log = define.log;
	window.logger = define.logger;
	window.server = server;

	return define.Base;
});