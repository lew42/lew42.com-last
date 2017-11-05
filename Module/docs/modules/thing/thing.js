Module("thing", ["one"], function(require){
	var one = require("one");
	console.log("this is thing.js", one);
});