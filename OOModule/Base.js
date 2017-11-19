class Base {
	constructor(){

	}
}

// !!! can't call Base() without new, throws error from top level... so stupid

// So, we just use wrapper functions...

// no, they're just `const`

// So, to use a wrapper function to avoid `new`, we just have to explicitly create that.  

/*

You could return () => { return new Base(...args); },
but then you don't get instanceof or static props.

You could have Base { static new(){} }

You'd have to always bind .new to the class...  So lame.

const Base = require("Base").new.bind(...)

You'd have to import in 2 steps.  So lame.

module.exports = class Thing extends Another {
	...
}

or

module.exports = Thing.new.bind(Thing);

or

Thing.new = Thing.new.bind(Thing);
module.exports = Thing;

then you can

require("Thing").new;

and use Thing() without new.

Fucking jerks.


*/