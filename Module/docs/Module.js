const debug = false;

const Module = window.Module = Base.extend("Module", {
	base: "modules",
	debug: logger(debug),
	log: logger(false || debug),

	instantiate(...args){
		return (this.get(args[0]) || this.initialize()).set(...args);
	},

	get: function(token){
		return typeof token === "string" && Module.get(this.resolve(token));
	},

	initialize(...args){
		this.ready = P();
		this.dependencies = [];
		this.dependents = [];

		return this; // see instantiate()
	},

	resolve(token){
		const parts = token.split("/");

		// token ends with "/", example:
		// "path/thing/" --> "path/thing/thing.js"
		if (token[token.length-1] === "/"){
			token = token + parts[parts.length-2] + ".js";

		// last part doesn't contain a "."
		// "path/thing" --> "path/thing/thing.js"
		} else if (parts[parts.length-1].indexOf(".") < 0){
			token = token + "/" + parts[parts.length-1] + ".js";
		}

		if (token[0] !== "/")
			token = "/" + Module.base + "/" + token;

		return token; // the transformed token is now the id
	},

	import(token){
		return (new this.constructor(this.resolve(token))).register(this);
	},

	register(dependent){
		this.dependents.push(dependent);

		if (!this.factory && !this.queued && !this.requested){
			this.queued = setTimeout(this.request.bind(this), 0);
		}

		return this.ready; // see import()
	},

	exec(){
		const params = Module.params(this.factory);

		this.log.group(this.id);
		
			// call the .factory
			if (params[0] === "require")
				this.exec_common()
			else
				this.exports = this.factory.apply(this, arguments)

		this.log.end();

		return this.exports;
	},

	exec_common(){
		this.exports = {};
		const ret = this.factory.call(this, this.require.bind(this), this.exports, this);
		if (typeof ret !== "undefined")
			this.exports = ret;
	},

	set_id(id){
		if (this.id && this.id !== id)
			throw "do not reset id";

		if (!this.id){
			this.id = id;

			// cache me
			Module.set(this.id, this);
		} else {
			// this.id && this.id === id
			// noop ok
		}
	},

	id_from_src(){
		if (!this.id){
			const a = document.createElement("a");
			a.href = document.currentScript.src;

			this.set({
				id: a.pathname,
				log: true // might need to be adjusted
			})
		}
	},

	set_token(token){
		this.token = token;
		this.set_id(this.resolve(this.token));
	},
	
	set_deps(deps){
		if (this.factory)
			throw "provide deps before factory fn";

		this.deps = deps;
	},

	set_factory(factory){
		if (this.factory)
			throw "don't re-set factory fn";

		this.factory = factory;

		this.deps = this.deps || [];

		// all the magic, right here
		this.ready.resolve(
			Promise.all(this.deps.map(dep => this.import(dep)))
				.then(args => this.exec.apply(this, args))
		);

		// for anonymous modules (no id)
		this.id_from_src();
		
		// 
		if (this.queued)
			clearTimeout(this.queued);
	},

	// set(value) is forwarded here, when value is non-pojo 
	set$(arg){
		if (typeof arg === "string")
			this.set_token(arg);
		else if (toString.call(arg) === '[object Array]')
			this.set_deps(arg);
		else if (typeof arg === "function")
			this.set_factory(arg);
		else if (typeof arg === "object")
			this.assign(arg);
		else if (typeof arg === "undefined"){
			// I think I had an acceptable use case for this, can't remember when it happens
			console.warn("set(undefined)?");
		}
		else
			console.error("whoops");

		return this;
	},


	set_debug(value){
		this.debug = logger(value);
		this.log = logger(value);
	},

	require(token){
		const module = this.get(token);
		if (!module)
			throw "module not preloaded";
		return module.exports;
	},

	request(){
		this.queued = false;
		
		if (this.factory)
			throw "request wasn't dequeued";

		if (!this.requested){
			this.script = document.createElement("script");
			this.src = this.id;
			this.script.src = this.src;
			document.head.appendChild(this.script);
			this.requested = true;
		} else {
			throw "trying to re-request?"
		}
	},

	request2: function(){
		this.queued = false;
		if (!this.defined && !this.requested){
			this.xhr = new XMLHttpRequest();
			this.xhr.addEventListener("load", this.functionize.bind(this));
			this.xhr.open("GET", this.id);
			this.xhr.send();
			this.requested = true;
		} else {
			throw "trying to re-request?";
		}
	},

	requireRegExp: function(){
		return /require\s*\(['"]([^'"]+)['"]\);?/gm;
	},

	functionize: function(data){
		var re = this.requireRegExp();
		this.deps = [];
		this.deps.push(re.exec(this.xhr.responseText)[1]);
		console.log("functionize", this.xhr.responseText);
	},

	render(){
		this.views = this.views || [];
		const view = ModuleView({ module: this });
		this.views.push(view);
		return view;
	}
});

Module.base = "modules";

Module.modules = {};

// returns module or falsey
Module.get = function(id){
	return id && this.modules[id];
		// id can be false, or undefined?
};

Module.set = function(id, module){
	this.modules[id] = module;
};

Module.doc = new Promise((res, rej) => {
	if (/comp|loaded/.test(document.readyState)){
		res();
	} else {
		document.addEventListener("DOMContentLoaded", res);
	}
});

// Module.url = function(token){
// 	var a = document.createElement("a");
// 	a.href = token;
// 	return {
// 		token: token,
// 		url: a.href,
// 		host: a.host,
// 		hostname: a.hostname,
// 		pathname: a.pathname
// 	};
// };

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;

Module.params = function(fn){
	const fnStr = fn.toString().replace(STRIP_COMMENTS, '');
	var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
	if (result === null)
		result = [];
	// console.log(result);
	return result;
};


Module.Base = Base;
Module.mixin = {
	assign: Base.assign,
	events: events,

};