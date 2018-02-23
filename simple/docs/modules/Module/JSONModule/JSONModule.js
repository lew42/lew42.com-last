define("Module/JSONModule", ["Module"], {log: false}, function(require, exports, module){
////////

/*
Never defined in a file, only pre-instantiated when depended upon.
We basically just need to resolve the id the same as usual, and then use XHR or fetch or something.

new JSONModule({
	token: ?
	id: ?,

});
*/
const Module = require("Module");

const JSONModule = module.exports = Module.extend("JSONModule", {
	instantiate(...args){
		this.initialize();
		this.set(...args);
	},
	request(){
		this.queued = false;

		if (this.data)
			throw "already loaded?";

		if (!this.requested){
			this.ready.resolve(fetch(this.id).then(r => r.json()).then(this.exec.bind(this)))
			this.requested = true;
			this.emit("requested");
		} else {
			throw "trying to rerequest json";
		}
	},
	exec(json){
		this.exports = json
		this.emit("executed");
		return this.exports;
	},
	register(dependent){
		this.dependents.push(dependent);
		this.emit("dependent", dependent);

		if (!this.data && !this.queued && !this.requested)
			this.queued = setTimeout(this.request.bind(this), 0);
	}
});

JSONModule.modules = Module.modules = Module.modules || {};

Module.prototype.instantiate = function(...args){
	return (this.get(args[0]) || this.switch(...args) || this.initialize()).set(...args);
};

Module.prototype.switch = function(...args){
	if (args[0].indexOf(".json") === args[0].length - 5){
		return new JSONModule(); // args will be set in .instantiate above
	} else {
		return false;
	}
};

}); // end