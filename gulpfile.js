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

gulp.task('create-game', createGame());

gulp.task('create-game-basic', createGame('basic'));

gulp.task('create-location', createLocation);

gulp.task('fix-popper', fixPopper());

gulp.task('build-game', ['delete-files', 'compile-engine'], function() {
    var namespace = getNameSpace();   
    return buildGame(namespace);
});

gulp.task('publish-game', ['delete-published-files', 'build-game'], function() {  
    return publishGame(false);
});

gulp.task('publish-game-local', ['delete-published-files', 'build-game'], function() {  
    return publishGame(true);
});

gulp.task('delete-files', function () {
    return del.sync([paths.webroot + '**/*', paths.typeroot + '**/*']);
});

gulp.task('delete-published-files', function () {
    return del.sync([paths.publishroot + '**/*']);
});

gulp.task('compile-engine', ['fix-popper'], function() {
    return compileTs('StoryScript', null, compileStoryScript);
});

gulp.task('start', ['build-game'], function () {
    var config = jf.readFileSync(paths.webroot + 'bs-config.json');
    browserSync.init(config);
    
    var nameSpace = getNameSpace();

    gulp.watch(["src/Engine/**/*.ts"], function (e) {
        return compileTs('StoryScript', e.path, compileStoryScript);
    }).on('change', browserSync.reload);

    gulp.watch(["src/Games/**/*.ts"], function (e) {
        return compileTs('Game', e.path, compileGame);
    }).on('change', browserSync.reload);

    gulp.watch(["src/UI/**/*.ts"], function (e) {
        return compileTs('UI', e.path, compileUI, nameSpace);
    }).on('change', browserSync.reload);

    gulp.watch(['src/UI/**/*.html', 'src/Games/' + nameSpace + '/ui/**/*.html'], function (e) {
        console.log('UI template html file ' + e.path + ' has been changed. Compiling UI html...');
        return compileUITemplates(nameSpace);
    }).on('change', browserSync.reload);

    gulp.watch(['src/Games/**/*.html', '!src/Games/' + nameSpace + '/ui/**'], function (e) {
        console.log('Html file ' + e.path + ' has been changed. Compiling game descriptions...');
        return compileGameDescriptions(nameSpace);
    }).on('change', browserSync.reload);

    gulp.watch(["src/**/*.css"], function (e) {
        return copyCss(nameSpace, e.path).pipe(browserSync.stream());
    });

    gulp.watch(["src/Games/**/resources/*.*"], function (e) {
        if (e.type === 'deleted') {
            return deleteResource(e.path)
        }
        else {
            return copyResource(e.path);
        }
    }).on('change', browserSync.reload);;
});

function fixPopper() {
    return function() {
        var typesPath = './node_modules/@types/bootstrap';

        return gulp.src([typesPath + '/index.d.ts'])
            .pipe(replace('import * as Popper from "popper.js"', 'import * as Popper from "../../popper.js/index"'))
            .pipe(flatten())
            .pipe(gulp.dest(typesPath))
    }
}

function createGame(mode) {
    if (!mode) {
        mode = 'standard';
    }

    return function () {
        var gameNameSpace = getNameSpace();
        var templateRoot = paths.sourceroot + 'Games/_GameTemplate/';
        var sources = [templateRoot + '**/*.*', '!' + templateRoot + '**/*.css'];

        if (mode === 'standard') {
            sources.push('!' + templateRoot + 'ui/components/*');
        }

        var destination = paths.sourceroot + 'Games/' + gameNameSpace;

        var css = gulp.src([templateRoot + 'ui/styles/game.css'])
                    .pipe(rename('game.css'))
                    .pipe(gulp.dest(paths.sourceroot + 'Games/' + gameNameSpace + '/ui/styles'));

        var code = gulp.src(sources, {base: templateRoot })
                .pipe(replace('StoryScript.Run(\'GameTemplate\',', 'StoryScript.Run(\'' + gameNameSpace + '\','))
                .pipe(replace('namespace GameTemplate {', 'namespace ' + gameNameSpace + ' {'))
                .pipe(replace('namespace GameTemplate.Locations {', 'namespace ' + gameNameSpace + '.Locations {'));
        
        code.pipe(gulp.dest(destination));

        return merge(css, code);
    }
}

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

function getStoryScriptVersion() {
    return jf.readFileSync('./package.json').version;
}

function buildGame(nameSpace) {
    var libs = buildTemplateAndCopyLibraries();
    var resources = copyResources(nameSpace);
    var css = copyCss(nameSpace);
    var config = copyConfig(nameSpace);
    var ui = compileUI(nameSpace);
    var game = compileGame();
    var descriptions = compileGameDescriptions(nameSpace);

    return merge(libs, resources, css, config, ui, game, descriptions);
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

function addVersion(path, version) {
    var nameParts = path.basename.split('.');
    nameParts.splice(1, 0, version);
    path.basename = nameParts.join('.');
}

function publishGame(local) {
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

    var resources = gulp.src([paths.webroot + 'resources/**.*', '!' + paths.webroot + 'resources/readme.txt'])
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

function copyResources(nameSpace) {
    return gulp.src([paths.sourceroot + 'Games/' + nameSpace + '/resources/**/*.*'])
        .pipe(flatten())
        .pipe(gulp.dest(paths.webroot + 'resources'));
}

function copyCss(nameSpace, path) {
    if (path) {
        console.log('Css file ' + path + ' has been changed. Compiling css...');
    }

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
    return gulp.src([paths.sourceroot + '/bs-config.json', paths.sourceroot + 'Games/' + nameSpace + '/bs-config.json', , paths.sourceroot + 'Games/' + nameSpace + '/gameinfo.json'])
      .pipe(gulp.dest(paths.webroot));
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

function compileGameDescriptions(nameSpace) {
    var gameDir = 'src/games/' + nameSpace;
    var descriptionPipe = gulp
        .src([gameDir + '/**/*.html', '!' + gameDir + '/ui/**' ])
        .pipe(minifyHtml({ empty: true }))
        .pipe(gameDescriptionBundler(nameSpace));

    return merge
    (
        descriptionPipe.pipe(gulp.dest(paths.webroot + 'js/')),
        descriptionPipe.pipe(gulp.dest(paths.testroot))
    );
}

function createLocation(cb) {
    var args = process.argv;
    var locationName = args[3].substring(2);
    locationName = locationName.substring(0, 1).toUpperCase() + locationName.substring(1);

    var nameSpace = getNameSpace(); 

    fs.readFile('./src/Games/_GameTemplate/locations/start.ts', 'utf8', function(err, text) {
        var tsContent = text.replace('GameTemplate.Locations {', nameSpace + '.Locations {')
                            .replace('export function Start()', 'export function ' + locationName + '()')
                            .replace('name: \'Start\',', 'name: \'' + locationName + '\',');

        fs.writeFile('./src/Games/' + nameSpace + '/locations/' + locationName + '.ts', tsContent, cb, function() {
            fs.readFile('./src/Games/_GameTemplate/locations/Start.html', 'utf8', function(err, text) {
                var tsContent = text.replace('Your adventure starts here!', '');
                     
                fs.writeFile('./src/Games/' + nameSpace + '/locations/' + locationName + '.html', tsContent, cb);
            });
        });
    });
}