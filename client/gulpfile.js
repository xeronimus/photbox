var
  gulp = require('gulp'),
  eslint = require('gulp-eslint'),
  webserver = require('gulp-webserver'),
  gutil = require('gulp-util'),
  htmlreplace = require('gulp-html-replace'),
  stylus = require('gulp-stylus'),
  concat = require('gulp-concat'),
  jade = require('gulp-jade'),
  exec = require('child_process').exec;

var server = {
  host: 'localhost',
  port: '8001',
  root: './app'
};

/**
 *   compiles our jade files to html
 * */
gulp.task('jade', function () {
  var YOUR_LOCALS = {};

  gulp.src('./app/**/*.jade')
    .pipe(jade({
      pretty: true,
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./app/'))
});

/**
 *   compiles our stylus files to css
 * */
gulp.task('stylus', function () {
  gulp.src('./app/styles/*.styl')
    .pipe(stylus())
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./app/styles'));
});

/**
 * Starts the app with browser-sync
 * */
gulp.task('serve', ['jade', 'stylus'], function () {
  gulp.src(server.root)
    .pipe(webserver({
      host: server.host,
      port: server.port,
      open: true,
      livereload: true,
      directoryListing: false
    }));

  gulp.watch('./app/**/*.jade', ['jade']);
  gulp.watch('./app/styles/*.styl', ['stylus']);
});


/**
 *  Lints all js files in /app with ESLint
 * */
gulp.task('lint', function () {
  gulp.src(['app/**/*.js', 'test/**/*.js', '!app/bower_components/**/*'])
    .pipe(eslint())
    .pipe(eslint.format());
});


/**
 * Build
 * */
gulp.task('build', ['lint', 'jade', 'assemble', 'html-replace']);

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
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./dist'));

  // concatenate all 3rd party js files (bower_components)
  gulp.src([
    './app/bower_components/angular/angular.min.js',
    './app/bower_components/angular-resource/angular-resource.min.js',
    './app/bower_components/angular-sanitize/angular-sanitize.min.js'
  ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./dist/'));

  //  concatenates our own css files
  gulp.src('./app/styles/*.css')
    .pipe(concat('app.css'))
    .pipe(gulp.dest('./dist/styles'));

  // copies resources
  gulp.src('./app/fonts/**')
    .pipe(gulp.dest('./dist/fonts'));
  gulp.src('./app/images/*')
    .pipe(gulp.dest('./dist/images'));

});

/**
 *  replace build blocks in index.html
 */
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
 * copies client dist to remote host
 */
gulp.task('deploy', function (done) {
  var deployHost = '192.168.0.9';
  var deployUser = 'pi';
  var deployPath = '~/git/photbox/client';
  exec('rsync -P -r dist/ ' + deployUser + '@' + deployHost + ':' + deployPath, function (err, stdout) {
    console.log(stdout);
    done(err);
  });

});

/**
 *  The default task
 * */
gulp.task('default', ['build']);


