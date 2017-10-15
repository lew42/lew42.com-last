define({
	id: "MyModule",
	deps: ["dep1", "dep2"],
	log: true,
	debug: false,
	factory: function(){

	}
});

define("MyModule", 

["dep1", "dep2"],

{ log: true, debug: true }, 

function(){

});


define({
	id: "MyModule",
	basePath: "simple",
	modulePath: "nodules",
	log: true,
	deps: []
}, function(){

});


define("MyModule", { 
	// log: true 
}, ["dep1"], function(dep1){
	this.log; // piggy back here, in order to turn logging/debugging on in one place...
});


define("MyModule", ["dep1"], 
// { log: true }, 
function(dep1){
	this.log; // piggy back here, in order to turn logging/debugging on in one place...
});