var gulp = require("gulp"),
    shell = require('gulp-shell'),
    exec = require('child_process').exec,
    //cssmin = require("gulp-cssmin"),
    //uglify = require("gulp-uglify"),
    flatten = require('gulp-flatten'),
    ts = require('gulp-typescript'),
    merge = require('merge2'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    jf = require('jsonfile'),
    minifyHtml = require('gulp-minify-html'),
    angularTemplateCache = require('gulp-angular-templatecache');

var tsStoryScriptProject = ts.createProject("./src/Engine/tsconfig.json");
var tsGameProject = ts.createProject("./src/Games/tsconfig.json");
var tsUIProject = ts.createProject("./src/UI/tsconfig.json");

var paths = {
    webroot: "./dist/",
    sourceroot: "./src/",
    typeroot: "./src/types/"
};

gulp.task('start', ['watch'], function() {
    exec('lite-server');
});

gulp.task('build-game', ['delete-files', 'compile-engine'], function() {
    var namespace = getNameSpace();
    return buildGame(namespace);
});

gulp.task('delete-files', function () {
    return del.sync([paths.webroot + '**/*', paths.typeroot + '**/*']);
});

gulp.task('compile-engine', function() {
    return compileTs('StoryScript', null, compileStoryScript);
});

gulp.task('watch', ['build-game'], function () {
    gulp.watch(["src/Engine/**/*.ts"], function (e) {
        return compileTs('StoryScript', e.path, compileStoryScript);
    });
    gulp.watch(["src/Games/**/*.ts"], function (e) {
        return compileTs('Game', e.path, compileGame);
    });
    gulp.watch(["src/UI/**/*.ts"], function (e) {
        return compileTs('UI', e.path, compileUI);
    });
    gulp.watch(["src/UI/**/*.html"], function (e) {
        return compileUITemplates();
    });
    gulp.watch(["src/Games/**/*.html", "src/**/*.css", "src/Games/**/resources/*.*"], function (e) {
        if (e.type === 'deleted') {
            return deleteResource(e.path)
        }
        else {
            return copyResource(e.path);
        }
    });
});

function compileTs(type, path, compileFunc) {
    if (path) {
        console.log('TypeScript file ' + path + ' has been changed. Compiling ' + type + '...');
    }

    return compileFunc();
}

function getNameSpace() {
    var config = jf.readFileSync('./src/Games/tsconfig.json');
    return config.include[1].split('/')[1];
}

function buildGame(nameSpace) {
    var libs = copyLibraries();
    var resources = copyResources(nameSpace);
    var css = copyCss(nameSpace);
    var html = copyHtml(nameSpace);
    var config = copyConfig(nameSpace);
    var ui = compileUI();
    var game = compileGame();
    return merge(libs, resources, css, html, config, ui, game);
}

function copyResource(fullPath) {
    var folderAndFile = getFolderAndFileName(fullPath);
    console.log('Resource file ' + fullPath + ' has been changed. Updating ' + folderAndFile.folder + '/' + folderAndFile.file + ' (folder ' + folderAndFile.folder + ').');
    return gulp.src([fullPath]).pipe(gulp.dest(paths.webroot + folderAndFile.folder));
}

function deleteResource(fullPath) {
    var folderAndFile = getFolderAndFileName(fullPath);
    var path = folderAndFile.folder + '/' + folderAndFile.file;
    console.log('Resource file ' + fullPath + ' has been deleted. Removing ' + path + '.');
    return del.sync([paths.webroot + path]);
}

function getFolderAndFileName(path) {
    var pathPart = path.match(/[\w-]+\\+[\w-]+\.+[\w]{1,4}/g) + '';
    pathPart = pathPart.replace('\\', '/');
    var parts = pathPart.split('/');

    if (parts.length <= 1) {
        console.log('No file name found for path: ' + path);
        return;
    }

    var folder = parts[0]
    var file = parts[1]

    if (file.toLowerCase() == 'index.html') {
        folder = '';
    }
    else if (folder.toLowerCase() == 'styles') {
        folder = 'css';
    }
    else if (path.toLowerCase().indexOf('\\ui\\') > -1) {
        folder = 'ui';
    }

    return {
        folder: folder,
        file: file
    };
}

function copyLibraries() {
    var libJs = gulp.src([paths.sourceroot + 'Libraries/**/*.js'])
        .pipe(gulp.dest(paths.webroot + 'js/lib'));

    var libCss = gulp.src([paths.sourceroot + 'Libraries/bootstrap/bootstrap.min.css'])
        .pipe(gulp.dest(paths.webroot + 'css/lib'));

    return merge([libJs, libCss]);
}

function copyResources(nameSpace) {
    return gulp.src([paths.sourceroot + 'Games/' + nameSpace + '/resources/**/*.*'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot + 'resources'));
}

function copyCss(nameSpace) {
    return gulp.src([paths.sourceroot + 'UI/styles/*.css', paths.sourceroot + 'Games/' + nameSpace + '/ui/styles/*.css'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot + 'css'));
}

function copyHtml(nameSpace) {
    var index = gulp.src([paths.sourceroot + 'UI/index.html'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot));

    var ui = gulp.src([paths.sourceroot + 'Games/' + nameSpace + '/ui/**/*.html'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot + 'ui'));

    var enemies = gulp.src([paths.sourceroot + 'Games/' + nameSpace + '/enemies/**/*.html'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot + 'enemies'));

    var items = gulp.src([paths.sourceroot + 'Games/' + nameSpace + '/items/**/*.html'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot + 'items'));

    var locations = gulp.src([paths.sourceroot + 'Games/' + nameSpace + '/locations/**/*.html'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot + 'locations'));

    var persons  = gulp.src([paths.sourceroot + 'Games/' + nameSpace + '/persons/**/*.html'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot + 'persons'));

    return merge([index, ui, enemies, items, locations, persons]);
}

function copyConfig(nameSpace) {
    return gulp.src([paths.sourceroot + '/bs-config.json', paths.sourceroot + 'Games/' + nameSpace + '/bs-config.json'])
      .pipe(gulp.dest(paths.webroot));
}

function compileStoryScript() {
    var tsResult = tsStoryScriptProject.src().pipe(sourcemaps.init()).pipe(tsStoryScriptProject());

    return merge(
        tsResult.js.pipe(concat('storyscript.js')).pipe(sourcemaps.write('./')).pipe(gulp.dest(paths.webroot + 'js')),
        tsResult.dts.pipe(concat('storyscript.d.ts')).pipe(gulp.dest(paths.typeroot))
    );
}

function compileGame() {
    var tsResult = tsGameProject.src().pipe(sourcemaps.init()).pipe(tsGameProject());

    return merge([
        tsResult.js.pipe(concat('game.js')).pipe(sourcemaps.write('./')).pipe(gulp.dest(paths.webroot + 'js'))
    ]);
}

function compileUI() {
    var tsResult = tsUIProject.src().pipe(sourcemaps.init()).pipe(tsUIProject());
    var templateResult = compileUITemplates()

    return merge([
        tsResult.js.pipe(concat('ui.js')).pipe(sourcemaps.write('./')).pipe(gulp.dest(paths.webroot + 'js')),
        templateResult
    ]);
}

function compileUITemplates() {
    console.log('Compiling ui templates for angular.');

    return gulp
        .src('src/ui/**/*.html')
        .pipe(minifyHtml({ empty: true }))
        .pipe(angularTemplateCache({ 
            filename: 'ui-templates.js', 
            root: 'ui/',
            transformUrl: function(url) {
                var componentName = url.match(/\\\w{1,}\.html$/)[0].substring(1);
                return 'ui/' + componentName;
            },
            module: 'storyscript', 
            standAlone: false 
        }))
        .pipe(gulp.dest(paths.webroot + 'js/'));
}