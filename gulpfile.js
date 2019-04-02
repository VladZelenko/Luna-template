var gulpversion = '3';


var gulp = require('gulp'), 					// Подключаем Gulp
	sass = require('gulp-sass'), 				//Подключаем Sass пакет,
	browserSync = require('browser-sync'), 		// Подключаем Browser Sync
	concat = require('gulp-concat'), 			// Подключаем gulp-concat (для конкатенации файлов)
	uglify = require('gulp-uglifyjs'), 			// Подключаем gulp-uglifyjs (для сжатия JS)
	cssnano = require('gulp-cssnano'), 			// Подключаем пакет для минификации CSS
	rename = require('gulp-rename'), 			// Подключаем библиотеку для переименования файлов
	del = require('del'), 						// Подключаем библиотеку для удаления файлов и папок
	imagemin = require('gulp-imagemin'), 		// Подключаем библиотеку для работы с изображениями
	pngquant = require('imagemin-pngquant'), 	// Подключаем библиотеку для работы с png
	cache = require('gulp-cache'), 				// Подключаем библиотеку кеширования
	autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов

gulp.task('styles', function () {
	return gulp.src('app/scss/**/*.scss')
		.pipe(sass())																		 // Преобразуем Sass в CSS посредством gulp-sass
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
		.pipe(gulp.dest('app/css')) 														 // Выгружаем результата в папку app/css
		.pipe(browserSync.reload({ stream: true })) 										 // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function () {
	browserSync({
		server: { 											// Определяем параметры сервера
			baseDir: 'app' 									// Директория для сервера - app
		},
		notify: false 										// Отключаем уведомления
	});
});

gulp.task('scripts', function () {
	return gulp.src([ 													// Берем все необходимые библиотеки
		'app/libs/jquery/dist/jquery.min.js', 							// Берем jQuery
		'app/js/common.js'
	])
		.pipe(concat('scripts.min.js')) 									// Собираем их в кучу в новом файле libs.min.js
		.pipe(uglify()) 												// Сжимаем JS файл
		.pipe(gulp.dest('app/js')); 									// Выгружаем в папку app/js
});

gulp.task('css-libs', ['styles'], function () {
	return gulp.src('app/css/libs.css') 								// Выбираем файл для минификации
		.pipe(cssnano()) 												// Сжимаем
		.pipe(rename({ suffix: '.min' })) 								// Добавляем суффикс .min
		.pipe(gulp.dest('app/css')); 									// Выгружаем в папку app/css
});

gulp.task('clean', function () {
	return del.sync('dist'); 											// Удаляем папку dist перед сборкой
});

gulp.task('img', function () {
	return gulp.src('app/img/**/*') 									// Берем все изображения из app
		.pipe(cache(imagemin({ 											// С кешированием
			interlaced: true,
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img')); 									// Выгружаем на продакшен
});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})


if (gulpversion == 3) {
	gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function () {
		gulp.watch('app/scss/**/*.scss', ['styles']);
		gulp.watch('app/*.html', browserSync.reload);
		gulp.watch('app/js/**/*.js', browserSync.reload);
	});

	gulp.task('default', ['watch']);
}

if (gulpversion == 4) {
	gulp.task('watch', function () {
		gulp.watch('app/scss/**/*.sass', gulp.parallel('styles'));
		gulp.watch('app/*.html', browserSync.reload);
		gulp.watch('app/js/**/*.js', browserSync.reload);
	});

	gulp.task('default', gulp.parallel('watch', 'browser-sync', 'css-libs', 'scripts'));
}



// gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function () {

// 	var buildCss = gulp.src([ // Переносим библиотеки в продакшен
// 		'app/css/main.css',
// 		'app/css/libs.min.css'
// 	])
// 		.pipe(gulp.dest('dist/css'))

// 	var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
// 		.pipe(gulp.dest('dist/fonts'))

// 	var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
// 		.pipe(gulp.dest('dist/js'))

// 	var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
// 		.pipe(gulp.dest('dist'));

// });