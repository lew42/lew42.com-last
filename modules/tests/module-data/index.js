Module("tests/module-data/index.js", 
	["./data"], function(require, exports, module){

console.log(this.resolve("./data/"));
});