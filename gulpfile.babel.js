/**
 * This file contains building scripts for the project. You have to have latest NodeJS installed
 * in order to process this file.
 */

import gulp from "gulp";
import rimraf from "rimraf";
import scss from "gulp-sass";
import preprocess from "gulp-preprocess";
import browserify from "browserify";
import sourcemaps from "gulp-sourcemaps";
import babelify from "babelify";
import htmlmin from "gulp-htmlmin";
import cssnano from "gulp-cssnano";
import uglify from "gulp-uglify";
import pkg from "./package.json";
import config from "./source/config.json";
import buffer from "vinyl-buffer";
import sourceStream from "vinyl-source-stream";

var dir = __dirname,
    dest = `${dir}/build`,
    source = `${dir}/source`,
    context = {
        context: {
            package: pkg,
            config: config
        }
    };

gulp.task("prepare", (cb) => {
    return rimraf(dest, cb);
});

gulp.task("js", ["prepare"], () => {
    let bundler = browserify({
            entries: `${source}/client/js/index.js`,
            debug: true
        });
    bundler.transform(babelify);
    return bundler.bundle()
        .on("error", function (err) { console.error("An error occurred during bundling:", err); })
        .pipe(sourceStream("index.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(preprocess(context))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(`${dest}/client/js`));
    
    /*return gulp.src([`${source}/client/js/index.js`])
        .pipe(sourcemaps.init())
        .pipe(preprocess(context))
        .pipe(babel({
            presets: ["es2015"]
        }))
        .pipe(browserify({
            insertGlobals : false,
            debug: true,
            entries: `${source}/client/js/index.js`
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(`${dest}/client/js`));*/
});

gulp.task("html", ["prepare"], () => {
    return gulp.src([`${source}/client/index.html`])
        .pipe(preprocess(context))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(`${dest}/client`));
});

// todo: images BASE64 export
gulp.task("favicon", ["prepare"], () => {
    return gulp.src([`${source}/client/favicon.png`])
        .pipe(gulp.dest(`${dest}/client`));
});

gulp.task("css", ["prepare"], () => {
    return gulp.src([`${source}/client/scss/index.scss`])
        .pipe(scss())
        .pipe(cssnano())
        .pipe(gulp.dest(`${dest}/client/css`));
});

gulp.task("pre-cls", ["js", "html", "css", "favicon"], () => {
    return gulp.src([`${source}/cache/*.cls`])
        .pipe(gulp.dest(`${dest}/cache`));
});

gulp.task("cls", ["pre-cls"], () => {
    return gulp.src([`${dest}/cache/*.cls`])
        .pipe(preprocess(context))
        .pipe(gulp.dest(`${dest}/cache`));
});

gulp.task("default", ["cls"]);