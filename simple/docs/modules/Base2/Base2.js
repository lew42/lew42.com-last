define("Base2", ["Base"], {log: true}, function(Base){

	var Base2 = Base.extend({
		log: log.off, // log is globalized by simple/modules/Base
		assign: Base.assign,
		instantiate: function(){}
	});

	Base2.extend = function(){
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

	return Base2;

});