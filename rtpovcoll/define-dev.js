;(function(){

const V = View.V;
const Row = View.extend({
	classes: "row"
});

var count = 0;
views = {};

const ModuleView = View.extend("ModuleView", {
	render(){
		this.prerender = count;
		// debugger;
		this.addClass("module");
		this.module.on("id", id => this.id.set(id));
		// this.module.on("requested", this.requested.bind(this));
		this.module.on("dependent", d => {
			this.dependents.add(d);
			this.depts.set(module.dependents.length);
		});
		this.module.on("dependency", d => {
			this.deps.set(module.dependencies.length);
			this.dependencies.add(d)
		});
		// this.module.on("defined", this.defined.bind(this));
		// this.module.on("resolved", () => {
		// 	if (!this.history)
		// 		debugger;
		// 	this.resolved();
		// });
		// Object.defineProperty(this, "history", {
		// 	get: function(){
		// 		// debugger;
		// 		return this._history;
		// 	},
		// 	set: function(value){
		// 		debugger;
		// 		this._history = value;
		// 	}
		// });
		const view = this;
		views["view" + count] = this;
		// console.log("view"+count);
		this.module.on("resolved", () => {
			if (this !== view)
				debugger;

			if (!this.history)
				debugger;
		});

		// this.module.on("pre-exec", () => {})
		// this.module.on("executed", () => this.addClass("executed"));

		// const view = this;
		const module = this.module;
		
		// console.group("appending");
		this.append({
			preview: V(".flex", {
				deps: module.dependencies.length,
				arr: "=>",
				id: module.id,
				arr2: "=>",
				depts: module.dependents.length
			}),
				// deps: View.span(module.dependencies.length),
				// id: View.span(module.id),
				// depts: View.span(module.dependents.length),
			// },
			contents: {
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
			}
		});
		this.contents.hide();

		this.preview.click(()=>{
			this.contents.toggle();
		});
		// console.groupEnd();

		if (!this.history)
			debugger;

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
		// console.group("new", ++count);
		try {
			const mv = ModuleView({
				module: module
			}).appendTo(modules);
		} catch (e) {
			throw e;
		}
		// console.groupEnd();
	});
});

define.debug = true;

})(); // end
