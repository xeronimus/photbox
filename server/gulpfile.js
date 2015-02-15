var
  gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  eslint = require('gulp-eslint');

var paths = {
  jsFiles: ['lib/**/*.js', 'index.js', 'gulpfile.js'],
  jsTestFiles: ['test/**/*.js']
};
/**
 *  Lints all js files with ESLint
 * */
gulp.task('lint', function () {
  gulp.src(paths.jsFiles)
    .pipe(eslint())
    .pipe(eslint.format());
});


gulp.task('test', function () {
  return gulp.src(paths.jsTestFiles, {read: false})
    .pipe(mocha({reporter: 'spec'}));
});


gulp.task('dev', ['lint', 'test'], function () {
  gulp.watch(paths.jsFiles, ['lint', 'test']);
  gulp.watch(paths.jsTestFiles, ['lint', 'test']);
});
