define("Tree/TreeChildren.js", 
	["View", "Coll", "Tree/TreeChild.js"], 
	function(require, exports, module){
////////

const Coll = require("Coll");
const TreeChild = require("Tree/TreeChild.js");

const TreeChildrenView = View.extend("TreeChildrenView", {
	render(){
		this.addClass("tree-children");
		for (const child of this.children.children){
			child.render();
		}

		// this.parent === this.tree.view;
		// this.
		this.children.on("append", (child) => {
			this.append(child.render());
		});
	}
});

const TreeChildren = Coll.extend("TreeChildren", {
	Child: TreeChild,
	View: TreeChildrenView,
	append(value){
		const child = new this.Child({
			value: value,
			children: this
		});
		this.children.push(child);
		this.emit("append", child);
		this.tree.emit("change");
	},
	render(){
		return new this.View({
			children: this
		});
	}
});

module.exports = TreeChildren;

}); // end

