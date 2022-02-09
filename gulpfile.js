const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser");
const rename = require("gulp-rename");
const del = require("del");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgSprite = require("gulp-svgstore");

// Styles

const styles = () => {
  return gulp
    .src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemap.write("."))
    .pipe(rename(function (path) {
      path.basename += ".min";
    }))
    .pipe(gulp.dest("docs/css"))
    .pipe(sync.stream());
};

exports.styles = styles;

// HtmlMin

const html = () => {
  return gulp
    .src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("docs"));
};

exports.html = html;

// Scripts

const scripts = () => {
  return gulp
    .src("source/js/*.js")
    .pipe(terser())
    .pipe(
      rename(function (path) {
        path.basename += ".min";
      })
    )
    .pipe(gulp.dest("docs/js"))
    .pipe(sync.stream());
};

exports.scripts = scripts;

// Copy

const copy = (done) => {
  return gulp
    .src(
      [
        "source/fonts/*.{woff2,woff}",
        "source/*.ico",
        "source/*.webmanifest",
      ],
      {
        base: "source",
      }
    )
    .pipe(gulp.dest("docs"));
  done();
};

exports.copy = copy;

// Images

const optimazeImages = (done) => {
  return gulp
    .src(["source/img/**/*.{jpg,png,svg}", "!source/img/video-controls/*.svg"])
    .pipe(
      imagemin([
        imagemin.mozjpeg({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.svgo(),
      ])
    )
    .pipe(gulp.dest("docs/img"));
  done();
};

exports.optimazeImages = optimazeImages;

const copyImages = (done) => {
  return gulp
    .src(["source/img/**/*.{jpg,png,svg}", "!source/img/video-controls/*.svg"])
    .pipe(gulp.dest("docs/img"));
  done();
};

exports.copyImages = copyImages;

// Webp

const createWebp = () => {
  return gulp
    .src(["source/img/**/*.{jpg,png}", "!source/img/favicons/*.png"])
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("docs/img"))
}

exports.createWebp = createWebp;

// Sprite

const createSprite = (done) => {
  return gulp
    .src("source/img/video-controls/*.svg")
    .pipe(svgSprite({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("docs/img/video-controls"));
}

exports.createSprite = createSprite;

// Clean

const clean = () => {
  return del("docs");
};

exports.clean = clean;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "docs",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

// Reload

const reload = (done) => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series(styles));
  gulp.watch("source/js/*.js", gulp.series(scripts));
  gulp.watch("source/*.html", gulp.series(html, reload));
}

exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    createSprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  )
  );

// Build

const build = gulp.series(
  clean,
  copy,
  optimazeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    createSprite,
    createWebp
  ),
);

exports.build = build;
