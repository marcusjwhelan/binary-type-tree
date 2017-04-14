'use strict';

const gulp        = require('gulp'),
  runSequence = require('run-sequence'),
  clean       = require('gulp-clean'),
  spawn       = require('child_process').spawn;

const runSpawn = function(done, task, opt_arg, opt_io) {
  opt_arg = typeof opt_arg !== 'undefined' ? opt_arg : [];
  let stdio = 'inherit';
  if (opt_io === 'ignore') {
    stdio = 'ignore';
  }
  let child = spawn(task, opt_arg, {stdio: stdio});
  let running = false;
  child.on('close', function() {
    if (!running) {
      running = true;
      done();
    }
  });
  child.on('error', function() {
    if (!running) {
      console.error('gulp encountered a child error');
      running = true;
      done();
    }
  });
};

gulp.task('clean', function () {
  return gulp.src('built', {read: false})
  .pipe(clean());
});

gulp.task('tsc', function(done) {
  runSpawn(done, 'node', ['node_modules/typescript/lib/tsc']);
});

gulp.task('tsc:w', function(done) {
  runSpawn(done, 'node', ['node_modules/typescript/lib/tsc', '-w']);
});

gulp.task('built:copy', function () {
  return gulp.src(['lib/**/*.js'])
  .pipe(gulp.dest('built/'));
});

gulp.task('prepublish', function (done) {
  runSequence('clean','tsc', 'built:copy', done);
});

gulp.task('w', function (done) {
  runSequence('tsc:w', 'built:copy', done);
});

gulp.task('default', ['prepublish']);
