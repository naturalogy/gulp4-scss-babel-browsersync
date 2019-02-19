const autoprefixer = require('autoprefixer');
const babel        = require('gulp-babel');
const browsersync  = require('browser-sync').create();
const concat       = require('gulp-concat');
const gulp         = require('gulp');
const imagemin     = require('gulp-imagemin');
const newer        = require('gulp-newer');
const plumber      = require('gulp-plumber');
const postcss      = require('gulp-postcss');
const rename       = require('gulp-rename');
const sass         = require('gulp-sass');
const uglify       = require('gulp-uglify');

const pathSrc = {
  sass: 'src/sass/',
  js: 'src/js/',
  img: 'src/img/'
};

const pathDist = {
  root: 'public/',
  css: 'public/css/',
  js: 'public/js/',
  img: 'public/img/'
};

const watchAlso = ['public/**/*.html', 'public/img/*'];

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
  const plugins = [
    autoprefixer({
      browsers: [
      'last 1 version',
      '> 1%',
      'maintained node versions',
      'not dead'
      ]
    }),
  ];
  return gulp
    .src(pathSrc.sass + '**/*')
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(postcss(plugins))
    .pipe(gulp.dest(pathDist.css))
    .pipe(browsersync.stream());
}

function scripts() {
  return (
    gulp
      .src(pathSrc.js + '**/*')
      .pipe(plumber())
      .pipe(babel())
      .pipe(concat('main.js'))
      .pipe(gulp.dest(pathDist.js))
      .pipe(
        rename({
          suffix: '.min'
        })
      )
      .pipe(uglify())
      .pipe(gulp.dest(pathDist.js))
      .pipe(browsersync.stream())
  );
}

function images() {
  return gulp
    .src(pathSrc.img + '**/*')
    .pipe(newer(pathDist.img))
    .pipe(
      imagemin([
        imagemin.gifsicle({
          interlaced: true
        }),
        imagemin.jpegtran({
          progressive: true
        }),
        imagemin.optipng({
          optimizationLevel: 5
        }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest(pathDist.img));
}

function watchFiles() {
  gulp.watch(pathSrc.sass + '**/*', css);
  gulp.watch(pathSrc.js + '**/*', scripts);
  gulp.watch(pathSrc.img + '**/*', images);
  gulp.watch(watchAlso, browserSyncReload);
}

const build = gulp.parallel(css, images, scripts);
const watch = gulp.parallel(watchFiles, browserSync);

exports.css     = css;
exports.scripts = scripts;
exports.images  = images;
exports.build   = build;
exports.watch   = watch;
exports.default = watch;
