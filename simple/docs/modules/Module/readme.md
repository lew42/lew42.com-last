eliminate define.js and create Module.js
	> can still harmonize with AMD style `define` function
	> just shifts some complexity...

# Hello




define() vs Module()??
	> two .modules scopes
	> two Module classes
	> two definitions of Module classes (messy, not simple);

solution 1:  use "new":
	new Module();

solution 2:  just concat the simple framework:
	make all the things without define?

solution 3:  hybrid
	make the Module w/o define()

We really just need the Base class...

Instead of define.js, we have Module.js, that includes Base...

And then all of simple use Module() to define modules...?

And, can we create a namespace for simple modules, so we don't have to do anything fancy?

Remove them?
	If they're globals anyway, does it matter?
	Defining modules with those names seems silly, you'd be overwriting the globals.
	But that's what a flexible framework is all about?

Namespace them?

Module(..., ["simple/View"])?
Module(..., ["//lew42.com/modules/simple/View"])?
Module(..., ["//lew42.com/modules/simple/globalize.js"])?

//lew42.com/simple/modules/globalize
//lew42.com/simple
	--> lew42.com/simple/simple.js

window.define = Module.amd_define;