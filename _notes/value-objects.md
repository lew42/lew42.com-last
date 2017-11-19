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

You would rarely need to touch the real value.  Whatever it needs to be compared against (aka any time you'd need to use the real value), whatever it needs to be assigned to, or piped to, you could use wrapped logic.

str.assign(another);
// equivalent to
str = another; // ?

if another instanceof Value, str.value = another.value;









You could even use the await keyword for synchronous-like code, as a trick to resolve the promise to value;

(await str.and(another)) === str.and(another).value
// nah, not worth it...

But, you probably rarely need to actually access the value.
Why not just use wrappers for everything?
Automatically debugged, logged, etc...
Automatically AST'd...
Automatically way better...

Automatically serialized (the entire module).
Automatically versionable/forkable/etc...


You could run modules in "preview" mode, so that it hits *all* blocks, and explores the entire potentiality of the script/module/function.

This would generate a viewable AST.