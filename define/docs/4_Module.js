define.Module = class Module extends define.Base {

	constructor(...args){
		super();
		return (this.get(args[0]) || this.initialize()).set(...args);
	}

	get(token){
		return typeof token === "string" && Module.get(this.resolve(token));
	}

	initialize(...args){
		this.ready = Module.P();
		this.dependencies = [];
		this.dependents = [];

		return this; // see instantiate()
	}

	exec(){
		this.exports = {};

		// log if no dependents
		const log = define.logger(!this.dependents.length);
		
		log.group(this.id);
		const ret = this.factory.call(this, this.require.bind(this), this.exports, this);
		log.end();

		if (typeof ret !== "undefined")
			this.exports = ret;

		return this.exports;
	}

	// `this.token` is transformed into `this.id`
	resolve(token){ 
		var id, 
			parts;

		// mimic the base path
		if (token === "."){
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
				id = "/" + define.path + "/" + id;
			}
		}

		return id;
	}

	import(token){
		return (new this.constructor(this.resolve(token))).register(this);
	}

	register(dependent){
		this.dependents.push(dependent);

		if (!this.factory && !this.queued && !this.requested){
			this.queued = setTimeout(this.request.bind(this), 0);
		}

		return this.ready; // see import()
	}

	require(token){
		const module = this.get(token);
		if (!module)
			throw "module not preloaded";
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
		} else {
			throw "trying to re-request?"
		}
	}

	set_id(id){
		if (this.id && this.id !== id)
			throw "do not reset id";

		if (!this.id){
			this.id = id;
			this.url = Module.url(this.id);

			// cache me
			Module.set(this.id, this);
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
		if (!this.modules)
			this.modules = {};
		return this.modules[id]
	}

	static set(id, module){
		if (!this.modules)
			this.modules = {};
		if (this.modules[id])
			throw "don't redefine a module";
		this.modules[id] = module;
	}

	static doc(...cbs){
		if (!this.document_ready){
			this.document_ready = new Promise((res, rej) => {
				if (/comp|loaded/.test(document.readyState))
					res();
				else
					document.addEventListener("DOMContentLoaded", res);
			});
		}

		return this.document_ready.then(...cbs);
	}

	static base(base){
		if (base) this._base = base;
		return this._base || "modules";
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