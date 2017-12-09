const P = window.P = function(){
	var resolve, reject;
	const p = new Promise(function(res, rej){
		resolve = res;
		reject = rej;
	});

	p.resolve = $resolve;
	p.reject = $reject;

	return p;
};