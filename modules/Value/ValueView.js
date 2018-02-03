Module("Value/ValueView.js", function(require, exports, module){
////////

const ValueView = module.exports = View.extend("ValueView", {
	tag: "input",
	render(){
		this.attr("type", "text");
		this.el.value = this.value.value;
		this.hooks();
	},
	hooks(){
		this.vo.on("change", v => this.el.value = v);
		this.el.addEventListener("keyup", () => {
			this.value.set(this.el.value);
		});
	}
});

}); // end
