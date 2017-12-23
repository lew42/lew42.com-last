;(async function(){

if (define.debug)
	await define.debugger();

define("logger", () => define.logger);

})();