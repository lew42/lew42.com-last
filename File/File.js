const globby = require("globby");
const fs = require("pify")(require("fs"));
const chokidar = require("chokidar");

/*
Auto watch?

*/
class File {
	constructor(file){
		// this.ready = globby(glob).then(path => )
		this.file = file;
		return fs.readFile(file, "utf8").then((data) => {
			this.data = data;
			return this;
		});
	}

	append(str){
		this.data += str;
		return this;
	}

	write(){
		return fs.writeFile(this.file, this.data);
	}
	// then(...args){
	// 	return this.ready.then(...args);
	// }
}
(async function(){
	const file = await new File("./file");
	await file.append("hello").write();
	console.log("saved");
})();

// read
// stat?
// watch?
// append?

/*

const file = File("./file");
await file.load();
await File("./file").read();
 // resolves with file obj?

await File("./file");
	// can this ever return the file object?
	1. calls file.then() immediately
	2. the value returned is the value resolved by the promise returned from file.then()
	3. if you try to return the `file` obj, it is again delayed?



Circular watch -> write -> watch -> write?
Or, duplicate writing...?

Just cache the value?
When we concat 

File("./")

const file = new File();

file.append(File.watch("./define1.js"))

File("./define.js")
 	.concat(File("./log.js"))
 	.concat(");")
 	.concat(File("./auto/*").join())
 	.write("../lew42.github.io/simple.js");


File("./dne.ext")
	.append(File("./one.js"))
	.append(File("./two.js"))
	.append(File("./*.js"))
	.write();

File()
	.append(File("./one.js"))
	.append(File("./two.js"))
	.append(File("./*.js"))
	.write("/new.js");

*/