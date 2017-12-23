;(async function(){

const V = View.V;
const Row = View.extend({
	classes: "row"
});


const ModuleView = View.extend("ModuleView", {
	render(){
		this.addClass("module");
		this.module.on("id", id => this.id.set(id));
		this.module.on("requested", this.requested.bind(this));
		this.module.on("dependent", d => this.dependents.add(d));
		this.module.on("dependency", d => this.dependencies.add(d));
		this.module.on("defined", this.defined.bind(this));
		this.module.on("resolved", this.resolved.bind(this));

		this.module.on("pre-exec", () => {})
		this.module.on("executed", () => this.addClass("executed"));

		const view = this;
		const module = this.module;
		
		this.append({
			id: module.id,
			dependencies: View({
				render(){
					this.append("dependencies (", this.count = View({tag: "span"}, module.dependencies.length), ")");
				},
				add: function(dep){
					this.count.set(module.dependencies.length);
					// this.append(ModuleView({ module: dep }));
					this.append(View(dep.id));
				}
			}),
			dependents: View({
				render(){
					this.append("dependents (", this.count = View({tag: "span"}, module.dependents.length), ")");
				},
				add(dependent){
					this.count.set(module.dependents.length);
					this.append(View(dependent.id));
				}
			}),
			history: "History"
		});
	},
	requested(){
		this.addClass("requested");
	},
	defined(){
		this.removeClass("requested").addClass("defined");
	},
	resolved(token, id){
		this.history.append(View("resolved(" + token + ") => " + id))
	}
});

const modules = View().addClass("modules");


// define.doc.then(() => {
	const stylesheet = View({tag: "link"})
		.attr("rel", "stylesheet")
		.attr("href", "/rtpovcoll/module.css")
		.appendTo(document.head);
		
	modules.appendTo(document.body);
// });

window.addEventListener("define.debug", function(e){
	define.Module.on("new", function(module, id){
		ModuleView({
			module: module
		}).appendTo(modules);
	});
});

define.debug = true;

})(); // end
