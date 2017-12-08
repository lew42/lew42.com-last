Module("thing", ["one"], function(require, exports, module){
	var one = require("one");
	console.log("this is thing.js", one);
	module.exports = function(){};
});