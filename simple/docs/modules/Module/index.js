define(["Module", "server", "Base"], function(require, exports, module){
////////

// globalize it, for now
Module = require("Module");
Module.path = "simple/modules";

const Base = require("Base");
const Savable = Base.extend("Savable", {
	instantiate(...args){
		this.set(...args);
	},
	props: ["one", "two"],
	save(){
		if (this.localID){
			const json = this.json();
			if (json !== this._json){
				this._json = json;
				localStorage.setItem(this.localID, json);
			}
		}
	},
	set_(){
		this.save();
	},
	data(){
		const data = {};
		for (const prop of this.props){
			data[prop] = this[prop];
		}
		return data;
	},
	json(){
		return JSON.stringify(this.data());
	}
});


Module("Module/test1", function(require, exports, module){
	thing = this.local("thing", Savable({
		one: 1,
		two: 2
	}));

	console.log(thing);
});


// Module("test1", function(){
// 	return 5;
// });

// Module("test2", ["test1", "Module/local"], function(require, exports, module){
// 	const test1 = require("test1");
// 	const local = require("Module/local");
// 	console.log(test1);
// 	console.log(local);
// });

});