var P = function(){
	var $resolve, $reject;
	var p = new Promise(function(resolve, reject){
		$resolve = resolve;
		$reject = reject;
	});

	p.resolve = $resolve;
	p.reject = $reject;

	return p;
};


var Base = function(){
	if (!(this instanceof Base))
		return new (Base.bind.apply(Base, [null].concat([].slice.call(arguments))));
	return this.instantiate.apply(this, arguments);
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

Base.extend = function(){
	var Ext = function(){
		if (!(this instanceof Ext))
			return new (Ext.bind.apply(Ext, [null].concat([].slice.call(arguments))));
		return this.instantiate.apply(this, arguments);
	};
	Ext.assign = this.assign;
	Ext.assign(this);
	Ext.prototype = Object.create(this.prototype);
	Ext.prototype.constructor = Ext;
	Ext.prototype.assign.apply(Ext.prototype, arguments);

	return Ext;
};

var Module = Base.extend({
	instantiate: function(token){
		var id = typeof token === "string" ?
			Module.resolve(token) : false;

		var cached = id && Module.get(id);

		if (cached){
			cached.args.apply(cached, arguments);
			cached.reinitialize();
			return cached;

		} else {
			this.args.apply(this, arguments);
			this.initialize();
			return this;
		}
	},
	initialize: function(){
		this.ready = P();
		this.exports = {}; // module.exports is from node-land, an empty object

		// cache me
		Module.set(this.id, this);

		// handle incoming arguments
		this.reinitialize();
	},
	reinitialize: function(){
		// have we defined?
		if (!this.defined){
			// no, either define() or queue the request

			// factory function available
			if (this.factory){
				this.define();

			// no factory function to define with
			} else if (!this.queued) {
				// queue up the request
				this.queued = setTimeout(this.request.bind(this), 0);
			}

		// we already defined
		} else {
			// if the previous .factory was overridden, this is trouble
			if (this.factory !== this.defined)
				throw "do not redefine a module with a new .factory fn";
		}

	},
	define: function(){
		// clear the request, if queued
		if (this.queued)
			clearTimeout(this.queued);

		if (this.deps){
			this.ready.resolve(
				Promise.all( this.deps.map((dep) => this.import(dep)) )
					   .then((args) => this.exec.apply(this, args))
			);
		} else {
			this.ready.resolve(this.exec());
		}

		this.defined = this.factory;
	},
	import: function(token){
		var module = new this.constructor(token);
			// checks cache, returns existing or new
			// if new, queues request
			// when <script> arrives, and Module() is defined, it gets the cached module
			// and defines all deps, waits for all deps, then executes its factory, then resolves this .ready promise
		return module.ready;
	},
	exec: function(){
		var params = Module.params(this.factory);
		var ret;

		if (params[0] === "require"){
			ret = this.factory.call(this, this.require.bind(this), this.exports, this);
			if (typeof ret === "undefined")
				this.value = this.exports;
			else 
				this.value = ret;
		} else {
			this.value = this.factory.apply(this, arguments);
		}
		return this.value;
	},
	args: function(){
		var arg;
		for (var i = 0; i < arguments.length; i++){
			arg = arguments[i];
			if (typeof arg === "string")
				this.token = arg;
			else if (toString.call(arg) === '[object Array]')
				this.deps = arg;
			else if (typeof arg === "function")
				this.factory = arg;
			else if (typeof arg === "object")
				this.assign(arg);
			else if (typeof arg === "undefined")
				continue;
			else
				console.error("whoops");
		}

		if (this.token)
			this.id = Module.resolve(this.token);
	},
	require: function(token){
		var module = new this.constructor(token);
		return module.value;
	},
	requestScript: function(){
		this.queued = false;
		if (!this.defined && !this.requested){
			this.script = document.createElement("script");
			this.src = this.id;
			this.script.src = this.src;

			// used in global define() function as document.currentScript.module
			// this enables anonymous modules to be defined/require without the need for an id
				// but, that means you can't concatenate it into a bundle...
			this.script.module = this;

			// this.debug("request", this.id);
			document.head.appendChild(this.script);
			this.requested = true;
		} else {
			throw "trying to re-request?"
		}
	},
	request: function(){
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
	}
});

Module.modules = {};

Module.get = function(id){
	return this.modules[id];
};

Module.set = function(id, module){
	this.modules[id] = module;
};


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

Module.resolve = function(token){
	// mimic ending?
	var parts = token.split("/");

	// "path/thing/" --> "path/thing/thing.js"
	if (token[token.length-1] === "/"){
		token = token + parts[parts.length-2] + ".js";
	// last part doesn't contain a "."
	// "path/thing" --> "path/thing/thing.js"
	} else if (parts[parts.length-1].indexOf(".") < 0){
		token = token + "/" + parts[parts.length-1] + ".js";
	}

	if (token[0] !== "/")
		token = "/modules/" + token;

	return token; 
};

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;

Module.params = function(fn){
	var fnStr = fn.toString().replace(STRIP_COMMENTS, '');
	var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
	if (result === null)
		result = [];
	return result;
};