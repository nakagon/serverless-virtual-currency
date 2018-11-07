const root = {
  src:   `${__dirname}/src`,
  dist:  `${__dirname}/dist`,
  tmp:   `${__dirname}/tmp`
}

const paths = {
  src: {
    root: `${root.src}`,
    html: `${root.src}/html`,
    js:   `${root.src}/js`,
    css:  `${root.src}/css`,
    static: `${root.src}/static`
  },
  dist: {
    root: `${root.dist}`,
    js:   `${root.dist}/js`,
    css:  `${root.dist}/css`,
    font: `${root.dist}/fonts`
  },
  node: {
    modules: `${__dirname}/node_modules`
  }
}
const resource = {
  src: {
    pug: `${paths.src.html}/**/*.pug`,
    webpack: {
      babel: `${paths.src.js}/**/*.js`,
      vue:   `${paths.src.js}/**/*.vue`
    },
    sass:   `${paths.src.css}/**/*.s+(a|c)ss`,
    static: `${paths.src.static}/**/*`
  },
  vendor: {
    js: ['jquery', 'lodash', 'moment', 'flatpickr', 'vue', 'vue-router', 'bootstrap-sass'],
    css: [`${paths.node.modules}/flatpickr/dist/flatpickr.min.css`],
    fontawesome: `${paths.node.modules}/font-awesome/fonts/**/*`
  }
}

import gulp from 'gulp'
import gulpLoaderPlugins from 'gulp-load-plugins'
import del from 'del'
import path from 'path'
import webpack from 'webpack'
import webpackStream from 'webpack-stream'
import runSequence from 'run-sequence'
import browserSyncTool from 'browser-sync'
import RevAll from 'gulp-rev-all'

const $ = gulpLoaderPlugins()
const browserSync   = browserSyncTool.create()

let production = false

// build and watch for developer
gulp.task('default', ['build', 'server'])

//## build for developer
gulp.task('build', (callback) =>
  runSequence('clean', ['build:pug', 'build:sass', 'build:webpack', 'build:static'], callback)
)

//## build production
gulp.task('build-prod', (callback) => 
  runSequence('production', 'build', 'revision', callback)
)

// clean dist
gulp.task('clean', () =>
  del.sync([`${paths.dist.root}/*`, `!${paths.dist.root}/.git*`], { force: true })
)

// production option
gulp.task('production', () => production = true )

// support Resource Revision
gulp.task('revision', (callback) =>
  runSequence('revision:clean', 'revision:append', 'clean', 'revision:copy', 'revision:clean', callback)
)

// compile Webpack [ ES6(Babel) / Vue -> SPA(app.js) ]
gulp.task('build:webpack', () => {
  console.log(process.env)
  process.env.NODE_ENV = (production == true) ? 'production' : 'development'
  let plugins = [
    new webpack.optimize.CommonsChunkPlugin({name: "vendor", filename: "vendor.bundle.js"}),
    new webpack.ProvidePlugin({jQuery: "jquery", $: "jquery"})
  ]
  if (production) plugins.push(new webpack.optimize.UglifyJsPlugin({compress: { warnings: false　}}))
  return gulp.src([resource.src.webpack.babel, resource.src.webpack.vue])
    .pipe($.plumber())
    .pipe(webpackStream({
      devtool: '#source-map',
      entry: {
        app: `${paths.src.js}/app.js`,
        vendor: resource.vendor.js
      },
      output: {filename: 'bundle.js'},
      watch: !production,
      module: {
        rules: [
          {test: /\.js$/, use: 'babel-loader', exclude: /node_modules/},
          {test: /\.vue$/, use: 'vue-loader', exclude: /node_modules/}
        ],
      },
      resolve: {
        modules: ['node_modules', paths.src.js],
        extensions: ['*', '.js', '.vue'],
        alias: {
          vue: 'vue/dist/vue.common.js',
          constants: `${paths.src.js}/constants`,
        }
      },
      plugins: plugins
     }, webpack))
    .pipe(gulp.dest(paths.dist.js))
    .pipe(browserSync.stream())
})

// compile Pug -> HTML
gulp.task('build:pug', () => {
  return gulp.src(resource.src.pug)
    .pipe($.plumber())
    .pipe($.pug())
    .pipe($.htmlhint())
    .pipe($.htmlhint.reporter())
    .pipe(gulp.dest(paths.dist.root))
    .pipe(browserSync.stream())  
})

// compile Sass -> CSS
gulp.task('build:sass', () => {
  return gulp.src(resource.src.sass)
    .pipe($.plumber())
    .pipe($.sass())
    .pipe($.concat('style.css'))
    .pipe($.pleeease())
    .pipe(gulp.dest(paths.dist.css))
    .pipe(browserSync.stream())
})

// copy Static Resource
gulp.task('build:static', () => {
  gulp.src(resource.vendor.css)
    .pipe($.concat('vendor.css'))
    .pipe($.pleeease())
    .pipe(gulp.dest(paths.dist.css))
  gulp.src(resource.vendor.fontawesome)
    .pipe(gulp.dest(paths.dist.font))
  return gulp.src(resource.src.static)
    .pipe(gulp.dest(paths.dist.root))
})

// run Development Web Server (BrowserSync) [localhost:3000]
gulp.task('server', () => {
  browserSync.init({
    server: {baseDir: paths.dist.root},
    port: 3006,
    notify: false
  })
  // watch for source
  gulp.watch(resource.src.pug,    ['build:pug'])
  gulp.watch(resource.src.sass,   ['build:sass'])
  gulp.watch(resource.src.static, ['build:static'])
})

// append Resource Revision
gulp.task('revision:clean', () =>
  del.sync([root.tmp], { force: true })
)

gulp.task('revision:append', () => {
  return gulp.src(`${paths.dist.root}/**/*`)
    .pipe(RevAll.revision({dontRenameFile: [/^\/favicon.ico$/g, '.html']}))
    .pipe(gulp.dest(root.tmp))
})

gulp.task('revision:copy', () => {
  return gulp.src(`${root.tmp}/**/*`)
    .pipe(gulp.dest(paths.dist.root))
})