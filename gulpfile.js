var gulp = require('gulp');
var watch = require('gulp-watch');
var batch = require('gulp-batch');

var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var inject = require('gulp-inject');
var del = require('del');

gulp.task('default', ['serve']);

gulp.task('serve', function () {
    gulp.watch('./src/less/*.less', batch(function (events, done) {
        gulp.start('build', done);
    }));

    gulp.watch('./src/**/*.js', batch(function (events, done) {
        gulp.start('build', done);
    }));

    gulp.watch(['./src/**/*.html', '!./src/index.html'], batch(function (events, done) {
        gulp.start('build', done);
    }));
});

gulp.task('build', ['addGenerationHeaders', 'copyHtmlPartials', 'copyFonts', 'copyJson']);

gulp.task('copyHtmlPartials', ['clean'], function () {
    var sources = gulp.src(['./src/**/*.html']);

    sources.pipe(gulp.dest('./target'));
});

gulp.task('copyJson', ['clean'], function () {
    var sources = gulp.src(['./src/**/*.json']);

    sources.pipe(gulp.dest('./target'));
});

gulp.task('copyFonts', ['clean'], function () {
    var sources = gulp.src(['./node_modules/bootstrap-less/fonts/**/*.*']);

    sources.pipe(gulp.dest('./target/fonts/'));
});

gulp.task('injectApp', ['clean', 'compileLess'], function () {
    var target = gulp.src('./src/index.html');
    // It's not necessary to read the files (will speed up things), we're only
    // after their paths:
    var sources = gulp.src(['./src/**/*.js', './src/**/*.css'], {
        read: false
    });

    return target.pipe(inject(sources, {
        relative: true
    })).pipe(gulp.dest('./src'));
});

gulp.task('compileLess', function () {
    return gulp.src('src/less/*.less')
        .pipe(less({
            paths: [
                '.',
                './node_modules/bootstrap-less'
            ]
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('src/css'));
});

gulp.task('minify', ['injectApp'], function () {
    return gulp.src('./src/index.html')
        .pipe(usemin({
            js: [uglify()],
            css: [cleanCSS()]
        })).pipe(gulp.dest('target/'));
});

gulp.task('addGenerationHeaders', ['minify'], function () {
    gulp.src('./target/js/*.js').pipe(header('/* This file was generated! Do not edit by hand! */\n')).pipe(
        gulp.dest('target/js'));

    gulp.src('./target/css/*.css').pipe(header('/* This file was generated! Do not edit by hand! */\n')).pipe(
        gulp.dest('target/css'));

    gulp.src('./target/**/*.html').pipe(header('<!-- This file was generated! Do not edit by hand! -->\n')).pipe(
        gulp.dest('target/'));
});

gulp.task('clean', function () {
    return del(['./target/**/*']);
});