read, write, watch


new File() // does not yet exist, start transforming
vs
new File("dne.ext") // does not yet exist, start transforming
vs
new File("file.ext") // exists, start transforming, and auto save?

## mutable vs immutable

str.append("yo") === str?

### mutable, object oriented
allows a reference to the object to remain in tact

### immutable, not oo
always produce a new object.  always be assured the immutable objects retain the same value.

## obj.do("action", a, r, g, s);

client side:
file.do("save");
--> debug mode?
	pause execution
	wait for user to continue

	send action to server
	allow server to pause, relaying any debug info back to client
	when user continues, move to next action

It's basically a client-server ping pong game, where we enable either end to pause at any point.

The trick is, on the server, we need to constantly relay this information back to the client, in order to display the debug controls...

