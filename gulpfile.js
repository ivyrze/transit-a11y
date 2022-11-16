import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import livereload from 'gulp-livereload';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';

const sass = gulpSass(dartSass);

export const styles = () => {
    return gulp.src('./public/scss/style.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest('./public/css/'));
};

export const scripts = () => {
    return gulp.src([
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/timeago/jquery.timeago.js'
        ])
        .pipe(gulp.dest('public/js/vendor/'));
};

const build = gulp.series(styles, scripts);
export default build;

const serve = done => {
    livereload.listen({ quiet: true });
    return nodemon({
        script: 'app.js',
        tasks: [ 'styles' ],
        ext: 'js json scss pug',
        ignore: [ 'seeder' ],
        done: done
    }).on('start', () => {
        setTimeout(() => livereload.reload(), 400);
    });
};

export const watch = gulp.series(build, serve);