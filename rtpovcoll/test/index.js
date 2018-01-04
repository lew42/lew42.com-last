Module.path = "rtpovcoll/modules";

Module(function(require, exports, module){
////////

const Mod = Base.extend("Mod", {
	instantiate(...args){
		this.set(...args);
		this.local()
	},
	local(){
		if (this.module){
			this.id = module.id + "::" + this.name;
		} else {
			this.id = this.name;
		}
		this.data = JSON.parse(localStorage.getItem(this.id)) || {};
		console.log("loaded", typeof this.data, this.data);
		if (this.data)
			this.set(this.data);
	},
	set_data(data){
		this.set.call(this.data, data);
		console.log(this.data);
		this.save();
	},
	save(){
		localStorage.setItem(this.id, JSON.stringify(this.data));
	}
});

mod = Mod({
	module: module,
	name: "mod"
});

mod.set({
	data: {
		hello: "world"
	}
})

}); // end 
