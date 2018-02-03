Is a Path object, then, even necessary?  It's more the .parent<ref> and .children[coll] pattern.

I was going to have Path objects, similar to my nested Route structures.  But maybe its easier to keep the .path as what it is - just a string that points to the <endpoints>.





file("*.js") -> search fs
file("*.js") -> search fs


File("yo")
	-> file.value = "yo"
	or
	-> file.path = "yo"

obj.path()
	=> this.parent.path() + this.name;

/
	/a/
		/a/one/
		/a/two/
	/b/
		/b/three/
		/b/four/

root
	root.a
		root.a.one
		root.a.two
	root.b
		root.b.one
		root.b.two

root.children[root.a, root.b]

root.a.parent === root;



Path -->
	Route(s) (url?)
	Dir(s)/File(s)
	Module(s)

Although, a path isn't even required...

route.path() == false?
file.path("/set/new/path");



Getter/Setters
Adding substantial functionality to these is probably too complex.
Also, it makes stepping much harder, right?

But, for certain things, we want to keep it as simple as possible?
* caching .path isn't terrible
* you'd just have to reset the path whenever a parent folder is moved
* doing it dynamically is way easier