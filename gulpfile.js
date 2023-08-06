const { src, dest, series, watch } = require('gulp');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const del = require('del');
const sass = require('gulp-sass')(require('sass'));

const compiler = require('webpack');
const webpack = require('webpack-stream');

function startServer() {
  browserSync.init({
    server: './app'
  });

  watch('src/assets/js/**/*.js', series(compileWebpack, reload));
  watch('src/assets/scss/**/*.scss', compileSass);
  watch('src/assets/images/**/*', series(copyImages, reload));
  watch('src/html/**/*.html').on('change', series(copyHtml, reload));
}

function clearDir() {
  return del(['./app/**/*']);
}

function compileSass() {
  return src('src/assets/scss/**/*.scss')
    .pipe(sass())
    .pipe(dest('app/assets/css'))
    .pipe(browserSync.stream());
}

function compileWebpack() {
  return src('src/assets/js/index.js')
    .pipe(webpack(require('./webpack.config.js'), compiler, function (err, stats) {
    }))
    // .pipe(babel({
    //   presets: ['@babel/preset-env']
    // }))
    .pipe(dest('app/assets/js/'));
}

function compileJs() {
  return src('src/assets/js/**/*.js')
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(dest('app/assets/js'));
}

function copyImages() {
  return src('src/assets/images/**/*')
    .pipe(dest('app/assets/images'));
}

function copyHtml() {
  return src('src/html/**/*.html')
    .pipe(dest('app'));
}

function copyVendor() {
  return src('src/assets/vendor/**/*')
    .pipe(dest('app/assets/vendor'))
}

function reload(cb) {
  browserSync.reload();
  cb();
}

exports.compileWebpack = compileWebpack;
exports.default = series(clearDir, copyHtml, copyVendor, copyImages, compileSass, compileWebpack, startServer);
