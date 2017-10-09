var assign = require("./assign");

var Base = function(){
	this.instantiate.apply(this, arguments);
};

Base.assign = Base.prototype.assign = assign;

Base.prototype.instantiate = function(){};

Base.extend = function(){
	var Ext = function Ext(){
		if (!(this instanceof Ext))
			return new (Ext.bind.apply(Ext, [null].concat([].slice.call(arguments))));
		this.instantiate.apply(this, arguments);
	};
	Ext.assign = this.assign;
	Ext.assign(this);
	Ext.prototype = Object.create(this.prototype);
	Ext.prototype.constructor = Ext;
	Ext.prototype.assign.apply(Ext.prototype, arguments);
	return Ext;
};

module.exports = Base;