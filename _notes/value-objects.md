var str = "str";

vs

var str = Str("str");
str.value === "str";

Any value object could have "and", which defaults to a truthy logical connector.

if (str){
	
}

vs 

str.then((value) => {
	// value === "str"
});

and 

if (str && another){}
vs

str.and(another).then((value) => { ... })


You could even use the await keyword for synchronous-like code, as a trick to resolve the promise to value;

(await str.and(another)) === str.and(another).value
// nah, not worth it...

But, you probably rarely need to actually access the value.
Why not just use wrappers for everything?
Automatically debugged, logged, etc...
Automatically AST'd...
Automatically way better...