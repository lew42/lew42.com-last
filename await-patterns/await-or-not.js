// await
await request();

// or not to wait
request();

/*
Just because a function returns a promise, and can be awaited, doesn't mean you always want to do that.

Awaiting delays all the subsequent code...

But, you likely want to do some more things synchronously, and only some things asynchronously.

So how do you make the request, and do only some things synchronously?
*/

const result = request();

doMeNow();

result = await result;

doMeLater();

/*
But, I suppose code around doMeNow() isn't dependent on making the request, and could have been done before, or externally.

So then you have the option of using async with sync.
*/

// in a synchronous function (can't use await)

var p = asyncFn(); // always returns a promise

// error
await asyncFn2(); // error, can't await inside normal functions

// we can create anonymous async functions
wtf(async function(){
	// now we can await, but does "async" necessitate "await"
	// in other words, if we don't "await", should we just use a normal synchronous function?
	// no, there are many advantages to async functions, aside from the opportunity to await
		// automatic async error handling
			// in this case, wtf can use this async function.  I'm not sure exactly how yet
			// but, thrown errors will be automatically caught
		// automatic promise creation
			// 
});