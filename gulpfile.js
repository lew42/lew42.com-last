var gulp = require("gulp");
gulp.concat = require("gulp-concat");
gulp.ejs = require("gulp-ejs");
gulp.util = require("gulp-util");

gulp.task("default", function(){
	return gulp.src("./lew42.github.io/lew42.ejs")
		.pipe(gulp.ejs({
			msg: "hello world"
		}, {}, { ext: ".js" }).on("error", gulp.util.log))
		.pipe(gulp.dest("./lew42.github.io"))
});