define("Base", ["./Base0", "./set", "logger"], function(require, exports, module){

const logger = require("logger");
const Base0 = require("./Base0");
const set = require("./set");

const Base = module.exports = function(...constructs){
	if (!(this instanceof Base))
		return new Base(...constructs);
	this.events = {};
	return this.instantiate(...constructs);
};

Base.assign = Base.prototype.assign = Base0.assign;

Base.prototype.assign(events, {
	instantiate(){},
	set: set,
	log: logger(),
	set_log(value){
		this.log = logger(value);
	}
});

Base.assign(events, {
	events: {},
	extend(...args){
		const name = typeof args[0] === "string" ? args.shift() : this.name + "Ext";
		const Ext = this.extend_base(name);
		Ext.assign = this.assign;
		Ext.assign(this);
		Ext.events = {};
		Ext.prototype = Object.create(this.prototype);
		Ext.prototype.constructor = Ext;
		Ext.prototype.set(...args);
		this.emit("extended", Ext);
		return Ext;
	},
	extend_base(name){
		eval("var " + name + ";");
		var constructor = eval("(" + name + " = function(...constructs){\r\n\
			if (!(this instanceof " + name + "))\r\n\
				return new " + name + "(...constructs);\r\n\
			this.events = {};\r\n\
			return this.instantiate(...constructs);\r\n\
		});");
		return constructor;
	},

});
});