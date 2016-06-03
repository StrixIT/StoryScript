/// <binding ProjectOpened='ts-watch' />

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    ts = require('gulp-typescript'),
    //tslint = require("gulp-tslint"),
    merge = require('merge'),
    sourcemaps = require('gulp-sourcemaps'),
    shell = require('gulp-shell'),
    project = require("./project.json");

var paths = {
    webroot: "./" + project.webroot + "/",
    root: "./"
};

paths.js = paths.webroot + "js/**/*.js";
//paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
//paths.minCss = paths.webroot + "css/**/*.min.css";
//paths.concatJsDest = paths.webroot + "js/site.js";
//paths.concatJsDestMin = paths.webroot + "js/site.min.js";
//paths.concatCssDest = paths.webroot + "css/site.min.css";
paths.tsSource = paths.root + 'Scripts/**/*.ts';
paths.tsDef = paths.webroot + "js/types/**/*.ts";
//paths.bower = "./bower_components/";
paths.jsLib = "./" + project.webroot + "/js/lib/";
paths.cssLib = "./" + project.webroot + "/css/lib/";

gulp.task("clean:js", function (cb) {
    rimraf(paths.jsLib, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.cssLib, cb);
});

var tsProject = ts.createProject('tsconfig.json');

gulp.task("clean-html", function (cb) {
    return rimraf(paths.webroot + '**/*.html', cb);
});

gulp.task('copy-dangerous-cave-css', ["clean-html"], function () {
    gulp.src([paths.root + 'Scripts/DangerousCave/ui/styles/*.css'])
        .pipe(gulp.dest(paths.webroot + 'css'));
});

gulp.task('copy-dangerous-cave-html', ["clean-html"], function () {
    gulp.src([paths.root + 'Scripts/DangerousCave/**/*.html', paths.root + 'Scripts/StoryScript/**/*.html'])
      .pipe(gulp.dest(paths.webroot));
});

gulp.task('ts-compile-dangerous-cave', function () {
    var tsResult = gulp.src([paths.root + 'Scripts/Library/**/*.ts', paths.root + 'Scripts/StoryScript/**/!(app)*.ts', paths.root + 'Scripts/StoryScript/app.ts', paths.root + 'Scripts/DangerousCave/**/*.ts', 'Scripts/Types/**/*.ts'], { base: paths.root + 'Scripts' })
                        .pipe(sourcemaps.init())
                        .pipe(ts(tsProject));

    return merge([
        tsResult.js.pipe(sourcemaps.write('../maps')).pipe(gulp.dest(paths.webroot + 'js'))
    ]);
});

gulp.task('build-dangerous-cave', ["copy-dangerous-cave-css", "copy-dangerous-cave-html", 'ts-compile-dangerous-cave'], function () { });

gulp.task("tslint", () =>
    gulp.src([paths.root + 'Scripts/StoryScript/app.js', paths.root + 'Scripts/DangerousCave/**/*.js'])
        .pipe(tslint())
        .pipe(tslint.report("verbose"))
);

gulp.task('ts-compile-path-of-heroes', function () {
    var tsResult = gulp.src([paths.root + 'Scripts/Library/**/*.ts', paths.root + 'Scripts/StoryScript/**/!(app)*.ts', paths.root + 'Scripts/StoryScript/app.ts', paths.root + 'Scripts/PathOfHeroes/**/*.ts', 'Scripts/Types/**/*.ts'], { base: paths.root + 'Scripts' })
                        .pipe(sourcemaps.init())
                        .pipe(ts(tsProject));

    return merge([
        tsResult.js.pipe(sourcemaps.write('../maps')).pipe(gulp.dest(paths.webroot + 'js'))
    ]);
});

gulp.task('ts-watch', function () {
    gulp.watch(paths.root + 'Scripts/**/*.ts', ['ts-compile-dangerous-cave']);
});