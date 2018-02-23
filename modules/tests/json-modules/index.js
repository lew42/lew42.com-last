Module("tests/json-modules/index.js", ["./test1.json"], function(require, exports, module){
////////

const test1 = require("./test1.json");
console.log(test1);

}); // end