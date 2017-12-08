Module("Page", ["mixin/events.js"], function(require){

const events = require("mixin/events.js");

const Page = View.extend("Page", events, {
	instantiate(...args){
		const module = Module(...args);

		if (module.page)
			return module.page

		module.page = this;
	}
});

return Page;

});