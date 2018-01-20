define("Coll", ["Base", "View"], function(require, exports, module){
////////

const Coll = module.exports = Base.extend("Coll", {
	instantiate(...args){
		this.children = [];
		this.set(...args);
	},
	append(value){
		const child = new this.Child({
			value: value,
			coll: this
		});
		this.children.push(child);
		this.emit("append", child);
		// return item || this;
	},
	render(){
		return new this.View({
			coll: this
		});
	},
	Child: Base.extend("CollChild", {
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
		render(){
			return new this.View({
				item: this
			});
		}
	})
});

}); // end