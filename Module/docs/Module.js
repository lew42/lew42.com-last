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

var Module = Base.extend({
	instantiate: function(){
		this.constructs.apply(this, arguments);
		
		var cached = this.get(this.id);

		if (cached){
			if (cached.defined){
				throw "Cannot redefine module: " + this.id;
			} else {
				cached.define.apply(this, arguments);
				return cached;
			}
		} else {
			this.initialize();
			return this;
		}
	},
	get: function(id){
		return this.modules[id] || this.parent.get(id);
	},
	define: function(){
		Promise.all(this.deps.map((dep) => this.require(dep)))
			.then((args) => this.exec.apply(this, args));
	},
	initialize: function(){
		this.dependencies = [];
		this.dependents = [];
	},
	exec: function(){
		this.value = this.factory.apply(this, arguments);
		this.executed = true;
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
		if (this.executed)
			return this.value;


		var cached = this.get(id);

		if (cached){

		}

		this.dependencies.push(module);

		module.dependents.push(this);

		return this.ready;
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
			id = "/" + define.moduleRoot + "/" + id;
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