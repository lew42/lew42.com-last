;(function(){

	var console_methods = ["log", "group", "debug", "trace", 
		"error", "warn", "info", "time", "timeEnd", "dir"];

	var g = function(str, fn){
		this.group(str);
		fn();
		this.end();
	};

	var gc = function(str, fn){
		this.groupc(str);
		fn();
		this.end();
	};

	var make_enabled_logger = function(){
		var enabled_logger = console.log.bind(console);
		enabled_logger.enabled = true;
		enabled_logger.disabled = false;

		console_methods.forEach(function(name){
			enabled_logger[name] = console[name].bind(console);
		});

		enabled_logger.groupc = console.groupCollapsed.bind(console);
		enabled_logger.end = console.groupEnd.bind(console);
		enabled_logger.close = function(closure, ctx){
			if (typeof closure === "function"){
				closure.call(ctx);
			}
			this.end();
		};

		enabled_logger.g = g;
		enabled_logger.gc = gc;

		enabled_logger.isLogger = true;
		
		return enabled_logger;
	};


	var noop = function(){};

	var make_disabled_logger = function(){
		var disabled_logger = function(){};
		disabled_logger.disabled = true;
		disabled_logger.enabled = false;
		console_methods.forEach(function(name){
			disabled_logger[name] = noop;
		});
		disabled_logger.groupc = noop;
		disabled_logger.end = noop;
		disabled_logger.close = function(closure, ctx){
			if (typeof closure === "function"){
				closure.call(ctx);
			}
		};
		disabled_logger.g = g;
		disabled_logger.gc = gc;

		disabled_logger.isLogger = true;
		
		return disabled_logger;
	};

	var enabled_logger = make_enabled_logger();
	var disabled_logger = make_disabled_logger();

	enabled_logger.on = disabled_logger.on = enabled_logger;
	enabled_logger.off = disabled_logger.off = disabled_logger;

	var logger = window.logger = function(value){
		if (typeof value === "function" && value.isLogger){
			return value;
		} else if (value){
			return enabled_logger;
		} else {
			return disabled_logger;
		}
	};

	window.log = logger(true);
	window.debug = logger(false);




	const is = {
		arr: function(value){
			return toString.call(value) === '[object Array]';
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

var P = window.P = function(){
	var $resolve, $reject;
	var p = new Promise(function(resolve, reject){
		$resolve = resolve;
		$reject = reject;
	});

	p.resolve = $resolve;
	p.reject = $reject;

	return p;
};

var set = function(...args){
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

var createConstructor = function(name){
	eval("var " + name + ";");
	var constructor = eval("(" + name + " = function(...constructs){\r\n\
		if (!(this instanceof " + name + "))\r\n\
			return new " + name + "(...constructs);\r\n\
		return this.instantiate(...constructs);\r\n\
	});");
	return constructor;
};

var Base = window.Base = function(...constructs){
	if (!(this instanceof Base))
		return new Base(...constructs);
	return this.instantiate(...constructs);
};

Base.assign = Base.prototype.assign = function(){
	var arg;
	for (var i = 0; i < arguments.length; i++){
		arg = arguments[i];
		for (var prop in arg){
			this[prop] = arg[prop];
		}
	}
	return this;
};

Base.prototype.instantiate = function(){};
Base.prototype.set = set;
Base.prototype.log = logger(false);
Base.prototype.set_log = function(value){
	this.log = logger(value);
};

Base.extend_args = function(first){
	var name, args;
	if (typeof first === "string"){
		name = first;
		args = [].slice.call(arguments, 1);
	} else if (first && first.name){
		name = first.name;
		delete first.name;
		args = arguments;
	} // otherwise, leave name undefined, for now

	return {
		name: name,
		args: args
	};
};

Base.createConstructor = createConstructor;
Base.extend = function(...args){
	const params = this.extend_args(...args);
	const Ext = this.createConstructor(params.name || this.name + "Ext");
	Ext.assign = this.assign;
	Ext.assign(this);
	Ext.prototype = Object.create(this.prototype);
	Ext.prototype.constructor = Ext;
	Ext.prototype.set.apply(Ext.prototype, params.args); // strips the name out

	return Ext;
};

const View = window.View = Base.extend({
	name: "View",
	tag: "div",
	instantiate(...args){
		this.set(...args);
		this.initialize();
	},
	initialize: function(){
		this.append(this.render);
		this.init();
	},
	init: function(){},
	render: function(){},
	render_el: function(){
		if (!this.el){
			this.el = document.createElement(this.tag);

			View.captor && View.captor.append(this);

			// if (this.name)
			// 	this.addClass(this.name);

			// if (this.type)
			// 	this.addClass(this.type);

			this.classes && this.addClass(this.classes);
		}
	},
	set$(arg){
		if (is.pojo(arg)){
			this.assign(arg);
		} else {
			this.append(arg);
		}
	},
	set(...args){
		this.render_el(); // in case it hasn't been
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
	append: function(){
		var arg;

		if (!this.el) this.render_el();

		for (var i = 0; i < arguments.length; i++){
			arg = arguments[i];
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
	append_fn: function(fn){
		View.set_captor(this);
		var value = fn.call(this, this);
		View.restore_captor();

		if (is.def(value))
			this.append(value);
	},
	append_pojo: function(pojo){
		if (pojo.path){
			this.append_path(pojo);
		} else {
			for (var prop in pojo){
				this.append_prop(prop, pojo[prop]);
			}
		}
	},
	append_obj: function(obj){
		if (obj.render){
			this.append(obj.render())
		} else {
			console.warn("not sure here");
		}
	},
	append_prop: function(prop, value){
		var view;
		if (value && value.el){
			view = value;
		} else {
			view = View().append(value);
		}

		this[prop] = view
			.addClass(prop)
			.appendTo(this);

		return this;
	},
	append_path: function(path){
		if (is.obj(path) && path.path){
			if (path.target){
				this.path(path.target).append(this.path(path.path));
			} else {
				this.append(this.path(path.path));
			}
		}

		return this;
	},
	path: function(path){
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
	appendTo: function(view){
		if (is.dom(view)){
			view.appendChild(this.el);
		} else {
			view.append(this);
		}
		return this;
	},
	addClass: function(){
		var arg;
		for (var i = 0; i < arguments.length; i++){
			arg = arguments[i];
			if (is.arr(arg))
				this.addClass.apply(this, arg);
			else if (arg.indexOf(" ") > -1)
				this.addClass.apply(this, arg.split(" "));
			else
				this.el.classList.add(arg);
		}
		return this;
	},
	removeClass: function(className){
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
	hasClass: function(className){
		return this.el.classList.contains(className);
	},
	attr: function(name, value){
		this.el.setAttribute(name, value);
		return this;
	},
	click: function(cb){
		this.el.addEventListener("click", cb.bind(this));
		return this;
	},
	on: function(event, cb){
		var bound = cb.bind(this);
		this.el.addEventListener(event, bound);
		return bound; // so you can remove it
	},
	off: function(event, cb){
		this.el.removeEventListener(event, cb);
		return this; //?
	},
	empty: function(){
		this.el.innerHTML = "";
		return this;
	},
	focus: function(){
		this.el.focus();
		return this;
	},
	show: function(){
		this.el.style.display = "";
		return this;
	},
	styles: function(){
		return getComputedStyle(this.el);
	},
	// inline styles
	style: function(prop, value){
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
	toggle: function(){
		if (this.styles().display === "none")
			return this.show();
		else {
			return this.hide();
		}
	},
	index: function(){
		var index = 0, prev;
		// while (prev = this.el.previousElementSibling)
	},
	hide: function(){
		this.el.style.display = "none";
		return this;
	},
	remove: function(){
		this.el.parentNode && this.el.parentNode.removeChild(this.el);
		return this;
	},
	editable(remove){
		remove = (remove === false);
		const hasAttr = this.el.hasAttribute("contenteditable");

		if (remove && hasAttr){
			console.warn(this.el, "remove ce");
			this.el.removeAttribute("contenteditable");
		} else if (!remove && !hasAttr) {
			console.warn(this.el, "add ce");
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
	}
});

const debug = false;

var Module = window.Module = Base.extend({
	name: "Module",
	base: "modules",
	debug: logger(debug),
	log: logger(false || debug),

	instantiate(...args){
		return (this.get(args[0]) || this.initialize()).set(...args);
	},

	get: function(token){
		return is.str(token) && Module.get(this.resolve(token));
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

	reinitialize: function(){
		// have we defined?
		if (!this.defined){
			// no, either define() or queue the request

			// factory function available
			if (this.factory){
				this.define();

			// no factory function to define with
			} else if (!this.queued && !this.requested) {
				// queue up the request
				this.queued = setTimeout(this.request.bind(this), 0);
				this.debug("Queued Module('"+this.id+"')");
			}

		// we already defined
		} else {
			// if the previous .factory was overridden, this is trouble
			if (this.factory !== this.defined)
				throw "do not redefine a module with a new .factory fn";
		}

	},
	import(token){
		// should this.resolve(token)
		// but resolve isn't relative right now anyway (todo)
		return (new this.constructor(token)).register(this);
	},

	q(){
		// set_id, but no factory (after 1 tick?)
		// or, auto clear queued request, even if sync?
		if (!this.factory && !this.queued && !this.requested){
			this.queued = setTimeout(this.request.bind(this), 0);
		}
	},

	register(dependent){
		this.dependents.push(dependent);

		this.q();

		return this.ready;
	},

	exec(){
		var params = Module.params(this.factory);
		var ret;

		this.exports = {};
		this.log.group(this.id);
		
		if (params[0] === "require"){
			ret = this.factory.call(this, this.require.bind(this), this.exports, this);
			if (typeof ret === "undefined")
				this.value = this.exports;
			else 
				this.value = ret;
		} else {
			this.value = this.factory.apply(this, arguments);
		}

		this.log.end();

		return this.value;
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
		return module.value;
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
	this.view.append(module.render());

};

Module.doc = new Promise((res, rej) => {
	if (/comp|loaded/.test(document.readyState)){
		res();
	} else {
		document.addEventListener("DOMContentLoaded", res);
	}
});

Module.view = View("MODULES");

Module.doc.then(function(){
	document.body.appendChild(Module.view.el);
});


const ModuleView = View.extend({
	name: "ModuleView",
	render(){
		const module = this.module;
		this.append({
			label: this.module.id,
			dependencies: View({
				render(){
					for (const dep of module.dependencies)
						dep.render();
				}
			})
		});
		console.log(this.module);
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

})();