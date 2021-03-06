define("mixin/set.js", function(require, exports, module){

const set = module.exports = function(...args){
	if (this._set)
		this._set(...args); // pre .set() hook

	for (const arg of args){
		// pojo arg
		if (arg && arg.constructor === Object){

			// iterate over arg props
			for (var j in arg){

				// set_*
				if (this["set_" + j]){
					this["set_" + j](arg[j]);
					// create a .set_assign() method that simply calls assign with the arg...

				// "assign" prop will just call assign
				} else if (j === "assign") {
					this.assign(arg[j]);

				} else if (this[j] && this[j].set){
					this[j].set(arg[j]);

				// existing prop is a pojo - "extend" it
				} else if (this[j] && this[j].constructor === Object){

					// make sure its safe
					if (this.hasOwnProperty(j))
						set.call(this[j], arg[j]);

					// if not, protect the prototype
					else {
						this[j] = set.call(Object.create(this[j]), arg[j]);
					}

				// everything else, assign
				} else {
					// basically just arrays and fns...
					// console.warn("what are you", arg[j]);
					this[j] = arg[j];
				}
			}

		// non-pojo arg
		} else if (this.set$){
			// auto apply if arg is array?
			this.set$(arg);

		// oops
		} else {
			console.warn("not sure what to do with", arg);
		}
	}

	if (this.set_)
		this.set_(...args); // post .set() hook

	return this; // important
};

}); // end
