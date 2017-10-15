define("simple",

[ "is", "mixin", "Base2", "View", "Test", "Server"],

function(is, mixin, Base2, View, Test, Server){

	window.Base = define.Base;
	window.log = define.log;

	window.is = is;
	window.mixin = mixin;
	window.Base2 = Base2;
	window.View = View;
	window.Test = Test;

	window.server = new Server({
		log: true
	});

	// server.log("log");
	// server.log.info("info");
	// server.log.debug("debug");
	// server.log.warn("warn");
	// server.log.error("error");

	return "so simple";
});