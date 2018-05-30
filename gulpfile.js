var gulp = require("gulp"),
    shell = require('gulp-shell'),
    //nodemon = require('gulp-nodemon');
    //notify = require('gulp-notify');
    //livereload = require('gulp-livereload');
    //cssmin = require("gulp-cssmin"),
    //uglify = require("gulp-uglify"),
    flatten = require('gulp-flatten'),
    ts = require('gulp-typescript'),
    merge = require('merge'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    jf = require('jsonfile');

var tsProject = ts.createProject("./src/tsconfig.json");

var paths = {
    webroot: "./dist/",
    sourceroot: "./src/"
};

gulp.task('start', ['build-game', 'watch'], shell.task('lite-server'));

gulp.task('build-game', ['delete-files'], function() {
    var namespace = getNameSpace();
    buildGame(namespace);
});

gulp.task('delete-files', function () {
    del.sync([paths.webroot + '**/*']);
});

gulp.task('watch', function () {
    gulp.watch(["src/**/*.ts"]).on('change', function (e) {
        console.log('TypeScript file ' + e.path + ' has been changed. Compiling...');
        var gameNameSpace = getNameSpace();
        compileTypeScript(gameNameSpace);
        console.log('Compilarion done.');
    });
    gulp.watch(["src/**/*.html", "src/**/*.css", "src/Games/**/resources/*.*"]).on('change', function (e) {
        copyResource(e.path);
    });
});

function getNameSpace() {
    var config = jf.readFileSync('./src/tsconfig.json');
    return config.include[1].split('/')[2];
}

function buildGame(nameSpace) {
    copyLibraries();
    copyResources(nameSpace);
    copyCss(nameSpace);
    copyHtml(nameSpace);
    copyConfig(nameSpace);
    compileTypeScript(nameSpace);
}

function copyResource(fullPath) {
    var pathPart = fullPath.match(/[\w-]+\\+[\w-]+\.+[\w]{1,4}/g) + '';
    pathPart = pathPart.replace('\\', '/');
    var parts = pathPart.split('/');

    var folder = parts[0]

    if (parts.length > 1 && parts[1].toLowerCase() == 'index.html') {
        folder = '';
    }
    else if (folder.toLowerCase() == 'styles') {
        folder = 'css';
    }
    else if (fullPath.toLowerCase().indexOf('\\ui\\') > -1) {
        folder = 'ui';
    }

    console.log('Resource file ' + fullPath + ' has been changed. Updating ' + pathPart + ' (folder ' + folder + ').');
    //console.log('source: ' + fullPath);
    //console.log('destination: ' + paths.webroot + path);
    gulp.src([fullPath]).pipe(gulp.dest(paths.webroot + folder));
}

function copyLibraries() {
    gulp.src([paths.sourceroot + 'Libraries/**/*.js'])
        .pipe(gulp.dest(paths.webroot + 'js/lib'));

    gulp.src([paths.sourceroot + 'Libraries/bootstrap/bootstrap.css'])
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
    gulp.src([paths.sourceroot + '/bs-config.json', paths.sourceroot + 'Games/' + nameSpace + '/bs-config.json'])
      .pipe(gulp.dest(paths.webroot));
}

function compileTypeScript(nameSpace) {
    var tsResult = tsProject.src().pipe(sourcemaps.init()).pipe(tsProject());

    return merge([
        tsResult.js.pipe(sourcemaps.write('./')).pipe(gulp.dest(paths.webroot))
    ]);
}