
var getProxy = function(obj){

	var proxy = new Proxy(obj, {
		get: function(ctx, prop, prox){
			var value = ctx[prop];

			// if (["constructor"].indexOf(prop) === -1)
				// console.log("get", prop);

			if ((typeof value === "function") && ["constructor", "log", "hasOwnProperty"].indexOf(prop) === -1){
				return new Proxy(value, {
					apply: function(fn, ctx, args){
						var largs = ["."+prop+"("].concat(args, ")");
						// var log = ctx.log;
						console.group.apply(console, largs);
						var value = fn.apply(ctx, args);
						console.groupEnd();
						return value;
					},
					get: function(ctx, prop, prox){
						if (prop === "toString"){
							return new Proxy(ctx[prop], {
								apply: function(fn, prox, args){
									return fn.call(ctx);
								}
							});
						} else {
							return ctx[prop];
						}
					}
				});
			} else {
				return value;
			}
		},
		set: function(ctx, prop, value, prox){
			if (ctx === ctx.constructor.prototype)
				debugger;
			// console.log("set", prop, value);
			ctx[prop] = value;
			if (ctx["update_" + prop])
				ctx["update_" + prop]();
			else if (ctx.update)
				ctx.update();

			return true;
		}
	});	

	return proxy;
};
