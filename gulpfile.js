const { series, parallel, src, dest, watch } = require('gulp')
const rev = require('gulp-rev')
const revCollector = require('gulp-rev-collector')
const htmlmin = require('gulp-htmlmin')
const cleanCSS = require('gulp-clean-css')
const imagemin = require('gulp-imagemin')
const uglify = require('gulp-uglify')
const changed = require('gulp-changed')
const filter = require('gulp-filter')
const clean = require('gulp-clean') //清理文件或文件夹
const babel = require('gulp-babel') //ES6转ES5
const cache = require('gulp-cache')
const autoprefixer = require('gulp-autoprefixer')
const connect = require('gulp-connect')
const sass = require('gulp-sass')
sass.compiler = require('node-sass')

// 清理目录
function cleanDir() {
    return src('dist/', { read: false }).pipe(clean())
}

// 压缩HTML
function minifyHtml() {
    const DESTINATION = 'dist'
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

    return src(['dist/rev/**/*.json', 'src/**/*.html']).pipe(changed(DESTINATION)).pipe(revCollector()).pipe(htmlmin(options)).pipe(dest(DESTINATION)).pipe(connect.reload())
}

function sassToCss() {
    const DESTINATION = 'dist'
    return src('src/**/*.scss').pipe(changed(DESTINATION)).pipe(sass.sync().on('error', sass.logError)).pipe(dest(DESTINATION))
}

// 压缩css
function minifyCss() {
    const DESTINATION = 'dist'
    return src('src/**/*.css')
        .pipe(changed(DESTINATION))
        .pipe(autoprefixer('last 6 version'))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rev())
        .pipe(dest(DESTINATION))
        .pipe(rev.manifest())
        .pipe(dest('dist/rev/css'))
        .pipe(connect.reload())
}

// 压缩js
function minifyJs() {
    const DESTINATION = 'dist'
    let f = filter('!src/assets/js/lib/**/*.js', { restore: true })
    return src('src/**/*.js')
        .pipe(changed(DESTINATION))
        .pipe(f)
        .pipe(
            babel({
                presets: ['env'],
                plugins: ['@babel/plugin-proposal-object-rest-spread']
            })
        )
        .pipe(uglify())
        .pipe(f.restore)
        .pipe(rev())
        .pipe(dest(DESTINATION))
        .pipe(rev.manifest())
        .pipe(dest('dist/rev/js'))
        .pipe(connect.reload())
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
        .pipe(connect.reload())
}

function webServer() {
    connect.server({
        root: 'dist/pages',
        livereload: true,
        port: 2333
    })
}

function watchFile() {
    watch('src/**/*.html', minifyHtml)
    watch('src/**/*.js', minifyJs)
    watch('src/**/*.{png,jpg,gif,jpeg}', minifyImage)
    watch('src/**/*.css', minifyCss)
    watch('src/**/*.scss', series(sassToCss, minifyCss))
}

function defaultTask() {
    let tasks = [cleanDir, minifyImage, sassToCss, minifyCss, minifyJs, minifyHtml]
    return series([...tasks], parallel(webServer, watchFile))
}

exports.default = defaultTask()
