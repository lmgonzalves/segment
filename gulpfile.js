var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

/**
 * Static server
 */
gulp.task('serve', ['sass', 'compress'], function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch('scss/*.scss', ['sass']);
    gulp.watch('dist/segment.js', ['compress']);
    gulp.watch(['index.html', 'js/*']).on('change', browserSync.reload);
});

/**
 * Compile files from scss into css
 */
gulp.task('sass', function () {
    return gulp.src('scss/demo.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['scss'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({stream:true}));
});

/**
 * Create min version
 */
gulp.task('compress', function() {
    return gulp.src('dist/segment.js')
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({stream:true}));
});

/**
 * Default task
 */
gulp.task('default', ['serve']);
