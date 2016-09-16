const gulp = require('gulp');
const browserSync = require('browser-sync');
const imagemin = require('gulp-imagemin');
const conf = require('../conf/gulp.conf');

gulp.task('imagemin', images);

function images(){
  return gulp.src([conf.path.src('app/images/**/*.{png,jpg,jpeg}')])
    .pipe(imagemin())
    .pipe(gulp.dest(conf.path.tmp('app/images/')))
    .pipe(browserSync.stream());
}
