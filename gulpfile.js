var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
  	concat = require('gulp-concat'),
  	uglify = require('gulp-uglify'),
  	cssmin = require('gulp-clean-css'),
  	rename = require( 'gulp-rename' ),
    rimraf = require('rimraf'),
    babel = require("gulp-babel"),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {
  dist: { // where to put files after building
    html: 'dist/',
    js: 'dist/js/',
    css: 'dist/css/',
    img: 'dist/img/',
    fonts: 'dist/fonts/'
  },
  src: { // paths to source files
    html: 'src/*.html',
    js: 'src/js/main.js',
    style: 'src/style/main.scss',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  watch: { // files we want to watch
    html: 'src/**/*.html',
    js: 'src/js/**/*.js',
    style: 'src/style/**/*.scss',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  clean: './dist'
};

var config = {
  server: {
    baseDir: "./dist"
  },
  tunnel: true,
  host: 'localhost',
  port: 9000,
  injectChanges: true,
};

gulp.task('html:build', function () {
  gulp.src(path.src.html)
    .pipe(gulp.dest(path.dist.html))
    .pipe(reload({stream: true}));
});

gulp.task('js:build', function() {
	return gulp.src([
		// 'node_modules/path...',
		path.src.js, // Always at the end
		])
  .pipe(babel({
    presets: ['env']
  }))
	.pipe(concat('main.js'))
	.pipe(gulp.dest(path.dist.js))
	.pipe(uglify())
	.pipe(rename({ suffix: '.min' }))
	.pipe(gulp.dest(path.dist.js))
	.pipe(reload({stream: true}));
});


gulp.task('style:build', function () {
  gulp.src(path.src.style)
    .pipe(sass({
        errorLogToConsole: true,
        outputStyle: 'expanded'
      }))
    .on('error', function (err) {
        console.error('Error!', err.message);
    })
    .pipe(prefixer({
            browsers: ['last 5 versions']
        }))
  	.pipe(gulp.dest(path.dist.css))
    // .pipe(cssmin())
  	// .pipe(rename({ suffix: '.min' }))
    // .pipe(gulp.dest(path.dist.css))
    .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
  gulp.src(path.src.img)
    .pipe(gulp.dest(path.dist.img))
    .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.dist.fonts))
});


gulp.task('build', [
  'html:build',
  'js:build',
  'style:build',
  'fonts:build',
  'image:build'
]);

gulp.task('watch', function(){
  watch([path.watch.html], function(event, cb) {
    gulp.start('html:build');
  });
  watch([path.watch.style], function(event, cb) {
    gulp.start('style:build');
  });
  watch([path.watch.js], function(event, cb) {
    gulp.start('js:build');
  });
  watch([path.watch.img], function(event, cb) {
    gulp.start('image:build');
  });
  watch([path.watch.fonts], function(event, cb) {
    gulp.start('fonts:build');
  });
});

gulp.task('webserver', function () {
  browserSync(config);
});

gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);
