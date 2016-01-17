'use strict';

let gulp = require('gulp');
let babel = require('gulp-babel');
// let mocha = require('gulp-mocha');
let jshint = require('gulp-jshint');
let plumberNotifier = require('gulp-plumber-notifier');

var config = {
  paths: {
    js: {
      src: 'src/**/*.js',
      dist: 'dist/'
    }
  }
};

gulp.task('babel', ['babel-src']);

gulp.task('babel-src', ['lint-src'], () =>
  gulp.src(config.paths.js.src)
  .pipe(plumberNotifier())
  .pipe(babel())
  .pipe(gulp.dest(config.paths.js.dist))
);

gulp.task('lint-src', () =>
  gulp.src(config.paths.js.src)
  .pipe(plumberNotifier())
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
);

gulp.task('lint-test', () =>
  gulp.src(config.paths.test.src)
  .pipe(plumberNotifier())
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
);

gulp.task('watch', () => {
  gulp.watch(config.paths.js.src, ['babel-src']);
  // gulp.watch(config.paths.js.src, ['babel-src', 'test']);
  // gulp.watch(config.paths.test.src, ['babel-test', 'test']);
});

// Default Task
gulp.task('default', ['babel', 'watch']);