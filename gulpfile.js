var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var replace = require('gulp-replace');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var savefile = require('gulp-savefile');

gulp.task('default', function() {
    return gulp.src('./scss/styles.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(rename('theme.css'))
        .pipe(gulp.dest('./assets/'))
        .pipe(savefile());
});

gulp.task('watch', function() {
    gulp.watch(['./scss/**/*.scss'], gulp.series('default'));
});