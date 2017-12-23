define("Coll", function(require, exports, module){

// these external deps (Base), which aren't tracked, are trouble..
// we need to import them, AND import them @ a certain version...
const Coll = module.exports = Base.extend("Coll", {
	instantiate(...args){
		this.events = {};
		this.items = [];
		this.set(...args);
	},
	append(arg){
		const item = new this.Item(arg);
		this.items.push(item);
		this.emit("add", item)
	},
	Item: Base.extend("CollItem", {
		instantiate(arg){
			this.value = arg;
		},
		set$(new_value){
			if (this.value !== new_value){
				this.value = new_value;
				this.emit("change", new_value);
			}
		},
		render(){
			return new this.View({
				item: this
			});
		}
	}),
	render(){
		return new this.View({
			coll: this
		});
	}
});

}); // end
