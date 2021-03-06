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
