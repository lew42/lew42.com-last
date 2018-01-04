define(["Value"], async function(require, exports, module){
////////

const Value = require("Value");

document.then = function(...args){
	define.doc.then(...args);
};

await document;

const val = new Value();
val.on("change", console.log.bind(console));
val.set("yo");

val.render().appendTo(document.body);

}); // end
