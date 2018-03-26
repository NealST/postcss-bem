const gulp = require('gulp')
const babel = require('gulp-babel')

gulp.task('build', () => {
  gulp.src('./index.js')
    .pipe(babel({
      presets: ['env']
    })).pipe(gulp.dest('lib'))
})
