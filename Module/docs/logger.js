;(function(){
	const logger = function(value){
		if (typeof value === "function" && value.logger){
			return value;
		} else if (value){
			return logger.active;
		} else {
			return logger.inactive;
		}
	};

	const console_methods = ["log", "group", "groupCollapsed", "debug", "trace", 
		"error", "warn", "info", "time", "timeEnd", "dir"];

	const inactive = function(){};

	const active = logger.active = console.log.bind(console);
	const inactive = logger.inactive = function(){};
	
	active.logger = inactive.logger = logger;
	
	active.active = inactive.active = active;
	inactive.inactive = active.inactive = inactive;

	active.is_active = true;
	inactive.is_active = false;
	
	for (const method of console_methods){
		active[method] = console[method].bind(console);
		inactive[method] = noop;
	}

	active.groupc = console.groupCollapsed.bind(console);
	active.end = console.groupEnd.bind(console);

	inactive.groupc = noop;
	inactive.end = noop;
})();