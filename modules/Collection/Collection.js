Module("Collection", ["Value"], function(require, exports, module){
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

const AddChild = View.extend("AddChild", {
	classes: "add",
	render(){
		this.el.addEventListener("keypress", (e) => {
			if (e.key === "Enter"){
				this.submit();
			}
		});
		this.input = View({tag: "input"}).attr("type", "text").attr("placeholder", "add");
		this.add = View({tag: "button"}, "add").click(() => this.submit());
	},
	submit(){
		this.coll.tree.append(this.input.el.value);
		this.input.el.value = "";
	}
});

const CollectionView = View.extend("CollectionView", {
	render(){
		this.append("this is a CollectionView");

		this.coll.on("append", v => this.append(v));
		// this.coll.on("append", v => this.append(v));

		this.append({
			name: this.coll.name,
			children: 
		})
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
	load(data){
		this.set(data);
		// instantiate items?
		for (const id in this.items){
			this.items[id] = new this.Item(this.items[id]);
		}
	},
	append(...args){
		for (const arg of args){
			if (is.pojo(arg)){
				this.append_pojo(arg);
			} else {
				this.append_value(arg);
			}
		}
		return this;
	},
	append_item(item){
		if (!(item instanceof this.Item))
			throw "must append instanceof this.Item";

		item.set({
			coll: this
		});

		item.on("change", v => this.emit("change", item));

		this.items[++this.length] = item;
		this.emit("append", item);
		return this;
	},
	append_value(value){
		return this.append_item(new this.Item({
			value: value
		}));
	},
	append_pojo(pojo){
		for (const prop in pojo){
			console.error("todo");
		}
	},
	push(...args){
		for (const arg of args){
			this.append_item(arg);
		}
	},
	render(){
		return new this.View({
			coll: this
		});
	},
	save(){
		if (this.localID){
			localStorage.setItem(this.localID, this.json());
		} else {
			throw "can't save w/o localID";
		}
	},
	json(){
		const json = {};
		json.name = this.name;
		json.items = {};
		for (const id in this.items){
			
		}
	}
});

module.exports = Collection;

});