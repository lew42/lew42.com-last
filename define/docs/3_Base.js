;(function(define, assign){

	var Base = define.Base = function(){
		this.instantiate.apply(this, arguments);
	};

	Base.assign = Base.prototype.assign = assign;

	Base.prototype.instantiate = function(){};

	Base.assign({
		extend: function(){
			var Ext = function(){
				this.instantiate.apply(this, arguments);
			};
			Ext.assign = this.assign;
			Ext.assign(this);
			Ext.prototype = Object.create(this.prototype);
			Ext.prototype.constructor = Ext;
			Ext.prototype.assign.apply(Ext.prototype, arguments);

			return Ext;
		}
		
	});

})(define, define.assign);
