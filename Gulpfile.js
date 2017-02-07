const gulp = require('gulp');
const babelify = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const htmlLint = require('gulp-html-lint');
const sassLint = require('gulp-sass-lint');
const eslint = require('gulp-eslint');

gulp.task('run', () => {
  const bundler = browserify('./src/js/app.js', {debug:true})
    .transform(babelify, {presets: ['es2015']})
    .bundle();

  return bundler
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/js'));
});

gulp.task('lint', () => {
  return gulp.src(['src/**/*.js','!node_modules/**'])
  // eslint() attaches the lint output to the "eslint" property
  // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError());
});

gulp.task('sass', () => {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sassLint({
      rules: {
        'class-name-format': 'strictbem'
      },
      configFile: './.sass-lint.yml'
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('html-lint', function() {
  return gulp.src('./src/*.html')
    .pipe(htmlLint())
    .pipe(htmlLint.format())
    .pipe(htmlLint.failOnError())
    .pipe(gulp.dest('./public'));
});

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: "./public/"
    },
    open: false,
  });
});

gulp.task('watch', () => {
  gulp.watch('./src/js/**/*.*', ['lint', 'run']);
  gulp.watch('./src/sass/**/*.scss', ['sass']);
  gulp.watch('./src/**/*.html', ['html-lint']);
  gulp.watch(['./public/**/*.*','./css/**/*.*','./public/*.html']).on('change', browserSync.reload);
});

gulp.task('default', ['watch', 'lint', 'html-lint', 'run', 'sass', 'browser-sync']);