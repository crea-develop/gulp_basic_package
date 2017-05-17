var gulp            = require('gulp');

var uglify          = require('gulp-uglify');

var imagemin        = require('gulp-imagemin');

var prettify        = require('gulp-prettify');

var cssbeautify     = require('gulp-cssbeautify');
var autoprefixer    = require('gulp-autoprefixer');
var cssmin          = require('gulp-cssmin');

var rename          = require('gulp-rename');
var plumber         = require('gulp-plumber');
var concat          = require('gulp-concat');
var changed         = require('gulp-changed');
var del             = require('del');

var paths = {
    dist        : 'dist/',
    html        : 'src/**/*.html',
    image       : 'src/**/*.+(jpg|gif|png)',
    css         : {
        pc      : 'src/assets/css/*.css',
        sp      : 'src/sp/assets/css/*.css',
        src     : 'src/**/*.css',
        dist    : {
            pc  : 'dist/assets/css/',
            sp  : 'dist/sp/assets/css/'
        }
    },
    js          : {
        pc      : 'src/assets/js/*.js',
        sp      : 'src/sp/assets/js/*.js',
        src     : 'src/**/*.js',
        dist    : {
            pc  : 'dist/assets/js/',
            sp  : 'dist/sp/assets/js/'
        }
    },
    other : 'src/**/*.!(jpg|gif|png|php|html|scss|css|js)'
};

var common_js_sort_pc = [
  'src/assets/js/common/jquery-3.2.0.min.js',
  'src/assets/js/common/jquery.easing.js'
];

var common_js_sort_sp = [
  'src/sp/assets/js/common/jquery-3.2.0.min.js',
  'src/sp/assets/js/common/jquery.easing.js'
];

// =======================================================
//    Common tasks
// =======================================================

// 画像の圧縮タスク
// ====================
gulp.task('image', function() {
    gulp
    .src(paths.image)
    .pipe(plumber(paths.image))
    .pipe(changed(paths.dist))
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist));
});

// HTMLの整形タスク
// ====================
gulp.task('html', function () {
    gulp
    .src(paths.html)
    .pipe(plumber(paths.html))
    .pipe(changed(paths.dist))
    .pipe(prettify())
    .pipe(gulp.dest(paths.dist));
});

// cssのminifyタスク
// ====================
gulp.task('css', ['css_min', 'css_min_sp']);

// jsのminifyタスク
// ====================
gulp.task('js', ['main_js', 'common_js', 'main_js_sp', 'common_js_sp']);

// HTML, CSS, JS, 画像以外のファイルをdistにコピーする
gulp.task('copy', function () {
    gulp
    .src(paths.other)
    .pipe(gulp.dest(paths.dist));
});

// 監視タスク
// ====================
gulp.task('watch', function() {
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.css.src, ['css']);
    gulp.watch(paths.js.src,   ['js']);
    gulp.watch(paths.other, ['copy']);
});

// 一括処理タスク
// ====================
gulp.task('default', ['html', 'css', 'js', 'image', 'copy']);

// distの中身を全削除
// ※※※　distの中だけに動画ファイルとかおいていると全部消えるのでお気をつけください　※※※
gulp.task('clean', function () {
    return del([paths.dist + '**/*']);
});


// =======================================================
//    PC tasks
// =======================================================

// CSS concat & minify task
gulp.task('css_min', function () {
  gulp
  .src(paths.css.pc)
  .pipe(plumber(paths.css.pc))
  .pipe(changed(paths.css.dist.pc))
  .pipe(autoprefixer())
  .pipe(cssbeautify())
  .pipe(cssmin())
  .pipe(concat('style.css'))
  .pipe(gulp.dest(paths.css.dist.pc));
});

//  JavaScript minify task
gulp.task('main_js', function() {
  gulp
  .src(paths.js.pc)
  .pipe(plumber())
  .pipe(uglify({preserveComments: 'some'}))
  .pipe(changed(paths.js.dist.pc))
  .pipe(gulp.dest(paths.js.dist.pc));
});

//  JavaScript concat & minify task
gulp.task('common_js', function() {
  gulp
  .src(common_js_sort_pc) // gulp/config.jsで設定
  .pipe(plumber())
  .pipe(uglify({preserveComments: 'some'})) // minify
  .pipe(changed(paths.js.dist.pc))
  .pipe(concat('common.js'))                // 結合
  .pipe(gulp.dest(paths.js.dist.pc));
});



// =======================================================
//    SP tasks
// =======================================================

// CSS concat & minify task
gulp.task('css_min_sp', function () {
  gulp
  .src(paths.css.sp)
  .pipe(plumber(paths.css.sp))
  .pipe(changed(paths.css.dist.sp))
  .pipe(autoprefixer())
  .pipe(cssbeautify())
  .pipe(cssmin())
  .pipe(concat('style.css'))
  .pipe(gulp.dest(paths.css.dist.sp));
});

//  JavaScript minify task
gulp.task('main_js_sp', function() {
  gulp
  .src(paths.js.sp)
  .pipe(plumber())
  .pipe(uglify({preserveComments: 'some'}))
  .pipe(changed(paths.js.dist.sp))
  .pipe(gulp.dest(paths.js.dist.sp));
});

//  JavaScript concat & minify task
gulp.task('common_js_sp', function() {
  gulp
  .src(common_js_sort_sp) // gulp/config.jsで設定
  .pipe(plumber())
  .pipe(uglify({preserveComments: 'some'})) // minify
  .pipe(changed(paths.js.dist.sp))
  .pipe(concat('common.js'))                // 結合
  .pipe(gulp.dest(paths.js.dist.sp));
});