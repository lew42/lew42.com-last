while (true){
	await this.click; // or await this.on("click");
	this.jump();
}

// could you extract the `while (true)` part?

this.on("click", async function(){
    await this.on("active");
    // click handler
});

// but, why would you while(true) this, and not just re-call the async function for every emit("click")?

// and, doesn't it make more sense to do something like: 

this.on("click").and("active");

// how about

await this.on("click").and("active"); // ???


/*
Nope!  Well, sometimes (if you only want the next one).  But this won't work for repeatable things, like click events.  Unless you while (true) it (not always a great idea).

And so, the only real solution, is a custom Async "thenable" system that can handle all the cases

*/

// this.click and this.active are "thenables"
this.click.and(this.active).then(function(){
	// repeat this every time this condition becomes true
		// this is basically, for every click while the state is active
});

// this is equivalent to
this.click.then(function(){
	if (this.active){ // if active were a boolean
		// ...
	}
});

// but, in the above example, where .active is a boolean, you lose a ton of functionality
this.active.then(); // let me hook into changes
	// this should probably only be fired when active ==> true
	// should this be fired if you re-activate?  depends, should be configurable

/*
Normal promises don't have .and, etc, but they could be wrapped?

Extending standard synchronous methods with asynchronous ones?
* coll.map()
* coll.each()

I guess, this is for handling a collection of values.


*/