var gulp = require("gulp"),
    exec = require('child_process').exec,
    cssmin = require("gulp-cssmin"),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    //uglify = require("gulp-uglify"),
    flatten = require('gulp-flatten'),
    ts = require('gulp-typescript'),
    merge = require('merge2'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    jf = require('jsonfile'),
    minifyHtml = require('gulp-minify-html'),
    angularTemplateCache = require('gulp-angular-templatecache'),
    gameDescriptionBundler = require('./src/gameDescriptionBundler');

var tsStoryScriptProject = ts.createProject("./src/Engine/tsconfig.json");
var tsGameProject = ts.createProject("./src/Games/tsconfig.json");
var tsUIProject = ts.createProject("./src/UI/tsconfig.json");

var paths = {
    webroot: "./dist/",
    sourceroot: "./src/",
    typeroot: "./src/types/"
};

gulp.task('create-game-basic', function () {
    var gameNameSpace = '', mode = '';

    if (!gameNameSpace) {
        gameNameSpace = '_test'
        //throw new Error('No game namespace defined!');
    }

    if (!mode) {
        mode = 'basic';
    }

    var templateRoot = paths.sourceroot + 'Games/_GameTemplate/';

    var sources = mode === 'basic' ? 
    [
        templateRoot + 'locations/*.html',
        templateRoot + 'ui/**/*.css',
        templateRoot + 'bs-config.json',
        templateRoot + 'customTexts.ts',
        templateRoot + 'run.ts'
    ] : 
    [
        templateRoot + '**/*.*'
    ];

    var destination = paths.sourceroot + 'Games/' + gameNameSpace;

    console.log('sources:' + sources + '. Destination: ' + destination);

    return gulp.src(sources, {base: templateRoot })
            .pipe(replace('namespace GameTemplate {', 'namespace ' + gameNameSpace + ' {'))
            .pipe(gulp.dest(destination));
});

gulp.task('start', ['watch'], function() {
    exec('lite-server -c ' + paths.webroot + 'bs-config.json');
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
    var nameSpace = getNameSpace();

    gulp.watch(["src/Engine/**/*.ts"], function (e) {
        return compileTs('StoryScript', e.path, compileStoryScript);
    });
    gulp.watch(["src/Games/**/*.ts"], function (e) {
        return compileTs('Game', e.path, compileGame, nameSpace);
    });
    gulp.watch(["src/UI/**/*.ts"], function (e) {
        return compileTs('UI', e.path, compileUI);
    });
    gulp.watch(["src/UI/**/*.html"], function (e) {
        return compileUITemplates();
    });
    gulp.watch(["src/Games/**/*.html"], function (e) {
        return compileGameDescriptions(nameSpace);
    });
    gulp.watch(["src/**/*.css"], function (e) {
        return copyCss(nameSpace, e.path);
    });
    gulp.watch(["src/Games/**/resources/*.*"], function (e) {
        if (e.type === 'deleted') {
            return deleteResource(e.path)
        }
        else {
            return copyResource(e.path);
        }
    });
});

function compileTs(type, path, compileFunc, nameSpace) {
    if (path) {
        console.log('TypeScript file ' + path + ' has been changed. Compiling ' + type + '...');
    }

    return compileFunc(nameSpace);
}

function getNameSpace() {
    var config = jf.readFileSync('./src/Games/tsconfig.json');
    return config.include[1].split('/')[1];
}

function buildGame(nameSpace) {
    var libs = copyLibraries();
    var resources = copyResources(nameSpace);
    var css = copyCss(nameSpace);
    var html = copyHtml();
    var config = copyConfig(nameSpace);
    var ui = compileUI();
    var game = compileGame(nameSpace);
    var descriptions = compileGameDescriptions(nameSpace);
    return merge(libs, resources, css, html, config, ui, game, descriptions);
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

function copyCss(nameSpace, path) {
    if (path) {
        console.log('Css file ' + path + ' has been changed. Compiling css...');
    }

    return gulp.src([paths.sourceroot + 'UI/styles/*.css', paths.sourceroot + 'Games/' + nameSpace + '/ui/styles/*.css'])
        .pipe(flatten())
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.webroot + 'css'));
}

function copyHtml() {
    return gulp.src([paths.sourceroot + 'UI/index.html'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot));
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

function compileGame(nameSpace) {
    var tsResult = tsGameProject.src().pipe(sourcemaps.init()).pipe(tsGameProject());

    return merge([
        tsResult.js.pipe(concat('game.js')).pipe(sourcemaps.write('./')).pipe(gulp.dest(paths.webroot + 'js'))
    ]);
}

function compileUI() {
    var tsResult = tsUIProject.src().pipe(sourcemaps.init()).pipe(tsUIProject());
    var templateResult = compileUITemplates();

    return merge([
        tsResult.js.pipe(concat('ui.js')).pipe(sourcemaps.write('./')).pipe(gulp.dest(paths.webroot + 'js')),
        templateResult
    ]);
}

function compileUITemplates() {
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


function compileGameDescriptions(nameSpace) {
    var gameDir = 'src/games/' + nameSpace;

    return gulp
        .src([gameDir + '/**/*.html', '!' + gameDir + '/ui' ])
        .pipe(minifyHtml({ empty: true }))
        .pipe(gameDescriptionBundler(nameSpace))
        .pipe(gulp.dest(paths.webroot + 'js/'));
}