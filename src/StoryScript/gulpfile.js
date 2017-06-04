var gulp = require("gulp"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    flatten = require('gulp-flatten'),
    ts = require('gulp-typescript'),
    merge = require('merge'),
    sourcemaps = require('gulp-sourcemaps'),
    project = require("./runtimeconfig.template.json"),
    del = require('del');

var paths = {
    webroot: "./" + project.webroot + "/",
    root: "./"
};

gulp.task('build-game-template', ['delete-files'], buildGame('_GameTemplate'));
gulp.task('build-my-new-game', ['delete-files'], buildGame('MyNewGame'));
gulp.task('build-dangerous-cave', ['delete-files'], buildGame('DangerousCave'));
gulp.task('build-quest-for-the-king', ['delete-files'], buildGame('QuestForTheKing'));
gulp.task('build-path-of-heroes', ['delete-files'], buildGame('PathOfHeroes'));
gulp.task('build-ridder-magnus', ['delete-files'], buildGame('RidderMagnus'));
gulp.task('build-adventure-game', ['delete-files'], buildGame('AdventureGame'));

gulp.task('delete-files', function () {
    del([paths.webroot + 'locations/**/*', paths.webroot + 'resources/**/*', paths.webroot + 'ui/**/*', paths.webroot + 'index.html']);
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
    gulp.src([paths.root + 'Games/' + nameSpace + '/resources/**/*.*'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot + 'resources'));
}

function copyCss(nameSpace) {
    gulp.src([paths.root + 'StoryScript/ui/styles/*.css', paths.root + 'Games/' + nameSpace + '/ui/styles/*.css'])
        .pipe(gulp.dest(paths.webroot + 'css'));
}

function copyHtml(nameSpace) {
    gulp.src([paths.root + 'StoryScript/index.html'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot));

    gulp.src([paths.root + 'StoryScript/ui/**/*.html', paths.root + 'Games/' + nameSpace + '/ui/**/*.html'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot + 'ui'));

    gulp.src([paths.root + 'Games/' + nameSpace + '/enemies/**/*.html'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot + 'enemies'));

    gulp.src([paths.root + 'Games/' + nameSpace + '/items/**/*.html'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot + 'items'));

    gulp.src([paths.root + 'Games/' + nameSpace + '/locations/**/*.html'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot + 'locations'));

    gulp.src([paths.root + 'Games/' + nameSpace + '/persons/**/*.html'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot + 'persons'));
}

function copyConfig(nameSpace) {
    gulp.src([paths.root + '/bs-config.json', paths.root + 'Games/' + nameSpace + '/bs-config.json'])
      .pipe(gulp.dest(paths.webroot));
}

function compileTypeScript(nameSpace) {
    var tsResult = gulp.src([paths.root + 'StoryScript/Components/**/*.ts', paths.root + 'StoryScript/**/!(app)*.ts', paths.root + 'StoryScript/app.ts', paths.root + 'Games/' + nameSpace + '/**/*.ts', 'Types/**/*.ts'], { base: paths.webroot + 'js' })
                        .pipe(sourcemaps.init())
                        .pipe(ts({
                            target: "es5",
                            outFile: "game.js"
                        }));

    return merge([
        tsResult.js.pipe(sourcemaps.write('../maps')).pipe(gulp.dest(paths.webroot + 'js'))
    ]);
}