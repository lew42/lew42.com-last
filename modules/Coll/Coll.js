define("Coll", ["Base", "View"], function(require, exports, module){
////////

const Coll = module.exports = Base.extend("Coll", {
	instantiate(...args){
		this.items = [];
		this.set(...args);
	},
	append(value){
		const item = new this.Item(value);
		this.items.push(item);
		this.emit("append", item);
		// return item || this;
	},
	render(){
		return new this.View({
			coll: this
		});
	},
	Item: Base.extend("CollItem", {
		instantiate(...args){
			this.set(...args);
		},
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