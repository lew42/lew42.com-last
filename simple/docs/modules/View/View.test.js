define("View/View.test.js", ["View", "Test"], function(View, Test){

View.test = function(View){
	var assert = Test.assert;
	Test.controls();

	Test("basic", function(){

		// one
		var one = View("hello world");

		assert(one.el.outerHTML === "<div>hello world</div>");
		assert(one.addClass("one") === one);
		assert(one.el.outerHTML === '<div class="one">hello world</div>');
	

		// two
		var two = View().append("hello world");
		assert(two.el.outerHTML === "<div>hello world</div>");
		

		// three
		var three = View(View("hello"), View("world")).addClass("wrapped");
		assert(three.el.outerHTML === '<div class="wrapped"><div>hello</div><div>world</div></div>');
	

		// four
		var four = View(function(){
			View("hello");
			View("world");
		});
		assert(four.el.outerHTML === '<div><div>hello</div><div>world</div></div>');

		View().append(function(){
			return Date.now();
		});

		View({
			prop: 123,
			method: function(){
				return this.prop;
			},
			render: function(){
				this.append(this.method());
			}
		});
	});

	Test("append object", function(){
		View().append({
			one: "one",
			two: ["t", "w", "o"],
			three: View({tag: "span"}, "three"),
			four: View("four").addClass("four-two"),
			five: function(){
				View("fi");
				View("ve");
			},
			six: {
				a: "a",
				b: View({tag: "button"}, "b")
			}
		});
	});
};

// var viewTests = View(function(){

// View().append({
// 	one: "one",
// 	two: ["t", "w", "o"],
// 	three: View({tag: "span"}, "three"),
// 	four: View("four").addClass("four-two"),
// 	five: function(){
// 		View("fi");
// 		View("ve");
// 	},
// 	six: {
// 		a: "a",
// 		b: View({tag: "button"}, "b")
// 	}
// });

// });

// document.body.appendChild(viewTests.el);
// console.log("View.tests.js");

});