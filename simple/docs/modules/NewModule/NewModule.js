define("NewModule", ["Base"], function(Base){

	var NewModule = Base.extend({
		prop: 123,
		method: function(){
			return this.prop + 456;
		}
	});

	return NewModule;
})