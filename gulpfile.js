var gulp = require("gulp"),
    merge = require('merge2'),
    del = require('del'),
    jf = require('jsonfile'),
    browserSync = require('browser-sync').create(),
    fs = require('fs'),
    ts = require('gulp-typescript'),
    plumber = require('gulp-plumber'),
    flatten = require('gulp-flatten'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    concat = require('gulp-concat'),
    cssmin = require("gulp-cssmin"),
    minifyHtml = require('gulp-minify-html'),
    gulpIgnore = require('gulp-ignore'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    angularTemplateCache = require('gulp-angular-templatecache'),
    gameDescriptionBundler = require('./src/gameDescriptionBundler');

var tsStoryScriptProject = ts.createProject("./src/Engine/tsconfig.json");
var tsGameProject = ts.createProject("./src/Games/tsconfig.json");
var tsUIProject = ts.createProject("./src/UI/tsconfig.json");

var paths = {
    packages: "./node_modules/",
    webroot: "./dist/",
    sourceroot: "./src/",
    typeroot: "./src/types/",
    testroot: "./test",
    publishroot: "./pub/",
};

exports.createGame = createGame;
exports.buildGame = gulp.series(deleteFiles, compileEngine, fixPopper, buildGame, gameDescriptions, gameDescriptionsForTest);
exports.start = gulp.series(exports.buildGame, start);
exports.publishGame = gulp.series(deletePublishedFiles, exports.buildGame, function() {  return publishGameTask(false); });
exports.publishGameLocal = gulp.series(deletePublishedFiles, exports.buildGame, function() { return publishGameTask(true); });
exports.compileEngine = compileEngine;

function createGame() {
    var gameNameSpace = getNameSpace();
    var templateRoot = paths.sourceroot + 'Games/_GameTemplate/';
    var sources = [templateRoot + '**/*.*', '!' + templateRoot + '**/*.css'];
    var destination = paths.sourceroot + 'Games/' + gameNameSpace;

    return merge(
        gulp.src([templateRoot + 'ui/styles/game.css'])
            .pipe(rename('game.css'))
            .pipe(gulp.dest(paths.sourceroot + 'Games/' + gameNameSpace + '/ui/styles')),

        gulp.src(sources, {base: templateRoot })
            .pipe(replace('StoryScript.Run(\'GameTemplate\',', 'StoryScript.Run(\'' + gameNameSpace + '\','))
            .pipe(replace('namespace GameTemplate {', 'namespace ' + gameNameSpace + ' {'))
            .pipe(replace('namespace GameTemplate.Locations {', 'namespace ' + gameNameSpace + '.Locations {'))
            .pipe(gulp.dest(destination))
    );
}

function buildGame() {
    var nameSpace = getNameSpace();   
    var libs = buildTemplateAndCopyLibraries();
    var resources = copyResources(nameSpace);
    var css = copyCss(nameSpace);
    var config = copyConfig(nameSpace);
    var ui = compileUI(nameSpace);
    var game = compileGame();

    return merge(libs, resources, css, config, ui, game);
}

function start(callBack) {
    var config = jf.readFileSync(paths.webroot + 'bs-config.json');
    browserSync.init(config);
    
    var nameSpace = getNameSpace();

    gulp.watch(["src/Engine/**/*.ts"], function watchEngineCode(e) {
        return compileTs('StoryScript', e.path, compileStoryScript).pipe(browserSync.stream());
    }).on('change', logFileChange);

    gulp.watch(["src/Games/**/*.ts"], function watchGameCode(e) {
        return compileTs('Game', e.path, compileGame).pipe(browserSync.stream());
    }).on('change', logFileChange);

    gulp.watch(["src/UI/**/*.ts"], function watchUICode(e) {
        return compileTs('UI', e.path, compileUI, nameSpace).pipe(browserSync.stream());
    }).on('change', logFileChange);

    gulp.watch(['src/UI/**/*.html', 'src/Games/' + nameSpace + '/ui/**/*.html'], function watchUIHtml() {
        return compileUITemplates(nameSpace).pipe(browserSync.stream());
    }).on('change', logFileChange);

    gulp.watch(['src/Games/**/*.html', '!src/Games/' + nameSpace + '/ui/**'], function watchGameHtml() {
        return gameDescriptions(nameSpace).pipe(browserSync.stream());
    }).on('change', logFileChange);

    gulp.watch(["src/**/*.css"], function WatchCss(e) {
        return copyCss(nameSpace, e.path).pipe(browserSync.stream());
    }).on('change', logFileChange);

    var resourceWatcher = gulp.watch(["src/Games/**/resources/*.*"]);
      
    resourceWatcher.on('unlink', (path, stats) => {
        var folderAndFile = logResourceChange(path, 'deleted. Removing');
        deleteResource(folderAndFile.folder + '/' + folderAndFile.file);
        browserSync.stream();
    });
    
    resourceWatcher.on('change', (path, stats) => {
        var folderAndFile = logResourceChange(path, 'changed. Updating');
        copyResource(path, folderAndFile.folder).pipe(browserSync.stream());
    });

    resourceWatcher.on('add', (path, stats) => {
        var folderAndFile = logResourceChange(path, 'added. Updating');
        copyResource(path, folderAndFile.folder).pipe(browserSync.stream());
    });

    callBack();
}

function logFileChange(path, stats) {
    if (path) {
        var pathParts = path.split('.');
        var extension = pathParts[pathParts.length - 1].toLowerCase();
        var type = extension === 'ts' ? 'TypeScript' : extension.substring(0, 1).toUpperCase() + extension.substring(1);
        console.log(`${type} file ${path} has been changed. Compiling ${extension}...`);
    }
}

function logResourceChange(path, messageAddition) {
    var folderAndFile = getFolderAndFileName(path);
    console.log(`Resource file ${path} has been ${messageAddition} ${folderAndFile.folder + '/' + folderAndFile.file}.`);
    return folderAndFile;
}

function compileEngine() {
    return compileTs('StoryScript', null, compileStoryScript);
};

function compileTs(type, path, compileFunc, nameSpace) {
    return compileFunc(nameSpace);
}

function compileStoryScript() {
    var tsResult = tsStoryScriptProject
        .src()
        .pipe(plumber({ errorHandler: function(error) {
            console.log(error);
        }}))
        .pipe(sourcemaps.init())
        .pipe(tsStoryScriptProject());

    var version = getStoryScriptVersion();

    return merge(
        tsResult.js.pipe(concat('storyscript.' + version + '.js')).pipe(sourcemaps.write('./')).pipe(gulp.dest(paths.webroot + 'js')),
        tsResult.dts.pipe(concat('storyscript.d.ts')).pipe(gulp.dest(paths.typeroot)),
        tsResult.js.pipe(concat('storyscript.js')).pipe(gulp.dest(paths.testroot))
    );
}

function getStoryScriptVersion() {
    return jf.readFileSync('./package.json').version;
}

function getNameSpace() {
    var config = jf.readFileSync('./src/Games/tsconfig.json');
    return config.include[1].split('/')[1];
}

function deleteFiles(callBack) {
    return del([paths.webroot + '**/*', paths.typeroot + '**/*'], callBack);
}

function deletePublishedFiles (callBack) {
    return del([paths.publishroot + '**/*'], callBack);
}

function fixPopper() {
    var typesPath = './node_modules/@types/bootstrap';

    return gulp.src([typesPath + '/index.d.ts'])
        .pipe(replace('import * as Popper from "popper.js"', 'import * as Popper from "../../popper.js/index"'))
        .pipe(flatten())
        .pipe(gulp.dest(typesPath))
}

function buildTemplateAndCopyLibraries() {
    var storyScriptVersion = getStoryScriptVersion();

    var jqueryPath = paths.packages + 'jquery/';
    var jqueryConfig = jf.readFileSync(jqueryPath + 'package.json');
    var jqueryversion = jqueryConfig.version;

    var angularPath = paths.packages + 'angular/';
    var angularConfig = jf.readFileSync(angularPath + 'package.json');
    var angularVersion = angularConfig.version;

    var bootstrapPath = paths.packages + 'bootstrap/';
    var bootstrapConfig = jf.readFileSync(bootstrapPath + 'package.json');
    var bootstrapVersion = bootstrapConfig.version;

    var jquery = gulp.src([jqueryPath + 'dist/jquery.min.js']).pipe((rename(function (path) { addVersion(path, jqueryversion); }))).pipe(gulp.dest(paths.webroot + 'js/lib'));
    var angular = gulp.src([angularPath + 'angular.min.js', paths.packages + 'angular-sanitize/angular-sanitize.min.js']).pipe((rename(function (path) { addVersion(path, angularVersion); }))).pipe(gulp.dest(paths.webroot + 'js/lib'));
    var bootstrap = gulp.src([bootstrapPath + 'dist/js/bootstrap.min.js']).pipe((rename(function (path) { addVersion(path, bootstrapVersion); }))).pipe(gulp.dest(paths.webroot + 'js/lib'));
    var bootstrapCss = gulp.src([bootstrapPath + 'dist/css/bootstrap.min.css']).pipe((rename(function (path) { addVersion(path, bootstrapVersion); }))).pipe(gulp.dest(paths.webroot + 'css/lib'));

    var template = gulp.src([paths.sourceroot + 'UI/index.html'])
        .pipe(flatten())
        .pipe(replace('jquery.', 'jquery.' + jqueryversion + '.'))
        .pipe(replace('angular.', 'angular.' + angularVersion + '.'))
        .pipe(replace('angular-sanitize.', 'angular-sanitize.' + angularVersion + '.'))
        .pipe(replace('bootstrap.', 'bootstrap.' + bootstrapVersion + '.'))
        .pipe(replace('storyscript.', 'storyscript.' + storyScriptVersion + '.'))
        .pipe(replace('ui.', 'ui.' + storyScriptVersion + '.'))
        .pipe(gulp.dest(paths.webroot));

    return merge(jquery, angular, bootstrap, bootstrapCss, template);
}

function copyResources(nameSpace) {
    return gulp.src([paths.sourceroot + 'Games/' + nameSpace + '/resources/**/*.*'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot + 'resources'));
}

function copyCss(nameSpace, path) {
    var version = getStoryScriptVersion();

    return gulp.src([paths.sourceroot + 'UI/styles/*.css', paths.sourceroot + 'Games/' + nameSpace + '/ui/styles/*.css'])
        .pipe(flatten())
        .pipe(cssmin())
        .pipe(rename(function (path) {
            if (path.basename.toLowerCase().indexOf('storyscript') > -1) {
                path.basename += '.' + version;
            }

            path.basename += '.min';
        }))
        .pipe(gulp.dest(paths.webroot + 'css'));
}

function copyConfig(nameSpace) {
    return gulp.src([paths.sourceroot + 'bs-config.json', paths.sourceroot + 'Games/' + nameSpace + '/bs-config.json', paths.sourceroot + 'Games/' + nameSpace + '/gameinfo.json'], { allowEmpty: true })
      .pipe(gulp.dest(paths.webroot));
}

function compileUI(nameSpace) {
    var tsResult = tsUIProject
        .src()
        .pipe(plumber({ errorHandler: function(error) {
            console.log(error);
        }}))
        .pipe(sourcemaps.init())
        .pipe(tsUIProject());
 
    var templateResult = compileUITemplates(nameSpace);
    var version = getStoryScriptVersion();

    return merge([
        tsResult.js.pipe(concat('ui.' + version +'.js')).pipe(sourcemaps.write('./')).pipe(gulp.dest(paths.webroot + 'js')),
        templateResult
    ]);
}

function compileUITemplates(nameSpace) {
    var includedTemplates = [];

    return gulp
        .src(['src/games/' + nameSpace + '/ui/**/*.html', 'src/ui/**/*.html'])
        // Remove duplicate components so game specific components override the default ones.
        .pipe(gulpIgnore.exclude(isDuplicate))
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

    function isDuplicate(file) {
        var pathParts = file.path.split('\\');
        var fileName = pathParts[pathParts.length - 1];

        if (includedTemplates.indexOf(fileName) > -1) {
            return true;
        }

        includedTemplates.push(fileName);
        return false;
    }
}

function compileGame() {
    var tsResult = tsGameProject
        .src()
        .pipe(plumber({ errorHandler: function(error) {
            console.log(error);
        }}))
        .pipe(sourcemaps.init())
        .pipe(tsGameProject());

    return merge(
        tsResult.js.pipe(concat('game.js')).pipe(sourcemaps.write('./')).pipe(gulp.dest(paths.webroot + 'js')),
        tsResult.js.pipe(concat('game.js')).pipe(gulp.dest(paths.testroot))
    );
}

function gameDescriptions() {
    return compileGameDescriptions();
}

function gameDescriptionsForTest() {
    return compileGameDescriptions(true);
}

function compileGameDescriptions(test) {
    var nameSpace = getNameSpace();  
    var gameDir = 'src/games/' + nameSpace;

    var descriptionPipe = gulp
        .src([gameDir + '/**/*.html', '!' + gameDir + '/ui/**' ])
        .pipe(minifyHtml({ empty: true }))
        .pipe(gameDescriptionBundler(nameSpace));

    return test ? descriptionPipe.pipe(gulp.dest(paths.testroot)) : descriptionPipe.pipe(gulp.dest(paths.webroot + 'js/'));
}

function addVersion(path, version) {
    var nameParts = path.basename.split('.');
    nameParts.splice(1, 0, version);
    path.basename = nameParts.join('.');
}

function copyResource(fullPath, folder) {
    return gulp.src([fullPath])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot + folder));
}

function deleteResource(fullPath) {
    return del.sync([paths.webroot + fullPath]);
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

function publishGameTask(local) {
    var sourceMapRegex = /(\/[\*\/]# sourceMappingURL=\S*)(( \*\/)|\b)/g;

    var css = gulp.src([paths.webroot + 'css/game*.css'])
                .pipe(replace(sourceMapRegex, ''))
                .pipe(gulp.dest(paths.publishroot + 'css'));

    var js = gulp.src([paths.webroot + 'js/game*.js'])
                .pipe(concat('game.js'))
                .pipe(replace(/autoBackButton\s*:[\s\w]*,/g, ''))
                .pipe(replace(sourceMapRegex, ''))
                .pipe(gulp.dest(paths.publishroot + 'js'));
    
    var templates = gulp.src([paths.webroot + 'js/ui-templates.js'])
                .pipe(replace(/<button id=resetbutton[^>]*>(.*?)<\s*\/\s*button>/g, ''))
                .pipe(gulp.dest(paths.publishroot + 'js'));

    var resources = gulp.src([paths.webroot + 'resources/**.*'])
                        .pipe(imagemin())
                        .pipe(gulp.dest(paths.publishroot + 'resources'));

    var config = gulp.src([paths.webroot + '*.json'])
                .pipe(gulp.dest(paths.publishroot));
    
    var index = gulp.src([paths.webroot + 'index.html'])
                .pipe(replace('<script src="js/game-descriptions.js"></script>', ''))
                .pipe(replace('game.min.css', cacheBuster('game.min.css')))
                .pipe(replace('game.js', cacheBuster('game.js')))
                .pipe(replace('ui-templates.js', cacheBuster('ui-templates.js')));
    
    if (local) {
        index = index.pipe(replace('="/', '="'));
    }
    
    index = index.pipe(gulp.dest(paths.publishroot));

    if (local) {
        var libraries = merge(
            gulp.src([paths.webroot + 'js/lib/*']).pipe(replace(sourceMapRegex, '')).pipe(gulp.dest(paths.publishroot + 'js/lib')),
            gulp.src([paths.webroot + 'js/storyscript*.js']).pipe(replace(sourceMapRegex, '')).pipe(gulp.dest(paths.publishroot + 'js')),
            gulp.src([paths.webroot + 'js/ui.*.js']).pipe(replace(sourceMapRegex, '')).pipe(gulp.dest(paths.publishroot + 'js')),
            gulp.src([paths.webroot + 'css/lib/*']).pipe(replace(sourceMapRegex, '')).pipe(gulp.dest(paths.publishroot + 'css/lib')),
            gulp.src([paths.webroot + 'css/storyscript.*']).pipe(replace(sourceMapRegex, '')).pipe(gulp.dest(paths.publishroot + 'css')),
            gulp.src([paths.webroot + 'css/game.*']).pipe(replace(sourceMapRegex, '')).pipe(gulp.dest(paths.publishroot + 'css')));

        return merge(css, js, templates, resources, config, index, libraries);
    }
    else
    {
        return merge(css, js, templates, resources, config, index);
    }
}

function cacheBuster(fileName) {
    var cachebuster = Math.round(new Date().getTime() / 1000);
    return fileName += '?cb=' + cachebuster;
}