Module("Base2", ["Base"], 

// {log: true},

function(require){
	var Base = require("Base");
	var Base2 = Base.extend({
		log: logger(false),
		assign: Base.assign,
		instantiate: function(){}
	}).assign({
		config: function(instance, options){
			if (options && is.def(options.log)){
				// pass { log: true/false/another } into constructor as first option
				instance.log = logger(options.log);
				delete options.log;
			} else {
				// you could assign true/false to the prototype
				instance.log = logger(instance.log); 
			}
		}
	});

	Base2.extend = function(){
		var Ext = function Ext(o){
			if (!(this instanceof Ext))
				return new (Ext.bind.apply(Ext, [null].concat([].slice.call(arguments))));
			Ext.config(this, o);
			this.instantiate.apply(this, arguments);
		};
		Ext.assign = this.assign;
		Ext.assign(this);
		Ext.prototype = Object.create(this.prototype);
		Ext.prototype.constructor = Ext;
		Ext.prototype.assign.apply(Ext.prototype, arguments);
		return Ext;
	};

	return Base2;

});