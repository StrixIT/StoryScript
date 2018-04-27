var gulp = require("gulp"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    flatten = require('gulp-flatten'),
    ts = require('gulp-typescript'),
    merge = require('merge'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    log = require('fancy-log'),
    jf = require('jsonfile');

var config = jf.readFileSync('./src/tsconfig.json');

var tsProject = ts.createProject("./src/tsconfig.json");

var paths = {
    root: "./src/",
    webroot: "./src/wwwroot/",
    sourceroot: "./src/wwwroot/source/"
};

var gameNameSpace = config.include[config.include.length - 1].split('/')[4];

gulp.task('build-game', ['delete-files'], buildGame(gameNameSpace));

gulp.task('delete-files', function () {
    del.sync([paths.webroot + 'enemies/**/*', paths.webroot + 'locations/**/*', paths.webroot + 'persons/**/*', paths.webroot + 'resources/**/*', paths.webroot + 'ui/**/*']);
});

function buildGame(nameSpace) {
    return function () {
        copyLibraries();
        copyResources(nameSpace);
        copyCss(nameSpace);
        copyHtml(nameSpace);
        copyConfig(nameSpace);
        compileTypeScript(nameSpace);
    }
}

function copyLibraries() {
    gulp.src([paths.root + 'Libraries/**/*.js'])
        .pipe(gulp.dest(paths.webroot + 'js/lib'));

    gulp.src([paths.root + 'Libraries/bootstrap/bootstrap.css'])
        .pipe(gulp.dest(paths.webroot + 'css/lib'));
}

function copyResources(nameSpace) {
    gulp.src([paths.sourceroot + 'Games/' + nameSpace + '/resources/**/*.*'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot + 'resources'));
}

function copyCss(nameSpace) {
    gulp.src([paths.sourceroot + 'UI/styles/*.css', paths.sourceroot + 'Games/' + nameSpace + '/ui/styles/*.css'])
        .pipe(gulp.dest(paths.webroot + 'css'));
}

function copyHtml(nameSpace) {
    gulp.src([paths.sourceroot + 'UI/index.html'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot));

    gulp.src([paths.sourceroot + 'UI/**/*.html', paths.sourceroot + 'Games/' + nameSpace + '/ui/**/*.html'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot + 'ui'));

    gulp.src([paths.sourceroot + 'Games/' + nameSpace + '/enemies/**/*.html'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot + 'enemies'));

    gulp.src([paths.sourceroot + 'Games/' + nameSpace + '/items/**/*.html'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot + 'items'));

    gulp.src([paths.sourceroot + 'Games/' + nameSpace + '/locations/**/*.html'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot + 'locations'));

    gulp.src([paths.sourceroot + 'Games/' + nameSpace + '/persons/**/*.html'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot + 'persons'));
}

function copyConfig(nameSpace) {
    gulp.src([paths.root + '/bs-config.json', paths.sourceroot + 'Games/' + nameSpace + '/bs-config.json'])
      .pipe(gulp.dest(paths.webroot));
}

function compileTypeScript(nameSpace) {
    var tsResult = tsProject.src().pipe(sourcemaps.init()).pipe(tsProject());

    return merge([
        tsResult.js.pipe(sourcemaps.write('./')).pipe(gulp.dest('./src'))
    ]);
}