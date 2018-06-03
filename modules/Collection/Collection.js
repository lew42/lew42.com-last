Module("Collection", ["Value"], function(require, exports, module){
////////

const Value = require("Value");

const ItemView = View.extend("ItemView", {
	render(){
		this.editable();
		this.el.append(this.item.value);
		this.hooks();
	},
	hooks(){
		this.item.on("change", v => {
			if (!this.lock){
				console.log("item changed, view is unlocked, change view value");
				this.set(v);
			}
		});
		this.el.addEventListener("keyup", () => {
			console.log("keyup, this.item.set(innerHTML)");
			this.lock = true;
			this.item.set(this.el.innerHTML);
			this.lock = false;
		});
	}
});

const Item = Value.extend("Item", {
	View: ItemView,
	render(){
		return new this.View({
			item: this
		});
	},
	set_coll(coll){
		this.coll = coll;

		this.on("change", v => {
			console.log("item change");
			coll.emit("change", this);
			coll.save();
		});
	},
	data(){
		return this.value;
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
		this.coll.append(this.input.el.value);
		this.input.el.value = "";
	}
});

const CollectionView = View.extend("CollectionView", {
	render(){
		this.append("this is a CollectionView ", 
			View({tag: "span"}, "empty()")
				.click(() => {
					this.coll.empty();
					this.children.empty();
				})
		);

		this.append({
			children(){
				for (const id in this.parent.coll.items){
					this.append(this.parent.coll.items[id]);
				}
			}
		});
		this.coll.on("append", v => this.children.append(v));
		// this.coll.on("append", v => this.append(v));

		AddChild({
			coll: this.coll
		});
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
		this.set(...args);
	},
	set_items(items){
		this.items = items;

		for (const id in this.items){
			this.items[id] = new this.Item({
				id: id,
				value: this.items[id],
				coll: this,
			});
		}
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
			id: ++this.length,
			value: value,
			coll: this
		});

		this.items[item.id] = item;
		this.emit("append", item);
		this.save();
		return item;
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
	empty(){
		this.instantiate();
		this.save();
	},
	save_local(){
	console.log("saving");
		if (this.localID){
			localStorage.setItem(this.localID, JSON.stringify(this.data()));
		} else {
			throw "can't save w/o localID";
		}
	},
	save(){
		if (!this.save_path)
			throw "must have save path";

		var payload = JSON.stringify({
			action: "save",
			path: this.save_path,
			data: JSON.stringify(this.data())
		});

		console.log("payload", payload);



		server.send(payload);
	},
	data(){
		const data = {};
		data.name = this.name;
		data.length = this.length;
		data.items = {};
		for (const id in this.items){
			data.items[id] = this.items[id].value;
		}
		return data;
	}
});

module.exports = Collection;

});