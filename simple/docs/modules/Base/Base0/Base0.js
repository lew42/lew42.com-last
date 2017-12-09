define("Base/Base0", function(require, exports, module){

function make_constructor(){
	return function Constructor(...constructs){
		if (!(this instanceof Constructor))
			return new Constructor(...constructs);
		return this.instantiate(...constructs);
	}
}

const Basic = module.exports = make_constructor();

Basic.assign = Basic.prototype.assign = function(...args){
	for (arg of args)
		for (const prop in arg)
			this[prop] = arg[prop];
	return this;
};

Basic.prototype.assign({
	instantiate(){}
});

Basic.assign({
	make_constructor: make_constructor,
	extend(...args){
		const Ext = this.make_constructor(name);
		Ext.assign = this.assign;
		Ext.assign(this);
		Ext.events = {};
		Ext.prototype = Object.create(this.prototype);
		Ext.prototype.constructor = Ext;
		Ext.prototype.assign(...args);
		return Ext;
	}
});

}); // end
