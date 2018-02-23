Module(["Collection", "./coll.json"], async function(require, exports, module){
////////

// console.log(module.local);
const Collection = require("Collection");

coll = Collection(require("./coll.json"));
coll.save_path = module.resolve("./coll.json");
console.log(coll.save_path);
// coll = Collection(module.local("coll"));
// coll = Collection.load(module.local("coll"));
// coll = Collection({ module, name: "coll" });


await document;
coll.render().appendTo(document.body);
// coll.append("hello");
// coll.append("world");

}); // end
