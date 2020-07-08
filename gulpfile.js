/*导入第三方模块 */
const gulp = require('gulp')
const htmlmin = require('gulp-htmlmin')
const cssmin = require('gulp-cssmin')
const autoprefixer = require('gulp-autoprefixer')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const del = require('del')
const webserver = require('gulp-webserver')

/* 书写规则 */
const delHandler = ()=>{
    return del(['./dist'])
}


const htmlHandler = ()=>{
    return gulp.src('./src/pages/*.html')
            .pipe(htmlmin({
                removeAttributeQuotes:true,
                removeComments:true,
                collapseWhitespace:true,
                minifyCSS:true,
                minifyJS:true,
                collapseBooleanAttributes:true
            }))
            .pipe(gulp.dest('./dist/pages'))
}

const cssHandler = ()=>{
    return gulp.src('./src/css/*.css')
            .pipe(autoprefixer())
            .pipe(cssmin())
            .pipe(gulp.dest('./dist/css'))
}

const jsHandler = ()=>{
    return gulp.src('./src/js/*.js')
            .pipe(babel({
                presets: ['@babel/env']
            }))
            .pipe(uglify())
            .pipe(gulp.dest('./dist/js'))
}

const imagesHandler = ()=>{
    return gulp.src('./src/images/**')
            .pipe(gulp.dest('./dist/images'))
}

const libHandler = ()=>{
    return gulp.src('./src/lib/**')
            .pipe(gulp.dest('./dist/lib'))
}

const webserverHandler = ()=>{
    return gulp.src('./dist')
            .pipe(webserver({
                port:6630,
                open:'./pages/index.html',
                livereload:true,
                proxies:[
                    {
                        source:'/aaa',
                        target:'http://127.0.0.1/json.php'
                    }
                ]
            }))
}


const watchHandler = ()=>{
    gulp.watch('./src/pages/*.html',htmlHandler)
    gulp.watch('./src/css/*.css',cssHandler)
    gulp.watch('./src/js/*.js',jsHandler)
    gulp.watch('./src/images/**',imagesHandler)
    gulp.watch('./src/lib/**',libHandler)
}
/* 导出任务 */
module.exports.default = gulp.series(
    delHandler,
    gulp.parallel(htmlHandler,cssHandler,jsHandler,imagesHandler,libHandler),
    webserverHandler,
    watchHandler
)