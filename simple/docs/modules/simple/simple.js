define("simple", 
	{ log: false },
	["Base", "logger", "is", "Module", "mixin", "View", "Test", "server"], 
	function(require, exports, module){
////////

window.Base = require("Base");
window.logger = require("logger");
window.is = require("is");
window.Module = require("Module");
window.mixin = require("mixin");
window.View = require("View");
window.Test = require("Test");
window.server = require("server");

module.exports = "so simple";

}); // end

simple = define;