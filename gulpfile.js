/**
 * A simple Gulp 4 Starter Kit for modern web development.
 *
 * @package @jr-cologne/create-gulp-starter-kit
 * @author JR Cologne <kontakt@jr-cologne.de>
 * @copyright 2020 JR Cologne
 * @license https://github.com/jr-cologne/gulp-starter-kit/blob/master/LICENSE MIT
 * @version v0.11.0-beta
 * @link https://github.com/jr-cologne/gulp-starter-kit GitHub Repository
 * @link https://www.npmjs.com/package/@jr-cologne/create-gulp-starter-kit npm package site
 *
 * ________________________________________________________________________________
 *
 * gulpfile.js
 *
 * The gulp configuration file.
 *
 */

const gulp = require('gulp'),
  del = require('del'),
  sourcemaps = require('gulp-sourcemaps'),
  plumber = require('gulp-plumber'),
  notify = require('gulp-notify'),
  sass = require('gulp-sass'),
  less = require('gulp-less'),
  stylus = require('gulp-stylus'),
  autoprefixer = require('gulp-autoprefixer'),
  minifyCss = require('gulp-clean-css'),
  babel = require('gulp-babel'),
  webpack = require('webpack-stream'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  imagemin = require('gulp-imagemin'),
  browserSync = require('browser-sync').create(),
  pug = require('gulp-pug'),
  dependents = require('gulp-dependents'),

  src_folder = './src/',
  src_assets_folder = src_folder,  //src_folder + 'assets/',
  dist_folder = './dist/',
  dist_assets_folder = dist_folder,  //dist_folder + 'assets/'
  node_modules_folder = './node_modules/',
  dist_node_modules_folder = dist_folder + 'node_modules/',

  node_dependencies = Object.keys(require('./package.json').dependencies || {});

gulp.task('clear', () => del([dist_folder]));

gulp.task('html', () => {
  return gulp.src([src_folder + '**/*.html'], {
    base: src_folder,
    since: gulp.lastRun('html')
  })
    .pipe(gulp.dest(dist_folder))
    .pipe(browserSync.stream());
});

gulp.task('pug', () => {
  return gulp.src([src_folder + 'pug/**/!(_)*.pug'], {
    base: src_folder + 'pug',
    since: gulp.lastRun('pug')
  })
    .pipe(plumber({
      errorHandler: notify.onError({
        message: 'Error: <%= error.message %>',
        title: 'TaskError'
      })
    }))
    .pipe(pug())
    .pipe(gulp.dest(dist_folder))
    .pipe(browserSync.stream());
});

gulp.task('sass', () => {
  return gulp.src([
    src_assets_folder + 'sass/**/*.sass',
    src_assets_folder + 'scss/**/*.scss'
  ], { since: gulp.lastRun('sass') })
    .pipe(sourcemaps.init())
    .pipe(plumber({
      errorHandler: notify.onError({
        message: 'Error: <%= error.message %>',
        title: 'TaskError'
      })
    }))
    .pipe(dependents())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(minifyCss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist_assets_folder + 'css'))
    .pipe(browserSync.stream());
});

gulp.task('less', () => {
  return gulp.src([src_assets_folder + 'less/**/!(_)*.less'], { since: gulp.lastRun('less') })
    .pipe(sourcemaps.init())
    .pipe(plumber({
      errorHandler: notify.onError({
        message: 'Error: <%= error.message %>',
        title: 'TaskError'
      })
    }))
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(minifyCss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist_assets_folder + 'css'))
    .pipe(browserSync.stream());
});

gulp.task('stylus', () => {
  return gulp.src([src_assets_folder + 'stylus/**/!(_)*.styl'], { since: gulp.lastRun('stylus') })
    .pipe(sourcemaps.init())
    .pipe(plumber({
      errorHandler: notify.onError({
        message: 'Error: <%= error.message %>',
        title: 'TaskError'
      })
    }))
    .pipe(stylus())
    .pipe(autoprefixer())
    .pipe(minifyCss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist_assets_folder + 'css'))
    .pipe(browserSync.stream());
});

gulp.task('js', () => {
  return gulp.src([src_assets_folder + 'js/**/*.js'], { since: gulp.lastRun('js') })
    .pipe(plumber({
      errorHandler: notify.onError({
        message: 'Error: <%= error.message %>',
        title: 'TaskError'
      })
    }))
    .pipe(webpack({
      mode: 'production'
    }))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist_assets_folder + 'js'))
    .pipe(browserSync.stream());
});

gulp.task('plugin-js', () => {
  return gulp.src([src_assets_folder + 'plugin-js/**/*.js'], { since: gulp.lastRun('plugin-js') })
    .pipe(plumber({
      errorHandler: notify.onError({
        message: 'Error: <%= error.message %>',
        title: 'TaskError'
      })
    }))
    .pipe(gulp.dest(dist_assets_folder + 'plugin-js'))
    .pipe(browserSync.stream());
});

gulp.task('img', () => {
  return gulp.src([src_assets_folder + 'img/**/*.+(png|jpg|jpeg|gif|svg|ico)'], { since: gulp.lastRun('img') })
    .pipe(plumber({
      errorHandler: notify.onError({
        message: 'Error: <%= error.message %>',
        title: 'TaskError'
      })
    }))
    .pipe(imagemin())
    .pipe(gulp.dest(dist_assets_folder + 'img'))
    .pipe(browserSync.stream());
});

gulp.task('video', () => {
  return gulp.src([src_assets_folder + 'video/**/*.+(mp4)'], { since: gulp.lastRun('video') })
    .pipe(plumber({
      errorHandler: notify.onError({
        message: 'Error: <%= error.message %>',
        title: 'TaskError'
      })
    }))
    .pipe(gulp.dest(dist_assets_folder + 'video'))
    .pipe(browserSync.stream());
})

gulp.task('vendor', () => {
  if (node_dependencies.length === 0) {
    return new Promise((resolve) => {
      console.log("No dependencies specified");
      resolve();
    });
  }

  return gulp.src(node_dependencies.map(dependency => node_modules_folder + dependency + '/**/*.*'), {
    base: node_modules_folder,
    since: gulp.lastRun('vendor')
  })
    .pipe(gulp.dest(dist_node_modules_folder))
    .pipe(browserSync.stream());
});

gulp.task('build', gulp.series('clear', 'html', 'pug', 'sass', 'less', 'stylus', 'js', 'plugin-js', 'img', 'vendor', 'video'));

gulp.task('dev', gulp.series('html', 'pug', 'sass', 'less', 'stylus', 'js', 'plugin-js'));

gulp.task('serve', () => {
  return browserSync.init({
    server: {
      baseDir: ['dist']
    },
    port: 3000,
    open: false
  });
});

gulp.task('watch', () => {
  const watchImages = [
    src_assets_folder + 'img/**/*.+(png|jpg|jpeg|gif|svg|ico)'
  ];

  const watchVideos = [
    src_assets_folder + 'video/**/*.mp4'
  ];

  const watchVendor = [];

  node_dependencies.forEach(dependency => {
    watchVendor.push(node_modules_folder + dependency + '/**/*.*');
  });

  const watch = [
    src_folder + '**/*.html',
    src_folder + 'pug/**/*.pug',
    src_assets_folder + 'sass/**/*.sass',
    src_assets_folder + 'scss/**/*.scss',
    src_assets_folder + 'less/**/*.less',
    src_assets_folder + 'stylus/**/*.styl',
    src_assets_folder + 'js/**/*.js',
    src_assets_folder + 'plugin-js/**/*.js',
  ];

  gulp.watch(watch, gulp.series('dev')).on('change', browserSync.reload);
  gulp.watch(watchImages, gulp.series('img')).on('change', browserSync.reload);
  gulp.watch(watchVideos, gulp.series('video')).on('change', browserSync.reload);
  gulp.watch(watchVendor, gulp.series('vendor')).on('change', browserSync.reload);
});

gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')));
