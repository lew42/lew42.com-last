Module(["Collection"], async function(require, exports, module){
////////

console.log(module.local);
const Collection = require("Collection");

coll = module.local("coll", Collection());
// coll = Collection(module.local("coll"));
// coll = Collection.load(module.local("coll"));
// coll = Collection({ module, name: "coll" });


await document;
coll.render().appendTo(document.body);
// coll.append("hello");
// coll.append("world");

}); // end
