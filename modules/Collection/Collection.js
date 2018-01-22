define("Collection", ["Value"], function(require, exports, module){
////////

const Value = require("Value");

const ItemView = View.extend("ItemView", {
	tag: "input",
	render(){
		this.attr("type", "text");
		this.el.value = this.item.value;
		this.hooks();
	},
	hooks(){
		this.item.on("change", v => this.el.value = v);
		this.el.addEventListener("keyup", () => {
			this.item.set(this.el.value);
		});
	}
});

const Item = Value.extend("Item", {
	View: ItemView,
	render(){
		return new this.View({
			item: this
		});
	}
});

const CollectionView = View.extend("CollectionView", {
	render(){
		this.append("this is a CollectionView");

		this.coll.on("append", v => this.append(v));
	}
});

/*
*/
const Collection = Base.extend("Collection", {
	Item: Item,
	View: CollectionView,
	instantiate(...args){
		this.items = {};
		this.length = 0;
	},
	append(...args){
		for (const arg of args){
			if (is.pojo(arg)){
				this.append_pojo(arg);
			} else {
				this.append_item(arg);
			}
		}
		return this;
	},
	append_item(value){
		const item = new this.Item({
			coll: this,
			value: value
		});

		this.items[++this.length] = item;
		this.emit("append", item);
		return this;
	},
	append_pojo(pojo){
		for (const prop in pojo){
			console.error("todo");
		}
	},
	push(...args){
		for (const arg of args){
			this.append_anonymous(arg);
		}
	},
	render(){
		return new this.View({
			coll: this
		});
	}
});

module.exports = Collection;

});