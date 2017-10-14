define("mixin/events.js", function(){

return {
	on: function(event, cb){
		this.events = this.events || {}; // init, if not already present
		var cbs = this.events[event] = this.events[event] || [];
		cbs.push(cb);
		return this;
	},
	emit: function(event){
		var cbs = this.events && this.events[event];
		if (cbs && cbs.length){
			for (var i = 0; i < cbs.length; i++){
				cbs[i].apply(this, [].slice.call(arguments, 1));
			}
		} else {
			console.warn("no events registered for", event);
		}
		return this;
	}
};

});
