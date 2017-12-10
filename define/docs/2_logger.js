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
