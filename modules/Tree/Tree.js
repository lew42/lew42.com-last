define("Tree", 
	["Base", "View", "Coll", 
	"Tree/TreeChildren.js", "Tree/TreeView.js"], 
	function(require, exports, module){
////////

const Base = require("Base");
const View = require("View");
const Coll = require("Coll");

const styles = View({tag: "link"})
	.attr("rel", "stylesheet")
	.attr("href", "/modules/Tree/Tree.css")
	.appendTo(document.head);

const TreeChildren = require("Tree/TreeChildren.js");

const TreeView = require("Tree/TreeView.js");

const Tree = Base.extend("Tree", {
	View: TreeView,
	Children: TreeChildren,
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

module.exports = Tree;

}); // end