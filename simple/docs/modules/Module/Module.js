define("Module", ["Base" , "Module/local" ], function(require, exports, module){
////////

// console.log(this.resolve("Module/local"));
const Base = require("Base");
const local = require("Module/local");
const proto = define.Module.prototype;

const Module = module.exports = Base.extend("Module", {
	instantiate(...args){
		return (this.get(args[0]) || this.initialize()).set(...args);
	},
	get: proto.get,
	initialize: proto.initialize,
	exec: proto.exec,
	resolve: proto.resolve,
	import: proto.import,
	register: proto.register,
	require: proto.require,
	request: proto.request,
	set_id: proto.set_id,
	set_token: proto.set_token,
	set_deps: proto.set_deps,
	set_factory: proto.set_factory,
	id_from_src: proto.id_from_src,
	set$: proto.set$,

	local: local
});

Module.P = define.Module.P;
Module.get = define.Module.get;
Module.set = define.Module.set;
Module.url = define.Module.url;
Module.path = "modules";

}); // end
