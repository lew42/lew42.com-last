define = function(...args){
	return new define.Module(...args);
};

// move this to Module.path
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

document.then = function(...args){
	define.doc.then(...args);
};

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

define.table = function(){
	console.table(this.Module.modules);
};
// end
