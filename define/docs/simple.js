define = function(...args){
	return new define.Module(...args);
};

// move this to Module.path
define.path = "modules";

define.P = function(){
	var resolve, reject;
	
	const p = new Promise(function(res, rej){
		resolve = res;
		reject = rej;
	});

	p.resolve = resolve;
	p.reject = reject;

	return p;
};

define.doc = new Promise((res, rej) => {
	if (/comp|loaded/.test(document.readyState))
		res();
	else
		document.addEventListener("DOMContentLoaded", res);
});

document.then = function(...args){
	define.doc.then(...args);
};

define.new = function(){
	const new_define = function(...args){
		return new new_define.Module(...args);
	};
	new_define.path = define.path;
	new_define.P = define.P;
	new_define.doc = define.doc;
	new_define.new = define.new;
	new_define.logger = define.logger;
	new_define.Base = class Base extends define.Base {};
	new_define.Module = class Module extends define.Module {};
	new_define.Module.modules = {};
	return new_define;
};

define.table = function(){
	console.table(this.Module.modules);
};
// end

define.logger = (function(){
	const logger = function(value){
		if (typeof value === "undefined"){
			return logger.auto;
		} else if (typeof value === "function" && value.logger){
			return value;
		} else if (value){
			return logger.active;
		} else {
			return logger.inactive;
		}
	};


	const noop = function(){};

	// 3 modes
	const active = logger.active = console.log.bind(console);
	const auto = logger.auto = function(){};
	const inactive = logger.inactive = function(){};
	
	const console_methods = ["log", "group", "groupCollapsed", "groupEnd", "debug", "trace", "error", "warn", "info", "time", "timeEnd", "dir"];
	
	for (const method of console_methods){
		active[method] = console[method].bind(console);
		auto[method] = console[method].bind(console);
		inactive[method] = noop;
	}

	
	// log.if() is the magic behind the "auto" mode

	// always on
	active.if = function(cond, ...args){
		if (args.length)
			active(...args);
		return active;
	};

	// maybe on
	auto.if = function(cond, ...args){
		if (cond){
			if (args.length)
				active(...args);
			return active;
		} else {
			return inactive;
		}
	};

	// always off
	inactive.if = function(cond, ...args){
		return inactive;
	}

	// some references
	active.logger = auto.logger = inactive.logger = logger;
	active.active = auto.active = inactive.active = active;
	active.auto = auto.auto = inactive.auto = auto;
	active.inactive = auto.inactive = inactive.inactive = inactive;

	// use if (this.log === this.log.auto) to check logger mode
	
	// alias these long methods
	active.groupc = console.groupCollapsed.bind(console);
	auto.groupc = noop;
	inactive.groupc = noop;

	active.end = console.groupEnd.bind(console);
	auto.end = noop;
	inactive.end = noop;

	return logger;
})();

define.Base = class Base {

	constructor(){
		this.events = {};
		this.log = define.logger();
	}

	// get log(){
	// 	return this._log || define.logger();	
	// }

	// set log(value){
	// 	this._log = define.logger(value);
	// }

	set_log(value){
		this.log = define.logger(value);
	}

	on(event, cb){
		var cbs = this.events[event];
		if (!cbs)
			cbs = this.events[event] = [];
		cbs.push(cb);
		return this;
	}

	emit(event, ...args){
		const cbs = this.events[event];
		if (cbs && cbs.length)
			for (const cb of cbs)
				cb.apply(this, args);
		return this;
	}

	off(event, cbForRemoval){
		const cbs = this.events[event];
		if (cbs)
			for (var i = 0; i < cbs.length; i++)
				if (cbs[i] === cbForRemoval)
					cbs.splice(i, 1);
		return this;
	}
	
	assign(...args){
		for (arg of args)
			for (const prop in arg)
				this[prop] = arg[prop];
		return this;
	}

	set(...args){
		if (this._set)
			this._set(...args); // pre .set() hook

		for (const arg of args){
			// pojo arg
			if (arg && arg.constructor === Object){

				// iterate over arg props
				for (var j in arg){

					// set_*
					if (this["set_" + j]){
						this["set_" + j](arg[j]);
						// create a .set_assign() method that simply calls assign with the arg...

					// "assign" prop will just call assign
					} else if (j === "assign") {
						this.assign(arg[j]);

					} else if (this[j] && this[j].set){
						this[j].set(arg[j]);

					// existing prop is a pojo - "extend" it
					} else if (this[j] && this[j].constructor === Object){

						// make sure its safe
						if (this.hasOwnProperty(j))
							set.call(this[j], arg[j]);

						// if not, protect the prototype
						else {
							this[j] = set.call(Object.create(this[j]), arg[j]);
						}

					// everything else, assign
					} else {
						// basically just arrays and fns...
						// console.warn("what are you", arg[j]);
						this[j] = arg[j];
					}
				}

			// non-pojo arg
			} else if (this.set$){
				// auto apply if arg is array?
				this.set$(arg);

			// oops
			} else {
				console.warn("not sure what to do with", arg);
			}
		}

		if (this.set_)
			this.set_(...args); // post .set() hook

		return this; // important
	}

	static get events(){
		return this._events || (this._events = {});
	}

	static set events(oops){
		throw "don't";
	}

	static on(event, cb){
		var cbs = this.events[event];
		if (!cbs)
			cbs = this.events[event] = [];
		cbs.push(cb);
		return this;
	}

	static emit(event, ...args){
		const cbs = this.events[event];
		if (cbs && cbs.length)
			for (const cb of cbs)
				cb.apply(this, args);
		return this;
	}

	static off(event, cbForRemoval){
		const cbs = this.events[event];
		if (cbs)
			for (var i = 0; i < cbs.length; i++)
				if (cbs[i] === cbForRemoval)
					cbs.splice(i, 1);
		return this;
	}
};

define.Module = class Module extends define.Base {

	constructor(...args){
		super();
		this.constructor.emit("construct", this, args);
		// const module = this.get(args[0]) || this.initialize();
		// module.set(...args);
		// return module;
		return (this.get(args[0]) || this.initialize()).set(...args);
	}

	get(token){
		return typeof token === "string" && this.constructor.get(this.resolve(token));
	}

	switch(){
		return false; // allow conditional check and return alternate class
	}

	initialize(...args){
		this.ready = this.constructor.P();
		this.dependencies = [];
		this.dependents = [];

		return this; // see constructor()
	}

	exec(){
		this.exports = {};

		this.emit("pre-exec");

		// log if no dependents
		const log = this.log.if(!this.dependents.length);
		
		log.group(this.id);
		const ret = this.factory.call(this.ctx || this, this.require.bind(this), this.exports, this);
		log.end();

		if (typeof ret !== "undefined")
			this.exports = ret;

		this.emit("executed");

		return this.exports;
	}

	// `this.token` is transformed into `this.id`
	// todo: pass { id: "..." } to if already resolved...
	resolve(token){ 
		var id, 
			parts;

		// mimic the base path
		if (token === "."){
			throw "does this even happen?";
			if (!this.url)
				throw "don't define with relative tokens";

			parts = this.url.path.split("/");
			id = this.url.path + parts[parts.length-2] + ".js";
		} else {
			parts = token.split("/");

			// token ends with "/", ex: "path/thing/"
			if (token[token.length-1] === "/"){
				// repeat last part, ex: "path/thing/thing.js"
				id = token + parts[parts.length-2] + ".js";

			// last part doesn't contain a ".", ex: "path/thing"
			} else if (parts[parts.length-1].indexOf(".") < 0){
				// repeat last part, add ".js", ex: "path/thing/thing.js"
				id = token + "/" + parts[parts.length-1] + ".js";
			} else {
				id = token;
			}

			if (id.indexOf("./") === 0){
				if (!this.url)
					throw "don't define with relative tokens";
				id = this.url.path + id.replace("./", "");
				// token = token.replace("./", ""); // nope - need to parse id->host/path
			} else if (id[0] !== "/"){
				id = "/" + this.constructor.path + "/" + id;
			}
		}

		this.emit("resolved", token, id);
		// this.log(this.id, ".resolve(", token, ") =>", id);
		return id;
	}


	require(token){
		const module = this.get(token);
		if (!module){
			debugger;
			throw "module not preloaded";
		}
		return module.exports;
	}

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
			this.emit("requested");
		} else {
			throw "trying to re-request?"
		}
	}

	set_id(id){
		if (this.id && this.id !== id)
			throw "do not reset id";

		if (!this.id){
			this.id = id;
			this.url = this.constructor.url(this.id);

			// cache me
			this.constructor.set(this.id, this);

			this.emit("id", id);
		} else {
			// this.id && this.id === id
			// noop is ok
		}
	}


	set_token(token){
		this.token = token;
		this.set_id(this.resolve(this.token));
	}
	
	set_deps(deps){
		if (this.factory)
			throw "provide deps before factory fn";

		this.deps = deps;
	}

	import(token){
		// use this.constructor.get(); // `new` doesn't make much sense?
			// buuut, it needs to either get it from the cache, OR initialize a blank module
		const module = new this.constructor(this.resolve(token));
		module.register(this);

		this.dependencies.push(module);
		this.emit("dependency", module);
		
		return module.ready;
	}

	register(dependent){
		this.dependents.push(dependent);
		this.emit("dependent", dependent);

		if (!this.factory && !this.queued && !this.requested)
			this.queued = setTimeout(this.request.bind(this), 0);
	}

	set_factory(factory){
		if (this.factory)
			throw "don't re-set factory fn";

		this.factory = factory;

		this.deps = this.deps || [];

		// for anonymous modules (no id)
		this.id_from_src();

		// all the magic, right here
		this.ready.resolve(
			Promise.all(this.deps.map(dep => this.import(dep)))
				.then(args => this.exec.apply(this, args))
		);


		if (this.queued)
			clearTimeout(this.queued);

		this.emit("defined");
	}

	id_from_src(){
		if (!this.id){
			const a = document.createElement("a");
			a.href = document.currentScript.src;

			this.set({
				id: a.pathname,
				log: true // might need to be adjusted
			})
		}
	}

	// set(value) is forwarded here, when value is non-pojo 
	set$(arg){
		// if (this.constructor.name === "JSONModule")
		// 	debugger;
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
	}

	static P(){
		var resolve, reject;
		
		const p = new Promise(function(res, rej){
			resolve = res;
			reject = rej;
		});

		p.resolve = resolve;
		p.reject = reject;

		return p;
	}

	static get(id){
		if (!this.hasOwnProperty("modules"))
			this.modules = {};
		return this.modules[id];
	}

	static set(id, module){
		if (!this.hasOwnProperty("modules"))
			this.modules = {};
		if (this.modules[id])
			throw "don't redefine a module";
		this.modules[id] = module;
		this.emit("new", module, id);
	}

	static url(original){
		const a = document.createElement("a");
		a.href = original;
		return {
			original: original,
			url: a.href,
			host: a.host,
			hostname: a.hostname,
			pathname: a.pathname,
			path: a.pathname.substr(0, a.pathname.lastIndexOf('/') + 1)
		};
	}
}

define.Module.path = define.path || "modules";

window.dispatchEvent(new Event("define.debug"));

// end

// ;(function(){

// if (define.debug){
// 	debugger;
// 	await define.debugger();
// }

define("logger", () => define.logger);

// })();
define("Base/Base0", function(require, exports, module){

function make_constructor(){
	return function Constructor(...constructs){
		if (!(this instanceof Constructor))
			return new Constructor(...constructs);
		return this.instantiate(...constructs);
	}
}

const Basic = module.exports = make_constructor();

Basic.assign = Basic.prototype.assign = function(...args){
	for (arg of args)
		for (const prop in arg)
			this[prop] = arg[prop];
	return this;
};

Basic.prototype.assign({
	instantiate(){}
});

Basic.assign({
	make_constructor: make_constructor,
	extend(...args){
		const Ext = this.make_constructor(name);
		Ext.assign = this.assign;
		Ext.assign(this);
		Ext.events = {};
		Ext.prototype = Object.create(this.prototype);
		Ext.prototype.constructor = Ext;
		Ext.prototype.assign(...args);
		return Ext;
	}
});

}); // end

define("mixin/events.js", function(require, exports, module){

const events = module.exports = {
	on(event, cb){
		var cbs = this.events[event];
		if (!cbs)
			cbs = this.events[event] = [];
		cbs.push(cb);
		return this;
	},
	emit(event, ...args){
		const cbs = this.events[event];
		if (cbs && cbs.length)
			for (const cb of cbs)
				cb.apply(this, args);
		return this;
	},
	off: function(event, cbForRemoval){
		const cbs = this.events[event];
		if (cbs)
			for (var i = 0; i < cbs.length; i++)
				if (cbs[i] === cbForRemoval)
					cbs.splice(i, 1);
		return this;
	}
};

}); // end

define("mixin/set.js", function(require, exports, module){

const set = module.exports = function(...args){
	if (this._set)
		this._set(...args); // pre .set() hook

	for (const arg of args){
		// pojo arg
		if (arg && arg.constructor === Object){

			// iterate over arg props
			for (var j in arg){

				// set_*
				if (this["set_" + j]){
					this["set_" + j](arg[j]);
					// create a .set_assign() method that simply calls assign with the arg...

				// "assign" prop will just call assign
				} else if (j === "assign") {
					this.assign(arg[j]);

				} else if (this[j] && this[j].set){
					this[j].set(arg[j]);

				// existing prop is a pojo - "extend" it
				} else if (this[j] && this[j].constructor === Object){

					// make sure its safe
					if (this.hasOwnProperty(j))
						set.call(this[j], arg[j]);

					// if not, protect the prototype
					else {
						this[j] = set.call(Object.create(this[j]), arg[j]);
					}

				// everything else, assign
				} else {
					// basically just arrays and fns...
					// console.warn("what are you", arg[j]);
					this[j] = arg[j];
				}
			}

		// non-pojo arg
		} else if (this.set$){
			// auto apply if arg is array?
			this.set$(arg);

		// oops
		} else {
			console.warn("not sure what to do with", arg);
		}
	}

	if (this.set_)
		this.set_(...args); // post .set() hook

	return this; // important
};

}); // end

define("Base", 
	["./Base0", "mixin/set.js", "mixin/events.js", "logger"], 
	function(require, exports, module){
////////

const logger = require("logger");
const Base0 = require("./Base0");
const set = require("mixin/set.js");
const events = require("mixin/events.js");

const Base = module.exports = function(...constructs){
	if (!(this instanceof Base))
		return new Base(...constructs);
	this.events = {};
	return this.instantiate(...constructs);
};

Base.assign = Base.prototype.assign = Base0.assign;

Base.prototype.assign(events, {
	instantiate(){},
	set: set,
	log: logger(),
	set_log(value){
		this.log = logger(value);
	}
});

Base.assign(events, {
	events: {},
	extend(...args){
		const name = typeof args[0] === "string" ? args.shift() : this.name + "Ext";
		const Ext = this.extend_base(name);
		Ext.assign = this.assign;
		Ext.assign(this);
		Ext.events = {};
		Ext.prototype = Object.create(this.prototype);
		Ext.prototype.constructor = Ext;
		Ext.prototype.set(...args);
		this.emit("extended", Ext);
		return Ext;
	},
	extend_base(name){
		eval("var " + name + ";");
		var constructor = eval("(" + name + " = function(...constructs){\r\n\
			if (!(this instanceof " + name + "))\r\n\
				return new " + name + "(...constructs);\r\n\
			this.events = {};\r\n\
			return this.instantiate(...constructs);\r\n\
		});");
		return constructor;
	}
});

}); // end

define("is", function(require, exports, module){

const is = module.exports = {
	arr: function(value){
		return toString.call(value) === '[object Array]';
		// or return Array.isArray()?
	},
	obj: function(value){
		return typeof value === "object" && !is.arr(value);
	},
	dom: function(value){
		return value && value.nodeType > 0;
	},
	el: function(value){
		return value && value.nodeType === 1;
	},
	str: function(value){
		return typeof value === "string";
	},
	num: function(value){
		return typeof value === "number";
	},
	bool: function(value){
		return typeof value === 'boolean';
	},
	fn: function(value){
		return typeof value === 'function';
	},
	def: function(value){
		return typeof value !== 'undefined';
	},
	undef: function(value){
		return typeof value === 'undefined';
	},
	/// seems to work
	pojo: function(value){
		return is.obj(value) && value.constructor === Object;
	},
	proto: function(value){
		return is.obj(value) && value.constructor && value.constructor.prototype === value;
	}
};

});
define("mixin", ["./events.js", "./set.js"], function(require, exports){
	exports.events = require("./events.js");
	exports.set = require("./set.js");
});
define("Module/local", function(require, exports, module){
////////

module.exports = function(id, base){
	base.localID = this.id + "::" + id;
	var data = localStorage.getItem(base.localID);
	if (data){
		console.log("loaded", data);
		data = JSON.parse(data);
		console.log("parsed", data);
		// base.load(data);
		base.set(data);
	} else {
		base.save();
	}

	// base.save(id);
	return base;
};

// exports.save = function(obj){
// 	if (!obj.localID || !obj.json){
// 		throw "oops";
// 	}

// 	localStorage.setItem(obj.localID, obj.json());
// };

}); // end 

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
// Module.modules = define.Module.modules || {};
Module.set = define.Module.set;
Module.url = define.Module.url;
Module.path = "modules";

}); // end

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
define("View", 
	["Base", "is"],
	function(require, exports, module){

const is = require("is");
const Base = require("Base");

/*
todo:  allow .set_classes to accept an object
View({
	classes: {
		promise_like: thing.then(...) // use first arg as boolean to add/remove "promise_like" class
		event_like: thing.on("whatever") // could return a "thenable"
	}
});

You could automatically classify any thenable property..
View(thing.on("active"))
	--> view.thing = the event
		or view.active...
	--> as a thenable, we classify the "thing" class...
*/

const View = module.exports = Base.extend({
	name: "View",
	tag: "div",
	instantiate(...args){
		this.render_el(args[0] && args[0].tag);
		this.set(...args);
		this.append(this.render);
		this.initialize();
	},
	initialize: function(){
		this.init();
	},
	init: function(){},
	render: function(){},
	render_el: function(tag){
		if (!this.hasOwnProperty("el")){
			this.el = document.createElement(tag || this.tag);

			View.captor && View.captor.append(this);

			this.classes && this.addClass(this.classes);
		}
	},
	// set_tag(tag){
	// 	if (tag !== this.tag){
	// 		this.tag = tag;
	// 		delete this.el;
	// 		this.render_el();
	// 	}
	// },
	set$(arg){
		if (is.pojo(arg)){
			console.error("do you even happen?");
			this.assign(arg);
		} else {
			this.append(arg);
		}
	},
	set(...args){
		var hasBeenEmptied = false;
		for (const arg of args){
			// empty once if .set() will .append()
			if (!is.pojo(arg) && !hasBeenEmptied){
				this.empty();
				hasBeenEmptied = true;
			}

			// the default .set() that we've overridden
			Base.prototype.set.call(this, arg);
		}
		return this;
	},
	append(...args){
		for (const arg of args){
			if (arg && arg.el){
				arg.parent = this;
				this.el.appendChild(arg.el);
			} else if (is.pojo(arg)){
				this.append_pojo(arg);
			} else if (is.obj(arg)){
				this.append_obj(arg);
			} else if (is.arr(arg)){
				this.append.apply(this, arg);
			} else if (is.fn(arg)){
				this.append_fn(arg);
			} else {
				// DOM, str, undefined, null, etc
				this.el.append(arg);
			}
		}
		return this;
	},

	append_fn(fn){
		View.set_captor(this);
		var value = fn.call(this, this);
		View.restore_captor();

		if (is.def(value))
			this.append(value);
	},

	append_pojo(pojo){
		if (pojo.path){
			this.append_path(pojo);
		} else {
			for (var prop in pojo){
				this.append_prop(prop, pojo[prop]);
			}
		}
	},

	append_obj(obj){
		if (obj.render){
			this.append(obj.render())
		} else {
			console.warn("not sure here");
		}
	},

	append_prop(prop, value){
		var view;
		if (value && value.el){
			view = value;
		} else {
			view = (new View({tag: this.tag})).append(value);
		}

		this[prop] = view
			.addClass(prop)
			.appendTo(this);

		if (this.parent && !this.parent[prop]){
			console.warn("over promotion probably not good");
			this.parent[prop] = view;
		}

		return this;
	},

	append_path(path){
		console.warn("experimental...");
		if (is.obj(path) && path.path){
			if (path.target){
				this.path(path.target).append(this.path(path.path));
			} else {
				this.append(this.path(path.path));
			}
		}

		return this;
	},

	path(path){
		var parts, value = this;
		if (is.str(path)){
			parts = path.split(".");
		} else if (is.arr(path)) {
			parts = path;
		}

		if (parts[0] === ""){
			parts = parts.slice(1);
		}

		if (parts[parts.length - 1] === ""){
			console.warn("forgot how to do this");
		}

		for (var i = 0; i < parts.length; i++){
			value = value[parts[i]];
		}

		return value;
	},

	appendTo(view){
		if (is.dom(view)){
			view.appendChild(this.el);
		} else {
			view.append(this);
		}
		return this;
	},

	addClass(...args){
		for (const arg of args){
			if (is.arr(arg))
				this.addClass.apply(this, arg);
			else if (arg && arg.indexOf(" ") > -1)
				this.addClass.apply(this, arg.split(" "));
			else
				this.el.classList.add(arg);
		}
		return this;
	},

	removeClass(className){
		var arg;
		for (var i = 0; i < arguments.length; i++){
			arg = arguments[i];
			if (is.arr(arg))
				this.removeClass.apply(this, arg);
			else if (arg.indexOf(" ") > -1)
				this.removeClass.apply(this, arg.split(" "));
			else
				this.el.classList.remove(arg);
		}
		return this;
	},

	hasClass(className){
		return this.el.classList.contains(className);
	},

	attr(name, value){
		this.el.setAttribute(name, value);
		return this;
	},

	click(cb){
		this.el.addEventListener("click", cb.bind(this));
		return this;
	},

	set_click(cb){
		this.click(cb);
	},

	on(event, cb){
		var bound = cb.bind(this);
		this.el.addEventListener(event, bound);
		return bound; // so you can remove it
	},

	off(event, cb){
		this.el.removeEventListener(event, cb);
		return this; //?
	},

	empty(){
		this.el.innerHTML = "";
		return this;
	},

	focus(){
		this.el.focus();
		return this;
	},

	show(){
		this.el.style.display = "";
		return this;
	},

	styles(){
		return getComputedStyle(this.el);
	},

	// inline styles
	style(prop, value){
		// set with object
		if (is.obj(prop)){
			for (var p in prop){
				this.style(p, prop[p]);
			}
			return this;

		// set with "prop", "value"
		} else if (prop && is.def(value)) {
			this.el.style[prop] = value;
			return this;

		// get with "prop"
		} else if (prop) {
			return this.el.style[prop];

		// get all
		} else if (!arguments.length){
			return this.el.style;
		} else {
			throw "whaaaat";
		}
	},

	toggle(){
		if (this.styles().display === "none")
			return this.show();
		else {
			return this.hide();
		}
	},

	index(){
		var index = 0, prev;
		// while (prev = this.el.previousElementSibling)
	},

	hide(){
		this.el.style.display = "none";
		return this;
	},

	remove(){
		this.el.parentNode && this.el.parentNode.removeChild(this.el);
		return this;
	},

	editable(remove){
		remove = (remove === false);
		const hasAttr = this.el.hasAttribute("contenteditable");

		if (remove && hasAttr){
			// console.warn(this.el, "remove ce");
			this.el.removeAttribute("contenteditable");
		} else if (!remove && !hasAttr) {
			// console.warn(this.el, "add ce");
			this.attr("contenteditable", true)
		}
		return this;
	},

	value(){
		// get&set?
		return this.el.innerHTML;
	}
});

View.assign({
	previous_captors: [],
	set_captor: function(view){
		this.previous_captors.push(this.captor);
		this.captor = view;
	},
	restore_captor: function(){
		this.captor = this.previous_captors.pop();
	},
	span(...args){
		return new View({tag: "span"}, ...args);
	}
});

View.V = View.extend("V", {
	instantiate(...args){
		this.smart_tag(args);
		this.render_el();
		this.append(...args);
		this.initialize();
	},
	smart_tag(args){
		const token = args[0];
		if (is.str(token) && token.indexOf(" ") === -1){
			if (token.indexOf("span") === 0){
				this.tag = "span";
				this.smart_classes(token);
				args.shift();
			} else if (token.indexOf(".") === 0){
				this.smart_classes(token);
				args.shift();
			}
		}
	},
	smart_classes(token){
		this.classes = token.split(".").slice(1);
	}
});

View.Span = View.extend("Span", {
	tag: "span"
});

}); // end

define("Test", ["Base", "View"], function(require){

	var Base = require("Base");
	var View = require("View");
	
	// var stylesheet = View({tag: "link"})
	// 	.attr("rel", "stylesheet")
	// 	.attr("href", "/simple/modules/Test/Test.css");
	// document.head.appendChild(stylesheet.el);

	var body = View({
		el: document.body
	});

	var Test = Base.extend({
		instantiate: function(name, fn){
			this.name = name;
			this.fn = fn;

			this.pass = 0;
			this.fail = 0;

			this.container = this.container || body;

			this.initialize();
		},
		initialize: function(){
			if (this.shouldRun())
				this.render();
		},
		render: function(){
			this.view = View().addClass('test').append({
				bar: View(this.label()).click(this.activate.bind(this)),
				content: View(),
				footer: View()
			});

			this.view.content.append(this.exec.bind(this));

			this.view.addClass("active");

			if (this.pass > 0)
				this.view.footer.append("Passed " + this.pass);
			if (this.fail > 0)
				this.view.footer.append("Failed " + this.fail);

			if (!this.view.parent)
				this.view.appendTo(this.container);
		},
		activate: function(){
			window.location.hash = this.name;
			window.location.reload();
		},
		label: function(){
			return (this.match() ? "#" : "") + this.name;
		},
		exec: function(){
			console.group(this.label());
			
			Test.set_captor(this);

				// run the test
				this.fn();

			Test.restore_captor();
			console.groupEnd();
		},
		assert: function(value){
			if (value){
				this.pass++;
			} else {
				console.error("Assertion failed");
				this.fail++;
			}
		},
		shouldRun: function(){
			return !window.location.hash || this.match();
		},
		match: function(){
			return window.location.hash.substring(1) === this.name;
		}
	});

	Test.assign({
		previous_captors: [],
		set_captor: function(view){
			this.previous_captors.push(this.captor);
			this.captor = view;
		},
		restore_captor: function(){
			this.captor = this.previous_captors.pop();
		},
		assert: function(value){
			if (Test.captor)
				Test.captor.assert(value);
			else
				console.error("whoops");
		},
		controls: function(){
			var controls = View().addClass("test-controls").append({
				reset: View({tag:"button"}, "reset").click(function(){
					Test.reset();
				})
			});
			document.body.appendChild(controls.el);
		},
		reset: function(){
			window.location.href = window.location.href.split('#')[0];
		}
	});

	window.addEventListener("hashchange", function(){
		window.location.reload();
	});
	console.warn("auto refresh on window.hashchange event?");

	return Test;
});
define("server", ["logger"], function(require, exports, module){
	const logger = require("logger");
	const log = logger(true);

	const server = module.exports = new WebSocket("ws://" + window.location.host);

	server.addEventListener("open", function(){
		log("server connected");
		server.send("connection!");
	});

	server.addEventListener("message", function(e){
		if (e.data === "reload"){
			window.location.reload();
		} else {
			log(e.data);
		}
	});

	server.obj = function(obj){
		server.send(JSON.stringify(obj));
	};

	server.mod = function(id){
		server.obj({
			action: "module.load",
			data: {
				module: id
			}
		});
	};
})
define("simple", 
	{ log: false },
	["Base", "logger", "is", "Module", "mixin", "View", "Test", "server"], 
	function(require, exports, module){
////////

window.Base = require("Base");
window.logger = require("logger");
window.is = require("is");
window.Module = require("Module");
window.mixin = require("mixin");
window.View = require("View");
window.Test = require("Test");
window.server = require("server");

module.exports = "so simple";

}); // end

simple = define;