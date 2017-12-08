const events = {
	on(event, cb){
		this.events = this.events || {}; // init, if not already present
		const cbs = this.events[event] = this.events[event] || [];
		cbs.push(cb);
		return this;
	},
	emit(event, ...args){
		const cbs = this.events && this.events[event];
		if (cbs && cbs.length){
			for (var i = 0; i < cbs.length; i++){
				cbs[i].apply(this, ...args);
			}
		}
		return this;
	},
	off: function(event, cbForRemoval){
		const cbs = this.events && this.events[event];
		if (cbs && cbs.length){
			for (var i = 0; i < cbs.length; i++){
				if (cbs[i] === cbForRemoval){
					cbs.splice(i, 1);
				}
			}
		}
		return this;
	}
};