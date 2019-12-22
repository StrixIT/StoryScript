const gulp = require("gulp"),
    replace = require('gulp-replace');

const sourceroot = "./src/";

var gameName = process.argv[2];

if (!gameName) {
    console.log('Please specify a game name.');
    return;
}

var templateRoot = sourceroot + 'Games/_GameTemplate/';
var sources = [templateRoot + '**/*'];
var destination = sourceroot + 'Games/' + gameName;

gulp.src('gameName.js')
    .pipe(replace(/gameName\s{0,}=\s{0,}[\w\']{0,};/g, 'gameName = \'' + gameName + '\';'))
    .pipe(gulp.dest('./'));

gulp.src(sources, {base: templateRoot })
    .pipe(replace('Run(\'GameTemplate\',', 'Run(\'' + gameName + '\','))
    .pipe(gulp.dest(destination));