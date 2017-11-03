/*
Basically an array of .parts?
.append("part", "/part", "part/", "/part/", "multi/part/")
.append("one", "two") ==> one/two
.append(["one", "two"], "three") => one/two/three

.match("one/two/three")
.match(anotherPath)
.match(["one", "two", "three"])
	// does this path match the input?

.find("one/two")
	// return false || truthy
	// if found, return that "part" ?

Basic version: use "string" literals as the parts.
Path.parts = ["liter", "als"];

Advanced functionality (like a router, or directory, or something): use objects as the parts.
Path.parts = [Route, Route, Route], 
where each Route has a .part
	the ".part" is relative to parent
but each Route is standalone, and has a .path()
	where the .path() is absolute?


Maybe, then, a Path that can have a tree of parts...

path.one.two
path.one.three

Is more like a Tree/Directory

A "Tree" could be defined as a system in which each item has a single parent, except for the Root (tree trunk), which doesn't have a parent.

A parent can have any number of children...  And the order doesn't matter so much (can be sorted, filtered, etc).  

The only real requirement is that you have only 1 parent?

What about a Directory?  Or, loosening that requirement?

Basically, tree.one.sub === tree.two.sub
Nothing really changes here, except .sub has two parents.


*/
var Path = Base.extend({

});

/*
Basically, any set of items with .parent reference.
But, any of these could be extended to any number of properties?
	.parentA and .parentB
or
	.parents[]
or
	.parents[], .otherRelatives[], .alternatives[]

Any "sets" of referential data
But, if you stick with .parent concept, you probably have a bunch of functionality that operates with a single pair

tree.each(thing => thing.parent)
If each thing in the tree has a single parent...

Yet, if we consider a Tree as an "iterator",
then we could have any custom iterators...

Like a Tree, or Lists, or Lists of Lists that are instructed to either
a) loop through all 1st level items, then all 2nd level, etc
b) loop through each item, and then its children, before proceeding to the next item
*/
var Tree = Base.extend({

});