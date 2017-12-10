define.path = "define/modules";
define(["thing", "thing.js"], function(require){
	const thing = require("thing");
	const thingjs = require("thing.js");
	console.log(thing, thingjs);

	const Base = define.Base;

	Base.on("something", () => console.log("yo"));

	Base.emit("something");
});