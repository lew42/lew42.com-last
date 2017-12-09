define.logger = (function(){
	const logger = function(value){
		if (typeof value === "function" && value.logger){
			return value;
		} else if (value){
			return logger.active;
		} else {
			return logger.inactive;
		}
	};


	const noop = function(){};

	const active = logger.active = console.log.bind(console);
	const inactive = logger.inactive = function(){};
	
	const console_methods = ["log", "group", "groupCollapsed", "groupEnd", "debug", "trace", "error", "warn", "info", "time", "timeEnd", "dir"];
	
	for (const method of console_methods){
		active[method] = console[method].bind(console);
		inactive[method] = noop;
	}

	// some references
	active.logger = inactive.logger = logger;
	active.active = inactive.active = active;
	inactive.inactive = active.inactive = inactive;

	// some flags
	active.is_active = true;
	inactive.is_active = false;
	
	// alias these long methods
	active.groupc = console.groupCollapsed.bind(console);
	inactive.groupc = noop;
	active.end = console.groupEnd.bind(console);
	inactive.end = noop;

	return logger;
})();
