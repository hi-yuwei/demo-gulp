const { series, parallel, src, dest, watch } = require('gulp')
const del = require('del')
const rev = require('gulp-rev')
const revCollector = require('gulp-rev-collector')
const htmlmin = require('gulp-htmlmin')
const cleanCSS = require('gulp-clean-css')
const imagemin = require('gulp-imagemin')
const uglify = require('gulp-uglify')
const changed = require('gulp-changed')
const filter = require('gulp-filter')
const babel = require('gulp-babel') //ES6转ES5
const cache = require('gulp-cache')
const autoprefixer = require('gulp-autoprefixer')
const sass = require('gulp-sass')
sass.compiler = require('node-sass')

const DESTINATION = 'dist' //文件处理后输出目录

// 清理目录
function delDir() {
    return del('dist')
}

// 压缩HTML
function minifyHtml() {
    const options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input checked />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    }

    return src('src/**/*.html').pipe(changed(DESTINATION)).pipe(htmlmin(options)).pipe(dest(DESTINATION))
}

function sassToCss() {
    return src('src/**/*.scss').pipe(changed(DESTINATION)).pipe(sass.sync().on('error', sass.logError)).pipe(dest('src'))
}

// 压缩css
function minifyCss() {
    let filterCss = filter(['**', '!src/assets/**/lib/**/*.css'], { restore: true })

    del('dist/**/*.css', { force: true }) //清理之前的Css
    return src('src/**/*.css')
        .pipe(changed(DESTINATION))
        .pipe(filterCss)
        .pipe(autoprefixer('last 6 version'))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rev())
        .pipe(filterCss.restore)
        .pipe(dest(DESTINATION))
        .pipe(rev.manifest())
        .pipe(dest('src/rev/css'))
}

// 压缩js
function minifyJs() {
    let filterJs = filter(['**', '!src/assets/js/lib/**/*.js'], { restore: true })

    del('dist/**/*.js', { force: true }) //清理之前的JS
    return src('src/**/*.js')
        .pipe(changed(DESTINATION))
        .pipe(filterJs)
        .pipe(
            babel({
                presets: ['@babel/env']
                // plugins: ['@babel/plugin-proposal-object-rest-spread']
            })
        )
        .pipe(uglify())
        .pipe(rev())
        .pipe(filterJs.restore)
        .pipe(dest(DESTINATION))
        .pipe(rev.manifest())
        .pipe(dest('src/rev/js'))
}

// 压缩图片
function minifyImage() {
    const DESTINATION = 'dist'
    let options = {
        optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
        progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
        interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
        multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
    }

    return src('src/**/*.{png,jpg,gif,jpeg}')
        .pipe(changed(DESTINATION))
        .pipe(cache(imagemin(options)))
        .pipe(dest(DESTINATION))
}

// 控制静态资源版本号
function revFile() {
    const options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input checked />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    }

    return src(['src/rev/**/*.json', 'src/**/*.html'])
        .pipe(
            revCollector({
                replaceReved: true
            })
        )
        .pipe(htmlmin(options))
        .pipe(dest(DESTINATION))
}

function watchFile() {
    // watch('src/**/*.html', minifyHtml)
    watch('src/**/*.js', minifyJs)
    watch('src/**/*.{png,jpg,gif,jpeg}', minifyImage)
    watch('src/**/*.css', minifyCss)
    watch('src/**/*.scss', sassToCss)
    watch(['src/rev/**/*.json', 'src/**/*.html'], revFile)
}

function defaultTask() {
    let tasks = [delDir, minifyImage, sassToCss, minifyCss, minifyJs, revFile]
    return series(tasks, parallel(watchFile))
}

exports.default = defaultTask()
