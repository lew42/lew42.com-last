// Module(["thing"], function(require){
Module.base = "Module/modules";
Module(['thing'], function(thing){
	console.log("this is index.js", thing);
});