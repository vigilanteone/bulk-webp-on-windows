const gulp 			= require('gulp'),
	  webp 			= require('gulp-webp'),
	  notify 		= require('gulp-notify'),
	  imageResize 	= require('gulp-image-resize'),
	  gulpif 		= require('gulp-if');

// fetch command line arguments
const arg = (argList => {

	let arg = {}, a, opt, thisOpt, curOpt;

  	for (a = 0; a < argList.length; a++) {

		thisOpt = argList[a].trim();
		opt = thisOpt.replace(/^\-+/, '');

		if (opt === thisOpt) {

			// argument value
			if (curOpt) arg[curOpt] = opt;
			curOpt = null;

		} else {

			// argument name
			curOpt = opt;
			arg[curOpt] = true;

		}

	}

	return arg;

})(process.argv);

let resize = arg.resize || false;
resize = (resize === 'true') ? true : false;

gulp.task('default', () =>
	gulp.src('src/*.{jpg,png}')
		.pipe( gulpif( resize, imageResize({
			width : 768,
			height : 768,
			crop : true,
			gravity: 'South',
			upscale : false,
			imageMagick: false
		})))
		.pipe( webp({
			quality: 85,
			method: 3,
			preset: 'photo',
			sharpness: 3
		}))
		.pipe( gulp.dest('dist') )
		.pipe( 
			gulpif( 
				resize, 
				notify({ 
					message: '\n\n✅  ===> CROP/RESIZE & WEBP CONVERSION — completed!\n', 
					onLast: true 
				}), notify({ 
					message: '\n\n✅  ===> WEBP CONVERSION — completed!\n', 
					onLast: true 
				}) 
			)
		)    
)