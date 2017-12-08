Module.base = "Module/modules";
Module(["Coll"], async function(Coll){
	await Module.doc;
	View(function(){
		Coll();
	}).appendTo(document.body);
});