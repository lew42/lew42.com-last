define(function(){
	console.log("define/docs/index.js loaded");

	["thing", "thing.js", "thing/"].forEach((id) => console.log(define.resolve(id)));
});