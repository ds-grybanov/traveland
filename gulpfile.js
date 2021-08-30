const {src, dest, watch, parallel, series} = require('gulp'); //{src, dest}  - заданые переменные позволяют полностью пользоваться возможностями ГАЛПА

//series - задается конкретная последовательность действий

const scss = require('gulp-sass')(require('sass')); //Плагин GULP-SASS. Для конвертации файлов ".scss" в ".css"
const concat = require('gulp-concat')//Плагин GULP-CONCAT. Объединение двух файлов в один. Работает с css и js
const browserSync = require('browser-sync').create(); //Плагин GULP-browser-sync. Автоматическое обновление страницы при изменениях  в проекте
const uglify = require('gulp-uglify-es').default; //Плагин gulp-uglify-es. Сжимает файлы .js

const fileinclude = require('gulp-file-include');//Плагин gulp-file-include. Подключаем/добавляем блоки .html в главный .html

const autoprefixer = require('gulp-autoprefixer'); // ПЛагин для совместимости со старыми версиями бразуера
const imagemin = require('gulp-imagemin');// ПЛагин для сжатия изображений с расширением PNG, JPEG, GIF and SVG
const del = require('del');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');

function browsersync(){ 
    browserSync.init({  //как указано в документации инициализация плагина
        server: {
            baseDir: "app/" //папка сервера для настройки
        }
    });
}

function cleanDist(){
    return del('dist')
}

function fonts(){
    src('app/fonts/*.ttf')
        .pipe(ttf2woff())
        .pipe(dest('dist/fonts'));
    return src('app/fonts/**/*.ttf')    
        .pipe(ttf2woff2())
        .pipe(dest('dist/fonts'));
}

function images(){
    return src('app/img/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(dest('dist/img'))
        .pipe(browserSync.stream());
}

// function htmlInclude(){
//     return src('app/index.html')//1. Ищем с каким файлом работать либо доставать информацию с помощью "retutn src"
//         .pipe(fileinclude({//2. Через плагин пропускаем ".html" файл, где указаны подключения других ".html"
//         prefix: '@',       //3. ПО умолчанию ключевые символы подключения ".html"
//         basepath: '@file'
//       }))
//       .pipe(dest('dist'))//4. С помощью "dest" выгружаем файл из конверации в путь, который указан в скобках
//       .pipe(browserSync.stream());//5. Добавляем автоматическое обновление браузера в текущую функцию после всех изменений
// }

function scripts(){
    return src([
        'node_modules/jquery/dist/jquery.js',
        'app/js/main.js', 'app/js/slick.min.js'
        ])// 1. Ищем с каким файлом работать либо доставать информацию с помощью "retutn src"
        .pipe(concat('main.min.js'))//2. С помощью "concat" объдиняем в один сжатый файл
        .pipe(uglify())//3. Пропускаем файл ".js" через плагин 
        .pipe(dest('app/js'))//4. С помощью "dest" выгружаем файл из конверации в путь, который указан в скобках
        .pipe(browserSync.stream());//5. Добавляем автоматическое обновление браузера в текущую функцию после всех изменений
}



function styles(){ //создаем функции для конвертации файла стиля
    return src('app/scss/style.scss') // 1. Ищем с каким файлом работать либо доставать информацию с помощью "retutn src"
        .pipe(scss({outputStyle: 'compressed'}))   //2. Пропускаем/конвертируем файл ".scss" через плагин и с помощью 'compressed'  сжимаем файл
        .pipe(concat('style.min.css'))//3. С помощью "concat" выгружаем объдиненный сжатый файл
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],// Для работы с 10 последними версиями браузеров
            grid: true
        }))
        .pipe(dest('app/css'))   //4. С помощью "dest" выгружаем файл из конверации в путь, который указан в скобках
        .pipe(browserSync.stream());  //5. Добавляем автоматическое обновление браузера в текущую функцию
}

function build(){ //Функция для выгрузки готовых файлов в папку "dist"
    return src([ // указываем какие файлы будем выгружать в "dist"
        'app/css/style.min.css',
        // 'app/fonts/**/*',
        'app/js/main.min.js',
        'app/index.html'
    ], {base: 'app'}) // указываем сохранность папок выгружать в "dist"
    .pipe(dest('dist'))// указываем путь выгрузки указанных файлов
}

function watching(){//функция слежения за изменениями в файле в реальном времени и сохранение изменений
    watch(['app/scss/**/*.scss'], styles);// " watch" сюда приписываем путь к файлу за которым необходимо следить. 
                                            //!!!!ВАЖНО!!!  /**/*.расширение - такая запись за слежением всех вложенных файлов в папке с заданным расширением. 
                                            //Через запятую указывается действие, которое должно происходить после нахождения файла. В данном случае запуск Экспорта функции "styles"
    watch(['app/*.html']).on('change', browserSync.reload);  //Когда " watch" следит за файлом .html, где в реальном времени внесутся изменения в файл проекта, browserSync перезагрузит браузер, где отобразятся  изменения

    // watch(['app/*.html'], htmlInclude);
    
    watch(['app/js/**/*.js' ,'!app/js/main.min.js'], scripts);// " watch" сюда приписываем путь к файлу за которым необходимо следить. В данном случае указано, что следить необходимо за всеми файлами ".js" КРОМЕ !app/js/main.min.js'.
    
}

exports.styles = styles; //Экспорт функции ,которую прописали для конвертации файла ".scss" в ".css" c помощью ключевого слова "styles"
exports.watching = watching; //Экспорт функции ,c помощью ключевого слова "watching", где идет слежение за изменениями в проекте.
exports.browsersync = browsersync;//Экспорт функции ,c помощью ключевого слова "browsersync", где происходит автоматическое обновление браузера
exports.scripts = scripts;

// exports.html = html;

exports.cleanDist = cleanDist;
exports.images = images;
exports.fonts = fonts;

exports.build = series(cleanDist, fonts, images, build);
exports.default = parallel(styles, scripts, browsersync, images, watching); //Данный экспорт обозначает, что default состояние равно значению запуска параллельно двух экспортов browsersync, watching.
