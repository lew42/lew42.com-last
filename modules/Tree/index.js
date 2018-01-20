define(["Tree"], async function(require){
////////

const Tree = require("Tree");

tree = new Tree({
	name: "MyTree"
});

tree.append("hello");

await define.doc;
tree.render().appendTo(document.body);

}); // end
