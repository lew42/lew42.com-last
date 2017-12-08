console.timeEnd("docReady");
console.time("document.ready");
Module("docReady", function(){
	var ready = function(){
		Module("document.ready", function(){
			console.timeEnd("document.ready");
			return true;
		});
	};


	if (/comp|loaded/.test(document.readyState)){
		console.warn("already ready?");
		ready();
	} else {
		document.addEventListener("DOMContentLoaded", ready);
	}
});