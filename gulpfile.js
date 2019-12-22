const gameName = require('./gameName.js');

const gulp = require("gulp"),
    replace = require('gulp-replace');

const sourceroot = "./src/";

exports.createGame = createGame;

function createGame() {
    var templateRoot = sourceroot + 'Games/_GameTemplate/';
    var sources = [templateRoot + '**/*'];
    var destination = sourceroot + 'Games/' + gameName;

    return gulp.src(sources, {base: templateRoot })
            .pipe(replace('Run(\'GameTemplate\',', 'Run(\'' + gameName + '\','))
            .pipe(gulp.dest(destination));
}