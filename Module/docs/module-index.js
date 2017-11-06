Module(["thing"], function(require){
	var thing = require("thing");
	console.log("this is index.js");

	Yo = Base.extend({
		name: "Yo"
	});
	PYo = new Proxy(Yo, {
		apply: function(target, thisArg, args){
			return Reflect.construct(target, args);
		}
	});
});