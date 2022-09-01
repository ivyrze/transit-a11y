import gulp from 'gulp';

const build = () => {
    return gulp.src('node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('public/js/vendor/'));
};

export default build;