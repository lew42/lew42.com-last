Module("tests/module-data/data/data.js", 
	["./data.json"], async function(require, exports, module){

const data = require("./data.json");
module.exports = await Promise.all(data.deps.map(dep => this.import(dep)));
console.log(module.exports);
});