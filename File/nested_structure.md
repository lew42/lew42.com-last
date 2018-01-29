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

file("globby") --> returns a representation of the matched file system set
	* if the files are cached, they're ready to be used
	* if not, they need to be loaded?
		-> requires you to check it
		-> maybe you auto-load if it hasn't been?
			-> depends... do it manually for a while

File("path") -> uses "path" and represents a single file; may or may not exist

File("path").exists => t/f

File("path").set("str").save();
	-> may use localStorage, websockets, etc

Dir("path") -> represents a single dir path, whether it exists or not
Dir("path").exists => t/f
Dir("path").mkdir("name");
	-> syncing?

file/dir.sync(); --> all changes persist to fs; throws error if connection breaks or something

Dir("path").mkdir("")