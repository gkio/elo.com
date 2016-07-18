var gulp     = require('gulp')
var postcss  = require('gulp-postcss');
var watch    = require('gulp-watch')
var cssnext  = require('postcss-cssnext')
var cleanCSS = require('gulp-clean-css');

gulp.task('minify-css', function() {
  return gulp.src('public/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('public/min-css/'));
});

gulp.task('css', function () {

	var processors = [
    cssnext( {
			'customProperties':true,
			'colorFunction':true,
			'curstomSelectros':true,
		}),
	]

  return gulp.src('./public/stylesheets/*.css')
  	.pipe(postcss(processors))
      .pipe(postcss([ require('postcss-animation'),
      	require('postcss-color-gray'),
      	require('autoprefixer'),
        require('precss'),
        require('rucksack-css'),
        require('postcss-import'),
      	require('postcss-center'),
      	require('postcss-responsive-images'),
      	require('postcss-input-style'),
      	 ]))        
      .pipe( gulp.dest('./public/css/') )
        
});

gulp.task('watch',function(){
  gulp.watch('./public/css/*.css',['minify-css'])
  gulp.watch('./public/stylesheets/*.css',['css'])
})

gulp.task('default',['css','minify-css','watch'])