Module("Test", ["Base2", "View"], function(require){

	var Base2 = require("Base2");
	var View = require("View");
	
	var stylesheet = View({tag: "link"})
		.attr("rel", "stylesheet")
		.attr("href", "/simple/modules/Test/Test.css");
	document.head.appendChild(stylesheet.el);



	var TestView = View.extend({

	});

	var body = View({
		el: document.body
	});

	var Test = Base2.extend({
		instantiate: function(name, fn){
			this.name = name;
			this.fn = fn;

			this.pass = 0;
			this.fail = 0;

			this.container = this.container || body;

			this.initialize();
		},
		initialize: function(){
			if (this.shouldRun())
				this.render();
		},
		render: function(){
			this.view = View().addClass('test').append({
				bar: View(this.label()).click(this.activate.bind(this)),
				content: View(),
				footer: View()
			});

			this.view.content.append(this.exec.bind(this));

			this.view.addClass("active");

			if (this.pass > 0)
				this.view.footer.append("Passed " + this.pass);
			if (this.fail > 0)
				this.view.footer.append("Failed " + this.fail);

			if (!this.view.parent)
				this.view.appendTo(this.container);
		},
		activate: function(){
			window.location.hash = this.name;
			window.location.reload();
		},
		label: function(){
			return (this.match() ? "#" : "") + this.name;
		},
		exec: function(){
			console.group(this.label());
			
			Test.set_captor(this);

				// run the test
				this.fn();

			Test.restore_captor();
			console.groupEnd();
		},
		assert: function(value){
			if (value){
				this.pass++;
			} else {
				console.error("Assertion failed");
				this.fail++;
			}
		},
		shouldRun: function(){
			return !window.location.hash || this.match();
		},
		match: function(){
			return window.location.hash.substring(1) === this.name;
		}
	});

	Test.assign({
		previous_captors: [],
		set_captor: function(view){
			this.previous_captors.push(this.captor);
			this.captor = view;
		},
		restore_captor: function(){
			this.captor = this.previous_captors.pop();
		},
		assert: function(value){
			if (Test.captor)
				Test.captor.assert(value);
			else
				console.error("whoops");
		},
		controls: function(){
			var controls = View().addClass("test-controls").append({
				reset: View({tag:"button"}, "reset").click(function(){
					Test.reset();
				})
			});
			document.body.appendChild(controls.el);
		},
		reset: function(){
			window.location.href = window.location.href.split('#')[0];
		}
	});

	window.addEventListener("hashchange", function(){
		window.location.reload();
	});
	console.warn("auto refresh on window.hashchange event?");

	return Test;
});