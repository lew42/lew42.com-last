define("Tree/TreeChild.js", ["Coll", "View"], function(require, exports, module){
////////

const Coll = require("Coll");
const View = require("View");

const TreeChildView = View.extend("TreeChildView", {
	initialize(){

	},
	render(){
		this.append({ 
			input: View({tag: "input"})
				.attr("value", this.child.value)
				.attr("type", "text")
		});
		this.hook();
	},
	hook(){
		this.child.on("change", (v) => {
			console.log("change", v);
			this.input.el.value = v;
			this.child.children.tree.emit("change");
		});
		this.input.el.addEventListener("keyup", () => {
			this.child.set(this.input.el.value);
		});
	}
});

const TreeChild = Coll.prototype.Child.extend("TreeChild", {
	View: TreeChildView,
	initialize(){
		this.views = [];
	},
	render(){
		const view = new this.View({
			child: this
		});
		this.views.push(view);
		return view;
	},
	json(){
		return this.value;
	}
});

module.exports = TreeChild;

}); // end
