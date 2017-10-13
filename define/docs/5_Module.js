;(function(define, Base, log, debug){

var Module = define.Module = Base.extend({
	instantiate: function(id){
		this.id = id;
		
		this.log = define.log;
		this.debug = define.debug;

		this.deps = []; // dependencies (Module instances)
		this.dependents = [];

		this.views = [];
	},
	define: function(fn, deps){
		this.debug.group("define", this.id, deps || []);

		this.factory = fn;

		if (deps)
			deps.forEach(this.require.bind(this));

		this.defined = true;

		this.exec();

		this.debug.end();
	},
	require: function(id){
		var module = define.get(id);

		// all deps
		this.deps.push(module);

		// deps track dependents, too
		module.dependents.push(this);
	},
	/**
	 * All requests get delayed.  See define(), define.delayRequests(), and define.requests()
	 */
	request: function(){
		if (!this.defined && !this.requested){
			this.script = document.createElement("script");
			this.script.src = define.resolve(this.id);

			// used in global define() function as document.currentScript.module
			this.script.module = this;

			this.debug("request", this.id);
			this.requested = true;
			document.head.appendChild(this.script);
		}
	},
	exec: function(){
		this.debug.group("ping", this.id);

		if (this.executed){
			this.debug("already executed");
			// this happens when the "finish" loop has a dependency that will be pinged later in the loop, but also gets pinged earlier in the loop, due to multiple dependents
				// essentially, if b depends on a, and c depends on a, but c also depends on b, then what happens is
				// a finishes
				// a begins finish loop to notify b and c
				// b is notified first, and when complete, pings c
				// when c is pinged, at this point, a is finished, so c is executed synchronously
				// after c's finish loop, we fall back to the original a.finish that we started with
				// in a's finish loop, we just pinged b, now we ping c
				// here's where the second .exec came in
			// i originally thought that .exec wouldn't be called twice
			// but, unless I setTimeout 0 on the .execs...
			return false;
		}

		var args = this.args();
		
		if (args){
			!this.dependents.length && 
				this.log.group(this.id, this.deps.map(function(dep){ return dep.id }));
			this.value = this.factory.apply(null, args);
			this.executed = true;
			!this.dependents.length && 
				this.log.end();
			this.finish();
		} else {
			this.debug(this.id, "not ready");
		}
		this.debug.end();
	},
	finish: function(){
		this.debug.group(this.id, "finished");
		for (var i = 0; i < this.dependents.length; i++){
			this.debug("dependent", this.dependents[i].id, "exec()");
			this.dependents[i].exec();
		}
		this.debug.end();
		this.finished = true;
	},
	args: function(){
		var dep, args = [];
		for (var i = 0; i < this.deps.length; i++){
			dep = this.deps[i];
			if (dep.executed){
				args.push(dep.value);
			} else {
				this.debug("awaiting", dep.id);
				return false;
			}
		}
		return args;
	},
	render: function(){
		var view;
		if (this.View){
			view = new this.View({
				module: this
			});
			this.views.push(view);
			return view;
		}
		return false;

		// then

		this.views.forEach((view) => view.update());
	}
});

})(define, define.Base, define.log, define.debug);