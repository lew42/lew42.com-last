define.path = "rtpovcoll/modules";
define(["Coll"], async function(require){
////////

const Coll = require("Coll");
await define.doc;

View(function(){
	// for (const module in define.Module.modules){
	// 	this.append(View(module));
	// }
}).appendTo(document.body);

}); // end
