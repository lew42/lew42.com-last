define("Tree/TreeView.js", ["View"], function(require, exports, module){
////////

const View = require("View");

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
		this.tree_view.tree.append(this.input.el.value);
		this.input.el.value = "";
	}
});

const TreeView = View.extend("TreeView", {
	classes: "tree",
	render(){
		this.addClass(this.tree.name);
		this.append({
			name: this.tree.name,
			children: this.tree.children,
			add_child: new AddChild({
				tree_view: this
			}),
			pre: View({tag: "pre"}, this.json())
		});
		// this.name = View();
		// this.children = this.tree.children.render();
		// this.add_child = new AddChild({
		// 	tree_view: this
		// });
		// this.pre = View({tag: "pre"}, this.json());

		this.tree.on("change", () => {
			this.pre.set(this.json());
		});
	},
	json(){
		const js = {
			name: this.tree.name,
			children: []
		};
		for (const child of this.tree.children.children){
			js.children.push(child.json());
		}
		return JSON.stringify(js, null, 3);
	}
});

module.exports = TreeView;

}); // end