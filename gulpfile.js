const
  { src, dest, watch, parallel } = require('gulp'),
  autoprefixer = require('autoprefixer'),
  babel = require('gulp-babel'),
  browsersync = require('browser-sync').create(),
  concat = require('gulp-concat'),
  imagemin = require('gulp-imagemin'),
  mozjpeg = require('imagemin-mozjpeg'),
  newer = require('gulp-newer'),
  plumber = require('gulp-plumber'),
  pngquant = require('imagemin-pngquant'),
  postcss = require('gulp-postcss'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  uglify = require('gulp-uglify');

const pathSrc = {
  sass: 'src/sass/',
  js: 'src/js/',
  img: 'src/img/'
};

const pathDist = {
  root: 'dist/',
  css: 'dist/css/',
  js: 'dist/js/',
  img: 'dist/img/'
};

const watchAlso = ['dist/**/*.html', 'dist/img/*'];

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: pathDist.root
    }
  });
  done();
}

function browserSyncReload(done) {
  browsersync.reload();
  done();
}

function css() {
  const plugins = [autoprefixer({ grid: true })];
  return src(`${pathSrc.sass}**/*`)
    .pipe(
      plumber({
        errorHandler: function(err) {
          console.log(err.messageFormatted);
          this.emit('end');
        }
      })
    )
    .pipe(
      sass({
        outputStyle: 'compressed'
      })
    )
    .pipe(postcss(plugins))
    .pipe(dest(pathDist.css))
    .pipe(browsersync.stream());
}

function scripts() {
  return src(`${pathSrc.js}**/*`)
    .pipe(plumber())
    .pipe(babel())
    .pipe(concat('main.js'))
    .pipe(dest(pathDist.js))
    .pipe(
      rename({
        suffix: '.min'
      })
    )
    .pipe(uglify())
    .pipe(dest(pathDist.js))
    .pipe(browsersync.stream());
}

function images() {
  return src(`${pathSrc.img}**/*`)
    .pipe(newer(pathDist.img))
    .pipe(plumber())
    .pipe(
      imagemin([
        pngquant({
          quality: [0.64, 0.72]
        }),
        mozjpeg({
          quality: 85,
          progressive: true
        }),
        imagemin.svgo(),
        imagemin.optipng(),
        imagemin.gifsicle()
      ])
    )
    .pipe(dest(pathDist.img));
}

function watchFiles() {
  watch(`${pathSrc.sass}**/*`, css);
  watch(`${pathSrc.js}**/*`, scripts);
  watch(`${pathSrc.img}**/*`, images);
  watch(watchAlso, browserSyncReload);
}

const build = parallel(css, images, scripts);
const watch = parallel(watchFiles, browserSync);

exports.css = css;
exports.scripts = scripts;
exports.images = images;
exports.build = build;
exports.watch = watch;
exports.default = watch;
