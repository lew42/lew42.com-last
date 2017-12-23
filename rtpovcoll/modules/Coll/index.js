define(["Coll"], async function(require){
////////

const Coll = require("Coll");

await define.doc;

const coll = Coll({
	View: View.extend("CollView", {
		classes: ["coll"],
		render(){
			this.coll.on("add", (item) => this.append(item.render()));
		}
	}),
	Item: Coll.prototype.Item.extend("CollItem", {
		View: View.extend("CollItemView", {
			render(){
				this.set(this.item.value);
				this.item.on("change", (new_value) => this.set(new_value));
			}
		})
	})
});

coll.render().appendTo(document.body);

window.coll = coll;

}); // end
