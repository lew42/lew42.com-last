define(["P"], async function(require, exports, module){
////////

const P = require("P");

console.log(P);

const Test = Base.extend("Test", {
	instantiate(){
		this.ready = P();
		setTimeout(() => {
			this.ready.resolve([this]);
		}, 2000 );
	},
	then(...args){
		return this.ready.then(...args);
	}
});

const [t] = await Test();
console.log(t);

}); // end