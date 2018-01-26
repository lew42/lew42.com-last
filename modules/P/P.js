define("P", function(require, exports, module){
////////

const P = function(){
	var resolve;
	const p = new Promise(res => {
		resolve = res;
	});
	p.resolve = resolve;
	return p;
};

module.exports = P;

}); // end