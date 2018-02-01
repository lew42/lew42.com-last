Tree
	.children[]
	.Child
		.parent

Path extends Tree
	.parts[] vs .part?
	.match(<any>)
	.find(<any>)
		recursive match

URL
	.path


Path vs PathPart

path = "/one/two/three/"
path.one.name = "one";
path.one.parts = ["one"]

- one.two.three
- one.two.value === "/one/two/"
- one.two.name === "two"
- one.two.parts ["one", "two"]

.part --> .name


Path("/one/");
vs
Path("/one/two/three/");
and
Path("/one/two/file.ext");

.name = "one" ?
.children [] vs ["two", "three"]
or [Path("/one/two/"), Path("/one/two/three/")]

So, Path("/one/two/three/").children[2]...?

FileSystem() represents the root?
or WebRoot()

Path("") --> root?

Route vs Router

Root extends Path ?








