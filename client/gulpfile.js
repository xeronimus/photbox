var
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  plugins = require('gulp-load-plugins')({lazy: false});

/**
 *   compiles our jade files to html
 * */
var jade = require('gulp-jade');
gulp.task('jade', function () {
  var YOUR_LOCALS = {};

  gulp.src('./app/*.jade')
    .pipe(jade({
      pretty: true,
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./app/'))
});

/**
 *   compiles our stylus files to css
 * */
var stylus = require('gulp-stylus');
gulp.task('stylus', function () {
  gulp.src('./app/styles/*.styl')
    .pipe(stylus())
    .pipe(plugins.concat('main.css'))
    .pipe(gulp.dest('./app/styles'));
});

/**
 * Starts the app with browser-sync
 * */
var browserSync = require('browser-sync');
var reload = browserSync.reload;
gulp.task('serve', ['jade', 'stylus'], function () {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });

  gulp.watch(['*.jade', 'scripts/**/*.js'], {cwd: 'app'}, ['jade', reload]);
  gulp.watch(['styles/**/*.styl'], {cwd: 'app'}, [ 'stylus', reload]);
});


/**
 *  Lints all js files in /app with ESLint
 * */
var eslint = require('gulp-eslint');
gulp.task('lint', function () {
  gulp.src(['app/**/*.js', 'test/**/*.js', '!app/bower_components/**/*'])
    .pipe(eslint())
    .pipe(eslint.format());
});


/**
 * Build
 * */
gulp.task('build', [ 'lint', 'jade', 'assemble', 'html-replace']);

var del = require('del');
gulp.task('clean', function (cb) {
  del(['./dist'], function (err) {
    if (err) {
      cb(err);
      return;
    }
    gutil.log('Cleaned dist directory...');
    cb();
  });
});


/**
 * assembles all files and copies them to ./dist/
 * */
gulp.task('assemble', ['clean'], function () {

  // concatenates our own js files
  gulp.src(['./app/scripts/module.js', './app/scripts/*.js'])
    .pipe(plugins.concat('app.js'))
    .pipe(gulp.dest('./dist'));

  // concatenate all 3rd party js files (bower_components)
  gulp.src(['./app/bower_components/**/dist/**/*.js', './app/bower_components/**/build/*.js', './app/bower_components/angular/angular.js', './app/bower_components/angular-bootstrap/ui-bootstrap.js'])
    .pipe(plugins.concat('vendor.js'))
    .pipe(gulp.dest('./dist/'));

  //  concatenates our own css files
  gulp.src('./app/styles/*.css')
    .pipe(plugins.concat('app.css'))
    .pipe(gulp.dest('./dist/styles'));

  // copies storage (cheat sheet files) , images
  gulp.src('./app/storage/*.json')
    .pipe(gulp.dest('./dist/storage'));
  gulp.src('./app/images/*')
    .pipe(gulp.dest('./dist/images'));

});


/**
 *  replace build blocks in index.html
 */
var htmlreplace = require('gulp-html-replace');
gulp.task('html-replace', ['clean', 'assemble'], function () {
  gulp.src('./app/index.html')
    .pipe(htmlreplace({
      'vendorjs': 'vendor.js',
      'css': 'styles/app.css',
      'js': 'app.js'
    }))
    .pipe(gulp.dest('dist/'));
});


/**
 *  The default task
 * */
gulp.task('default', ['build'], function () {
});


