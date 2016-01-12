var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    insert = require('gulp-insert');

/**
 * Static server
 */
gulp.task('serve', ['sass', 'dist'], function(){
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch('scss/*.scss', ['sass']);
    gulp.watch('dist/segment.js', ['dist']);
    gulp.watch(['index.html', 'js/*']).on('change', browserSync.reload);
});

/**
 * Compile files from scss into css
 */
gulp.task('sass', function(){
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
 * Create distributable versions
 */
gulp.task('dist', function(){
    gulp.src('dist/segment.js')
        .pipe(rename({suffix: '.node'}))
        .pipe(insert.append('\n\nmodule.exports = Segment;'))
        .pipe(gulp.dest('dist'));

    return gulp.src('dist/segment.js')
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({stream:true}));
});

/**
 * Default task
 */
gulp.task('default', ['serve']);
