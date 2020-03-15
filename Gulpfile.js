var gulp = require('gulp');
var babel = require('gulp-babel');
var mocha = require('gulp-mocha');
var handlebars = require('gulp-handlebars');
var defineModule = require('gulp-define-module');
var del = require('del');

async function clean() {
  await del('lib');
}

function buildTemplates() {
  return gulp
    .src('src/**/*.handlebars')
    .pipe(handlebars())
    .pipe(defineModule('node'))
    .pipe(gulp.dest('lib'));
}

function buildTypescript() {
  return gulp
    .src('src/**/*.ts')
    .pipe(babel())
    .pipe(gulp.dest('lib'));
}

const build = gulp.series(buildTemplates, buildTypescript);

async function preview() {
  var buildReporterPlugin = require('testcafe').embeddingUtils.buildReporterPlugin;
  var pluginFactory = require('./lib');
  var reporterTestCalls = require('./test/utils/reporter-test-calls');
  var plugin = buildReporterPlugin(pluginFactory);

  console.log();

  reporterTestCalls.forEach(function(call) {
    plugin[call.method].apply(plugin, call.args);
  });
}

exports.clean = clean;
exports.build = gulp.series(clean, build);
exports.preview = gulp.series(clean, build, preview);
