Module("Value/ValueView.js", function(require, exports, module){
////////

const ValueView = module.exports = View.extend("ValueView", {
	// tag: "input",
	render(){
		this.editable();
		this.el.append(this.valueObject.value);
		this.hooks();
	},
	hooks(){
		this.valueObject.on("change", v => {
			if (!this.locked){
				this.empty(); 
				this.el.append(v);
			}
		});
		this.el.addEventListener("input", () => {
			if (!this.locked){
				this.locked = true;
				this.valueObject.set(this.el.innerHTML);			
				this.locked = false;
			}
		});
	}
});

}); // end
