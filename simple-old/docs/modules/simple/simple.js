Module("simple",

[ "is", "mixin", "Base2", "View", "Test", "server", "docReady"],

function(require){

	var is = require("is");
	var mixin = require("mixin");
	var Base2 = require("Base2");
	var View = require("View");
	var Test = require("Test");
	var server = require("server");

	window.is = is;
	window.mixin = mixin;
	window.Base2 = Base2;
	window.View = View;
	window.Test = Test;

	["h1", "h2", "h3", "p", "section", "aside", "article", "ul", 
		"li", "ol", "nav", "span", "a", "em", "strong"].forEach(function(tag){
		window[tag] = View.extend({
			tag: tag
		});
	});

	window.server = server

	// server.log("log");
	// server.log.info("info");
	// server.log.debug("debug");
	// server.log.warn("warn");
	// server.log.error("error");

	console.log("so simple");
	return "so simple";
});