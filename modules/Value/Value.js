Module("Value", ["Value/ValueView.js"], function(require, exports, module){
////////

const ValueView = require("Value/ValueView.js");

const Value = module.exports = Base.extend("Value", {
	View: ValueView,
	instantiate(...args){
		this.set(...args);
		this.initialize();
	},
	initialize(){},
	set$(value){
		this.set_value(value);
	},
	set_value(value){
		if (this.value !== value){
			this.value = value;
			this.emit("change", value);
		}
	},
	// render(){
	// 	return new this.View({
	// 		vo: this
	// 	});
	// }
});

}); // end
