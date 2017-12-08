const P = window.P = function(){
	var $resolve, $reject;
	var p = new Promise(function(resolve, reject){
		$resolve = resolve;
		$reject = reject;
	});

	p.resolve = $resolve;
	p.reject = $reject;

	return p;
};