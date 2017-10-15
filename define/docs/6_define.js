;(function(define, assign, Module, log){
	
	define.assign({
		Module: Module,
		log: log,
		debug: log.off,
		modules: {},
		moduleRoot: "modules",
		define: function(){
			var args = define.args(arguments);
			var script = document.currentScript; 
			var module;
			var a;

			if (args.id){
				module = define.get(args.id);
			} else if (script && script.module){
				module = script.module;
			} else {
				a = document.createElement("a");
				a.href = script.src;
				module = new define.Module(a.pathname);
			}

			define.delayRequests();

			return module.define(args);
		},
		delayRequests: function(){
			define.debug.time("define.requests timeout");
			if (define.delayRequestsTimeout){
				clearTimeout(define.delayRequestsTimeout);
			}
			define.delayRequestsTimeout = setTimeout(define.requests, 0);
		},
		get: function(id){
			return (define.modules[id] = define.modules[id] || new define.Module(id));
		},
		args: function(argu){
			var arg, args = {};
			for (var i = 0; i < argu.length; i++){
				arg = argu[i];
				if (typeof arg === "string")
					args.id = arg;
				else if (toString.call(arg) === '[object Array]')
					args.deps = arg;
				else if (typeof arg === "function")
					args.factory = arg;
				else
					console.error("whoops");
			}
			return args;
		},
		requests: function(){
			define.debug.g("define.requests", function(){
				define.debug.timeEnd("define.requests timeout");
				for (var i in define.modules){
					define.modules[i].request();
				}
			});
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
		}
	});

})(define, define.assign, define.Module, define.log);