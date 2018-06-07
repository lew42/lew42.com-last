import is from "./is.js";

function parseToken(token){
	if (!token)
		return {};

	const parts = token.split(".");
	const results = {};

	if (parts[0] !== "")
		results.tag = parts.shift();

	if (parts.length)
		results.classes = parts.join(" ");

	return results;
}

export function thing(){} 

export default class View {
	constructor(...args){
		this.assign(...args);
		this.prerender();
		this.append(this.render);
		this.initialize();
	}

	prerender(){
		this.el = document.createElement(this.tag);
		View.captor && View.captor.append(this);
		this.classes && this.addClass(this.classes);
	}

	render(){}

	initialize(){}

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
	}

	append_fn(fn){
		View.set_captor(this);
		const returnValue = fn.call(this, this);
		View.restore_captor();

		if (is.def(returnValue))
			this.append(returnValue);

		return this;
	}

	append_pojo(pojo){
		for (const prop in pojo){
			this.append_prop(prop, pojo[prop]);
		}
		
		return this;
	}

	append_prop(prop, value){
		var view;
		if (value && value.el){
			view = value;
		} else {
			view = (new this.constructor()).append(value);
		}

		this[prop] = view.addClass(prop).appendTo(this);

		return this;
	}

	appendTo(view){
		if (is.dom(view)){
			view.appendChild(this.el);
		} else {
			view.append(this);
		}
		return this;
	}
	
	addClass(classes){
		classes && classes.split(" ").forEach(cls => this.el.classList.add(cls));
		return this;
	}

	removeClass(classes){
		classes && classes.split(" ").forEach(cls => this.el.classList.remove(cls));
		return this;
	}

	hasClass(cls){
		return this.el.classList.contains(cls);
	}

	attr(name, value){
		if (is.def(value)){
			this.el.setAttribute(name, value);
			return this;
		} else {
			return this.el.getAttribute(name);
		}
	}

	click(cb){
		return this.on("click", cb);
	}

	on(event, cb){
		this.el.addEventListener(event, (...args) => {
			cb.call(this, this, ...args);
		});

		return this;
	}

	removable(event, cb){
		const wrapper = (...args) => {
			cb.call(this, this, ...args);
		};

		this.el.addEventListener(event, wrapper);

		return () => {
			this.el.removeEventlistener(event, wrapper);
		};
	}

	empty(){
		this.el.innerHTML = "";
		return this;
	}

	focus(){
		this.el.focus();
		return this;
	}

	show(){
		this.el.style.display = "";
		return this;
	}

	styles(){
		return getComputedStyle(this.el);
	}

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
	}

	toggle(){
		if (this.styles().display === "none")
			return this.show();
		else {
			return this.hide();
		}
	}

	index(){
		var index = 0, prev;
		// while (prev = this.el.previousElementSibling)
	}

	hide(){
		this.el.style.display = "none";
		return this;
	}

	remove(){
		this.el.parentNode && this.el.parentNode.removeChild(this.el);
		return this;
	}

	editable(remove){
		remove = (remove === false);
		const hasAttr = this.el.hasAttribute("contenteditable");

		if (remove && hasAttr){
			// console.warn(this.el, "remove ce");
			this.el.removeAttribute("contenteditable");
		} else if (!remove && !hasAttr) {
			// console.warn(this.el, "add ce");
			this.attr("contenteditable", true)
		}
		return this;
	}

	value(){
		// get&set?
		return this.el.innerHTML;
	}

	assign(...args){
		Object.assign(this, ...args);
		return this;
	}

	static get el(){
		const self = this; // bind to current class
		return this._el || (this._el = function el(token, ...args){
			if (!token) throw "must provide element token";
			const tokenResults = parseToken(token);
			return new self({ tag: tokenResults.tag })
				.addClass(tokenResults.classes)
				.append(...args);

		});
	}

	static get package(){
		return {
			a: "a",
			b: "b"
		}
	}

	static set_captor(view){
		View.previous_captors.push(View.captor);
		View.captor = view;
	}

	static restore_captor(){
		View.captor = View.previous_captors.pop();
	}
}

View.previous_captors = [];


const el = View.el;
export { el }

View.prototype.tag = "div";

console.log(View.prototype);

/*

new View({ assign })
div(".class.es", { append });
el("tag.class.es", { append }, self => {});



extend View if you need methods, otherwise View is setup to append everything?

Or, maybe the basic View is as lean as possible?

Instead of trying to define all the things...?

view.section(view.h1("Section Title"), view.p(view.filler()));

It's either:

el("section.five", "Contents");
el("input", { type: "email" });


h1(), h2(), h3(), p(), span(), ul(li(), li(), li())...?
el("h1.whatever", "contents");
el("h2", "contents")
el("ul", el("li", contents), el("li"))

v.h1()

const { h1, h2, h3, p, span, ul, li, etc } = View;

then, h1(".class.es", "contents")

Section("Contents").addClass("five");


v("span" || "div")
	.addClass("one two")
	.append()

V(".parent", parent => {
	parent.thing = V(".thing", thing => {
		// parent.thing isn't available yet

	});

	parent.append({
		thing: V("content?")
	})

	parent.append({});
});

const parent = V(".parent");

parent.append({
	thing: V(function(){
		this === parent.thing; // nope, parent.thing reference won't be ready
			// but, parent has been assigned at this point...
	})
});

V(".parent", {
	thing: Icon("beer")
});

V(".parent").append({
	thing: V(".extra.classes", "content").click(thing => {
		// how do we get 
	});
});



*/