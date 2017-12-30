define("Tree", ["Base", "View", "Coll"], function(require){
////////

const Base = require("Base");
const View = require("View");
const Coll = require("Coll");

const TreeView = View.extend("TreeView", {
	initialize(){
		this.tree.on("append", this.tree_append.bind(this));
		this.init();
	},
	tree_append(value, item){
		this
	},
	render(){

	}
});

const Tree = Base.extend("Tree", {
	View: TreeView,
	Children: Coll,
	instantiate(...args){
		this.children = new this.Children({
			tree: this
		});
		this.set(...args);
	},
	render(){
		return new this.View({
			tree: this
		});
	},
	append(...args){
		this.children.append(...args);
	},
});

}); // end