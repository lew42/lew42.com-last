;(async function(){

const Thing = function(){
// 	debugger;
	this.any["yo"];
	console.error("WTF");
	this.any.yo;
	this.parent["yo"];
	debugger;
};


// const Thing = Base.extend("Thing", {
// 	render(){
// 	}
// });

const ModuleView = View.extend("ModuleView", {
	render(){
		debugger;
		console.log("hmm");
		this.any["yo"];
		this.any.yo;
		this.parent["yo"];
		console.log("hmm2");
		debugger;
	}
});

// new ModuleView();

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
	// 	const obj = {};
	// obj.thing["yo"];
	// debugger;
		// try {

		// (new Thing()).render();

			const mv = ModuleView({
				module: module
			}).appendTo(modules);
		// } catch (e) {
		// 	debugger;
		// 	throw e;
		// }
	});
});

})(); // end
