var gulp = require("gulp");
gulp.concat = require("gulp-concat");
gulp.ejs = require("gulp-ejs");
gulp.util = require("gulp-util");
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var concat = require("gulp-concat");

var express = require("express");
var livereload = require("./livereload");

var http = require("http");
var chokidar = require("chokidar");
var WebSocket = require("ws");

const service = require("./service");

const moduleFiles = require("./Module/order.js");

const sites = [
	"rtpovcoll",
	"modules"
];

var reloadWatchGlobs = [
	"./lew42.github.io",
	"./simple/docs",
	"./define/docs",
	"!**/*.css",
	"!.git", "!**/.git"
];

for (const site of sites){
	reloadWatchGlobs.push("./"+site);
}

var server = function(){

	var app = express();

	app.use("/simple/", express.static(__dirname + "/simple/docs"));
	app.use("/define/", express.static(__dirname + "/define/docs"));
	// app.use("/rtpovcoll/", express.static(__dirname + "/rtpovcoll/docs"));

	for (const site of sites){
		app.use("/"+site+"/", express.static(__dirname + "/"+site));
	}
	
	app.use(express.static(__dirname + "/lew42.github.io"));

	var server = http.createServer(app);
	var wss = new WebSocket.Server({
		perMessageDeflate: false,
		server: server
	});

	wss.on("connection", function(ws){
		console.log("connected");
		// console.log(ws);
		// console.log(ws._socket);

		service(ws);

		chokidar.watch(reloadWatchGlobs).on("change", (e) => {
			console.log(e, "changed, sending reload message");
			ws.send("reload", (err) => {
				if (err) console.log("livereload transmit error");
				else console.log("reload message sent");
			});
		});
	});

	server.listen(80, function(){
		console.log("Listening..");
	});
};


// gulp.task("default", function(){
// 	return gulp.src("./lew42.github.io/lew42.ejs")
// 		.pipe(gulp.ejs({
// 			msg: "hello world"
// 		}, {}, { ext: ".js" }).on("error", gulp.util.log))
// 		.pipe(gulp.dest("./lew42.github.io"))
// });
const definePaths = [];
for (const filename of require("./define/docs/0rder.js")){
	definePaths.push(__dirname + "/define/docs/" + filename);
}
gulp.task("build-define", function(){
	return gulp.src(definePaths)
		.pipe(concat("define.js"))
		.pipe(gulp.dest(__dirname + "/define/docs/"))
		.pipe(gulp.dest(__dirname + "/simple/docs/"))
		.pipe(gulp.dest(__dirname + "/lew42.github.io/"));
});



var simpleModule = function(name){
	return __dirname + "/simple/docs/modules/" + name + "/" + name + ".js";
};

var simpleGlobs = [
	__dirname + "/simple/docs/define.js",

	simpleModule("logger"),
	__dirname + "/simple/docs/modules/Base/Base0/Base0.js",
	__dirname + "/simple/docs/modules/mixin/events.js",
	__dirname + "/simple/docs/modules/mixin/set.js",
	simpleModule("Base"),
	// simpleModule("docReady"),
	simpleModule("is"),
	// simpleModule("Base"),
	simpleModule("mixin"),
	__dirname + "/simple/docs/modules/Module/local/local.js",
	simpleModule("Module"),
	simpleModule("View"),
	simpleModule("Test"),
	simpleModule("server"),
	simpleModule("simple")
];

gulp.task("watch", function(){
    gulp.watch(definePaths, ['build-define']);
	gulp.watch(simpleGlobs, ['build-simple'])
});


gulp.task("build-simple", ["build-define"], function(){
	return gulp.src(simpleGlobs)
		.pipe(concat("simple.js"))
		.pipe(gulp.dest(__dirname + "/define/docs/"))
		.pipe(gulp.dest(__dirname + "/simple/docs/"))
		.pipe(gulp.dest(__dirname + "/lew42.github.io/"))
		.pipe(gulp.dest(__dirname + "/rtpovcoll/"))
});

gulp.task("default", ["build-simple", "watch"], function(){
	server();
});