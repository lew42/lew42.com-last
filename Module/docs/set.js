var set = function(){
	var arg;
	for (var i = 0; i < arguments.length; i++){
		arg = arguments[i];

		// pojo arg
		if (is.pojo(arg)){

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
				// assign
				} else if (is.simple(this[j])){
					this[j] = arg[j];

				// allow overrides
				} else if (this[j] && this[j]._set_sub){
					this[j] = this[j]._set_sub(arg[j], this, j);

					// if (parent !hasOwn)
						// if parent.prop.clone, then clone it
						// else, throw
					// if (incoming data is an instance, override)
					// if (parent has own, and parent.prop.set, then use that)

				// recursive protect/set
				} else if (this[j] && this[j].set) {
					// readopt?
					// only auto-clone non-references (aka, direct children)
					// if you set against a reference, it should probably throw an error... you shouldn't ever modify references with .set... 
					if (this.hasOwnProperty(j) || !this[j].clone)
						this[j].set(arg[j]);
					else
						this[j] = this[j].clone(arg[j]);

				// existing prop is a pojo - "extend" it
				} else if (is.pojo(this[j])){
					if (this.hasOwnProperty(j))
						set.call(this[j], arg[j]);
					else {
						this[j] = setfn1.call(Object.create(this[j]), arg[j]);
					}

				// everything else, assign
				} else {
					// basically just arrays and fns...
					// console.warn("what are you", arg[j]);
					this[j] = arg[j];
				}
			}

		// non-pojo arg
		} else if (this.set_value){
			// auto apply if arg is array?
			this.set_value(arg);

		// oops
		} else {
			console.warn("not sure what to do with", arg);
		}
	}

	return this; // important
};

module.exports = set;