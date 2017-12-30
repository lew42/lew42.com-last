define("View", 
	["Base", "is"],
	function(require, exports, module){

const is = require("is");
const Base = require("Base");

/*
todo:  allow .set_classes to accept an object
View({
	classes: {
		promise_like: thing.then(...) // use first arg as boolean to add/remove "promise_like" class
		event_like: thing.on("whatever") // could return a "thenable"
	}
});

You could automatically classify any thenable property..
View(thing.on("active"))
	--> view.thing = the event
		or view.active...
	--> as a thenable, we classify the "thing" class...
*/

const View = module.exports = Base.extend({
	name: "View",
	tag: "div",
	instantiate(...args){
		this.render_el(args[0] && args[0].tag);
		this.set(...args);
		this.append_fn(this.render);
		this.initialize();
	},
	initialize: function(){
		this.init();
	},
	init: function(){},
	render: function(){},
	render_el: function(tag){
		if (!this.hasOwnProperty("el")){
			this.el = document.createElement(tag || this.tag);

			View.captor && View.captor.append(this);

			this.classes && this.addClass(this.classes);
		}
	},
	// set_tag(tag){
	// 	if (tag !== this.tag){
	// 		this.tag = tag;
	// 		delete this.el;
	// 		this.render_el();
	// 	}
	// },
	set$(arg){
		if (is.pojo(arg)){
			console.error("do you even happen?");
			this.assign(arg);
		} else {
			this.append(arg);
		}
	},
	set(...args){
		var hasBeenEmptied = false;
		for (const arg of args){
			// empty once if .set() will .append()
			if (!is.pojo(arg) && !hasBeenEmptied){
				this.empty();
				hasBeenEmptied = true;
			}

			// the default .set() that we've overridden
			Base.prototype.set.call(this, arg);
		}
		return this;
	},
	append(...args){
		for (const arg of args){
			if (arg && arg.el){
				arg.parent = this;
				this.el.appendChild(arg.el);
			} else if (is.pojo(arg)){
				this.append_pojo(arg);
			} else if (is.obj(arg)){
				this.append_obj(arg);
			} else if (is.arr(arg)){
				this.append.apply(this, arg);
			} else if (is.fn(arg)){
				this.append_fn(arg);
			} else {
				// DOM, str, undefined, null, etc
				this.el.append(arg);
			}
		}
		return this;
	},

	append_fn(fn){
		View.set_captor(this);
		var value = fn.call(this, this);
		View.restore_captor();

		if (is.def(value))
			this.append(value);
	},

	append_pojo(pojo){
		if (pojo.path){
			this.append_path(pojo);
		} else {
			for (var prop in pojo){
				this.append_prop(prop, pojo[prop]);
			}
		}
	},

	append_obj(obj){
		if (obj.render){
			this.append(obj.render())
		} else {
			console.warn("not sure here");
		}
	},

	append_prop(prop, value){
		var view;
		if (value && value.el){
			view = value;
		} else {
			view = (new View({tag: this.tag})).append(value);
		}

		this[prop] = view
			.addClass(prop)
			.appendTo(this);

		return this;
	},

	append_path(path){
		console.warn("experimental...");
		if (is.obj(path) && path.path){
			if (path.target){
				this.path(path.target).append(this.path(path.path));
			} else {
				this.append(this.path(path.path));
			}
		}

		return this;
	},

	path(path){
		var parts, value = this;
		if (is.str(path)){
			parts = path.split(".");
		} else if (is.arr(path)) {
			parts = path;
		}

		if (parts[0] === ""){
			parts = parts.slice(1);
		}

		if (parts[parts.length - 1] === ""){
			console.warn("forgot how to do this");
		}

		for (var i = 0; i < parts.length; i++){
			value = value[parts[i]];
		}

		return value;
	},

	appendTo(view){
		if (is.dom(view)){
			view.appendChild(this.el);
		} else {
			view.append(this);
		}
		return this;
	},

	addClass(){
		var arg;
		for (var i = 0; i < arguments.length; i++){
			arg = arguments[i];
			if (is.arr(arg))
				this.addClass.apply(this, arg);
			else if (arg.indexOf(" ") > -1)
				this.addClass.apply(this, arg.split(" "));
			else
				this.el.classList.add(arg);
		}
		return this;
	},

	removeClass(className){
		var arg;
		for (var i = 0; i < arguments.length; i++){
			arg = arguments[i];
			if (is.arr(arg))
				this.removeClass.apply(this, arg);
			else if (arg.indexOf(" ") > -1)
				this.removeClass.apply(this, arg.split(" "));
			else
				this.el.classList.remove(arg);
		}
		return this;
	},

	hasClass(className){
		return this.el.classList.contains(className);
	},

	attr(name, value){
		this.el.setAttribute(name, value);
		return this;
	},

	click(cb){
		this.el.addEventListener("click", cb.bind(this));
		return this;
	},

	set_click(cb){
		this.click(cb);
	},

	on(event, cb){
		var bound = cb.bind(this);
		this.el.addEventListener(event, bound);
		return bound; // so you can remove it
	},

	off(event, cb){
		this.el.removeEventListener(event, cb);
		return this; //?
	},

	empty(){
		this.el.innerHTML = "";
		return this;
	},

	focus(){
		this.el.focus();
		return this;
	},

	show(){
		this.el.style.display = "";
		return this;
	},

	styles(){
		return getComputedStyle(this.el);
	},

	// inline styles
	style(prop, value){
		// set with object
		if (is.obj(prop)){
			for (var p in prop){
				this.style(p, prop[p]);
			}
			return this;

		// set with "prop", "value"
		} else if (prop && is.def(value)) {
			this.el.style[prop] = value;
			return this;

		// get with "prop"
		} else if (prop) {
			return this.el.style[prop];

		// get all
		} else if (!arguments.length){
			return this.el.style;
		} else {
			throw "whaaaat";
		}
	},

	toggle(){
		if (this.styles().display === "none")
			return this.show();
		else {
			return this.hide();
		}
	},

	index(){
		var index = 0, prev;
		// while (prev = this.el.previousElementSibling)
	},

	hide(){
		this.el.style.display = "none";
		return this;
	},

	remove(){
		this.el.parentNode && this.el.parentNode.removeChild(this.el);
		return this;
	},

	editable(remove){
		remove = (remove === false);
		const hasAttr = this.el.hasAttribute("contenteditable");

		if (remove && hasAttr){
			console.warn(this.el, "remove ce");
			this.el.removeAttribute("contenteditable");
		} else if (!remove && !hasAttr) {
			console.warn(this.el, "add ce");
			this.attr("contenteditable", true)
		}
		return this;
	},

	value(){
		// get&set?
		return this.el.innerHTML;
	}
});

View.assign({
	previous_captors: [],
	set_captor: function(view){
		this.previous_captors.push(this.captor);
		this.captor = view;
	},
	restore_captor: function(){
		this.captor = this.previous_captors.pop();
	}
});

View.V = View.extend("V", {
	instantiate(...args){
		this.smart_tag(args);
		this.render_el();
		this.append(...args);
		this.initialize();
	},
	smart_tag(args){
		const token = args[0];
		if (is.str(token) && token.indexOf(" ") === -1){
			if (token.indexOf("span") === 0){
				this.tag = "span";
				this.smart_classes(token);
				args.shift();
			} else if (token.indexOf(".") === 0){
				this.smart_classes(token);
				args.shift();
			}
		}
	},
	smart_classes(token){
		this.classes = token.split(".").slice(1);
	}
});

View.Span = View.extend("Span", {
	tag: "span"
});

}); // end
