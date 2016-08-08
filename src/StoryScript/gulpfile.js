/// <binding ProjectOpened='ts-watch' />

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    ts = require('gulp-typescript'),
    //tslint = require("gulp-tslint"),
    merge = require('merge'),
    sourcemaps = require('gulp-sourcemaps'),
    shell = require('gulp-shell'),
    project = require("./project.json");
del = require('del');

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

//gulp.task("tslint", () =>
//    gulp.src([paths.root + 'Scripts/StoryScript/app.js', paths.root + 'Scripts/DangerousCave/**/*.js'])
//        .pipe(tslint())
//        .pipe(tslint.report("verbose"))
//);

var tsProject = ts.createProject('tsconfig.json');

gulp.task('build-game-template', ['delete-files'], buildGame('_GameTemplate'));
gulp.task('build-my-new-game', ['delete-files'], buildGame('MyNewGame'));
gulp.task('build-dangerous-cave', ['delete-files'], buildGame('DangerousCave'));
gulp.task('build-quest-for-the-king', ['delete-files'], buildGame('QuestForTheKing'));
gulp.task('build-path-of-heroes', ['delete-files'], buildGame('PathOfHeroes'));
gulp.task('build-ridder-magnus', ['delete-files'], buildGame('RidderMagnus'));

gulp.task('delete-files', function () {
    del([paths.webroot + 'locations/**/*', paths.webroot + 'resources/**/*', paths.webroot + 'ui/**/*']);
});

gulp.task('ts-watch', function () {
    gulp.watch(paths.root + 'Scripts/**/*.ts', ['build-dangerous-cave']);
});

function buildGame(nameSpace) {
    return function () {
        copyLibraries();

        copyResources(nameSpace);
        copyCss(nameSpace);
        copyHtml(nameSpace);
        compileTypeScript(nameSpace);
    }
}

function copyLibraries() {
    gulp.src([paths.root + 'Scripts/StoryScript/Libraries/**/*.js'])
        .pipe(gulp.dest(paths.webroot + 'js/lib'));

    gulp.src([paths.root + 'Scripts/StoryScript/Libraries/bootstrap/bootstrap.css'])
        .pipe(gulp.dest(paths.webroot + 'css/lib'));
}

function copyResources(nameSpace) {
    // Copy resources
    gulp.src([paths.root + 'Scripts/' + nameSpace + '/resources/*.*'])
        .pipe(gulp.dest(paths.webroot + 'resources'));
}

function copyCss(nameSpace) {
    // Copy css
    gulp.src([paths.root + 'Scripts/StoryScript/ui/styles/*.css', paths.root + 'Scripts/' + nameSpace + '/ui/styles/*.css'])
        .pipe(gulp.dest(paths.webroot + 'css'));
}

function copyHtml(nameSpace) {
    // Copy html
    gulp.src([paths.root + 'Scripts/StoryScript/**/*.html', paths.root + 'Scripts/' + nameSpace + '/**/*.html'])
      .pipe(gulp.dest(paths.webroot));
}

function compileTypeScript(nameSpace) {
    var tsResult = gulp.src([paths.root + 'Scripts/Library/**/*.ts', paths.root + 'Scripts/StoryScript/**/!(app)*.ts', paths.root + 'Scripts/StoryScript/app.ts', paths.root + 'Scripts/' + nameSpace + '/**/*.ts', 'Scripts/Types/**/*.ts'], { base: paths.root + 'Scripts' })
                        .pipe(sourcemaps.init())
                        .pipe(ts(tsProject));

    return merge([
        tsResult.js.pipe(sourcemaps.write('../maps')).pipe(gulp.dest(paths.webroot + 'js'))
    ]);
}