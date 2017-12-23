define = function(...args){
	return new define.Module(...args);
};

define.path = "modules";

define.P = function(){
	var resolve, reject;
	
	const p = new Promise(function(res, rej){
		resolve = res;
		reject = rej;
	});

	p.resolve = resolve;
	p.reject = reject;

	return p;
};

define.doc = new Promise((res, rej) => {
	if (/comp|loaded/.test(document.readyState))
		res();
	else
		document.addEventListener("DOMContentLoaded", res);
});

define.new = function(){
	const new_define = function(...args){
		return new new_define.Module(...args);
	};
	new_define.path = define.path;
	new_define.P = define.P;
	new_define.doc = define.doc;
	new_define.new = define.new;
	new_define.logger = define.logger;
	new_define.Base = class Base extends define.Base {};
	new_define.Module = class Module extends define.Module {};
	new_define.Module.modules = {};
	return new_define;
};

define.debugger = function(){
	this.await_debug = define.P();
	document.addEventListener("keypress", e => {
		if (e.code === "Space" && e.ctrlKey){
			this.await_debug.resolve();
			console.log("continue?");
		}
	});

	return this.await_debug;
};

// end
