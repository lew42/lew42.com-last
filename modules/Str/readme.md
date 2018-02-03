How do we... auto-group?

abc -fork-> axbc

StringObject is just value object... 
We could just change the .value, so that we have a new value...

And we could leave it at that - until you manually group something, it just stores as literals, doing nothing unexpected.

If you upgrade a piece to a group, then you're effectively

abcdef -group: cd-> ab[cd]ef
But, this is a StringGroup with [ab][cd][ef]
Yea, this makes sense...
You don't want ["ab", [cd], "ef"] in the group
You want [SO("ab"), SO("cd"), SO("ef")]

StringObject and StringGroup
	* singular vs plural
	* singular is upgraded if desired
	* StringGroup is just a set of StringObjects and StringGroups
	* upgrading a StringObject to StringGroup is wrapping, not morphing

StringComposition
	Compositions can act like objects - they can optionally be ordered, but they're basically the append({ name: value}), where the value likely gets upgraded...

# StrObj

Naming is such a bitch.  StringObject, StringList, just Str?

## Str extends StrObj

Str() will be a shorthand for auto-append.
Str({ one: "one", two: "two" }) will auto append, upgrading literals to StrObj (instead of assign);

## Stashed that experimental commit

And now we can keep working, with a nice bookmark to go back to...