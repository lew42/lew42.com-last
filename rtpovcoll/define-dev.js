;(function(){

const V = View.V;

const stylesheet = View({tag: "link"})
	.attr("rel", "stylesheet")
	.attr("href", "/rtpovcoll/module.css")
	.appendTo(document.head);

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
			bar: V("span", {
				dependents_count: module.dependents.length,
				id: module.id,
				dependencies_count: module.dependencies.length
			}),
			id: View(this.module.id),
			dependencies: View("dependencies", {
				add: function(dep){
					this.parent.bar.dependencies_count.set(this.parent.module.dependencies.length);
					// this.append(ModuleView({ module: dep }));
					this.append(dep.id);
				}
			}),
			dependents: View("dependents", {
				add(dependent){
					this.parent.bar.dependents_count.set(this.parent.module.dependents.length);
					this.append(dependent.id);
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

window.addEventListener("define.debug", function(e){
	define.Module.on("new", function(module, id){
		console.log(id);
		new_module(module, id);
	});
});

function new_module(module, id){

	ModuleView({
		module: module
	}).appendTo(document.body);
}


})(); // end
