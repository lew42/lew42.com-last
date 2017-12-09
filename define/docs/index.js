define.path = "define/modules";
define(["thing", "thing.js"], function(require){
	const thing = require("thing");
	const thingjs = require("thing.js");
	console.log(thing, thingjs);
});