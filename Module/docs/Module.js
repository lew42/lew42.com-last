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

Module.get = function(token){
	var id = typeof token === "object" ?
		token : this.resolve(token);
};

/*
Turn a string into an identification object with {
	host: "lew42.com",
	path: "one/two",
	name: "thing",
	ext: "js"
}

"thing" --> {
	host: window.location.host,
	path: Module.modulesPath + "/thing",
	name: "thing",
	ext: "js"
}

*/
Module.resolve = function(token){
	var id = {};

}

var Module = Base.extend({
	instantiate: function(token){
		// check the cache
		var cached = Module.get(token);

		// if found, use the cached module
		if (cached){
			cached.initialize.apply(cached, arguments);
			return cached;

		} else {
			this.initialize.apply(this, arguments);
		}
	},
	// this can be called multiple times (every time Module() is called for a given id)
	initialize: function(){
		// parse arguments into args object
		var args = Module.args(arguments);

		if (!this.ready){
			this.ready = P(); // needed before we even define
		}

		// if module is undefined
			// all new modules, 
			// and cached modules that haven't been defined
		if (!this.factory){

			// and we have an incoming factory fn
			if (args.factory){
				this.assign(args);
				this.define();

			// if it hasn't been queued
			} else if (!this.queued) {
				// q up `this.request`
				this.queued = setTimeout(0, this.request.bind(this));
			}
		}
	},
	get: function(id){
		return this.modules[id] || (this.parent && this.parent.get(id));
	},
	define: function(){
		// clear the request, if queued
		if (this.queued)
			clearTimeout(this.queued);

		// this.executed ? needs a better name...
		// this.defined isn't a good name either, even though the boolean works
		// because you need 2 sides:
		// if (this.defined) or if (this.executed)
		// and this.defined.then() and this.executed.then()
		// both need to make sense?

		// both can't make sense - because promises are created before they're finished...

		if (this.deps){
			this._deps = Promise.all(this.deps.map((dep)=>this.require(dep)));
		}

		this.ready = Promise.all(this.deps.map((dep) => this.import(dep)))
			.then((args) => this.exec.apply(this, args));
	},
	resolve2: function(token){
		// token can be
			// a name ("thing")
			// a url ("//lew42.com/modules/thing")
			// a relative path ("./thing")
			// an absolute path ("/thing")
		// id.host, id.path, id.name, id.ext
		
	},
	get2: function(token){
		var id = (typeof token === "object") ? 
			token : this.resolve(token);

		var module = this.modules[id.name];

		if (!module)
			module = this.parent && this.parent.get(id);

		if (!module)
			module = new this.constructor(id);
	},
	import2: function(token){
		// resolve, check cache, 
		return this.get(token).ready;
	},
	import: function(token){
		id = Module.token(token);
		var module = this.get(id);
		if (!module){
			module = new this.constructor({
				id: id,
				parent: this
			})
		}
		return module.ready;
	},
	resolve: function(token){
		var id = {
			host: this.host,
		};
		if (token[0] === "/"){
			if (token[1] === "/"){
				// remote "//lew42/thing" ?
				id.host;
				id.path;
				id.name;
			} else {
				// abs "/thing"
				id.host = this.host;

			}
		} else if (token.indexOf("./") === 0){
			// "./thing"
		} else {
			// "local"

		}
	},
	$require: function(id){
		var module = this.get(id);

		if (!module)
			throw "module not found";

		return module.value;
	},
	exec: function(){
		return this.value = this.factory.call(this, this.$require.bind(this));
		// this.executed = true;
	},
	constructs: function(){
		var arg;
		for (var i = 0; i < arguments.length; i++){
			arg = arguments[i];
			if (typeof arg === "string")
				this.id = arg;
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
	},
	require: function(id){
		var module = this.get(id);

		if (!module){
			module = new this.constructor(id);

			// if (this.host)
				// module.host = this.host;
		}

		// this.dependencies.push(module);

		// module.dependents.push(this);

		return module.executed;
	},
	resolve: function(id){
		var parts = id.split("/"); // id could be //something.com/something/?

		// change this to default mimic
		// require "thing" --> thing/thing.js
		// require "thing.js" --> thing.js
		// require "thing/" --> thing/index?
		
		// "thing/"
		if (id[id.length-1] === "/"){
			// ends in "/", mimic last part --> "thing/thing.js"
			id = id + parts[parts.length-2] + ".js";

		// does not contain ".js", "thing"
		} else if (parts[parts.length-1].indexOf(".js") < 0){
			id = id + "/" + parts[parts.length-1] + ".js";
		}

		// convert non-absolute paths to moduleRoot paths
		if (id[0] !== "/"){
			id = "/" + define.modulesPath + "/" + id;
		}

		return id;
	},
	request: function(){
		if (!this.defined && !this.requested){
			this.script = document.createElement("script");
			this.src = this.resolve(this.id);
			this.script.src = this.src;

			// used in global define() function as document.currentScript.module
			// this enables anonymous modules to be defined/require without the need for an id
				// but, that means you can't concatenate it into a bundle...
			this.script.module = this;

			// this.debug("request", this.id);
			document.head.appendChild(this.script);
			this.requested = true;
		}
	}
});

Module.modules = {};

Module.get = function(id){
	return this.modules[id] || false;
};

Module.init = function(){
	if (!this.q){
		this.q = P();
	}
};

Module.q = function(cb){
	if (!this.timeout){
		this.timeout = P();
		setTimeout(0, function(){
			this.timeout.resolve();
		}.bind(this));
	}

	return this.timeout.then(cb);
};

Module.args = function(){
	var arg, args = {};
	for (var i = 0; i < arguments.length; i++){
		arg = arguments[i];
		if (typeof arg === "string")
			args.id = arg;
		else if (toString.call(arg) === '[object Array]')
			args.deps = arg;
		else if (typeof arg === "function")
			args.factory = arg;
		else if (typeof arg === "object")
			Module.assign.call(args, arg);
		else if (typeof arg === "undefined")
			continue;
		else
			console.error("whoops");
	}

	return args;
};

Module.prototype.root = new Module();