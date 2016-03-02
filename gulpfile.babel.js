/**
 * This file contains building scripts for the project. You have to have latest NodeJS installed
 * in order to process this file.
 */

import gulp from "gulp";
import rimraf from "rimraf";
import scss from "gulp-sass";
import preprocess from "gulp-preprocess";
import browserify from "gulp-browserify";
import sourcemaps from "gulp-sourcemaps";
import babel from "gulp-babel";
import htmlmin from "gulp-htmlmin";
import cssnano from "gulp-cssnano";
import uglify from "gulp-uglify";
import pkg from "./package.json";
import config from "./source/config.json";

let dir = __dirname,
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
    return gulp.src([`${source}/client/js/index.js`])
        .pipe(sourcemaps.init())
        .pipe(preprocess(context))
        .pipe(babel())
        .pipe(browserify({
            insertGlobals : false,
            debug: true
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(`${dest}/client/js`));
});

gulp.task("html", ["prepare"], () => {
    return gulp.src([`${source}/client/index.html`])
        .pipe(preprocess(context))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(`${dest}/client`));
});

gulp.task("css", ["prepare"], () => {
    return gulp.src([`${source}/client/scss/index.scss`])
        .pipe(scss())
        .pipe(cssnano())
        .pipe(gulp.dest(`${dest}/client/css`));
});

gulp.task("pre-cls", ["js", "html", "css"], () => {
    return gulp.src([`${source}/cache/*.cls`])
        .pipe(gulp.dest(`${dest}/cache`));
});

gulp.task("cls", ["pre-cls"], () => {
    return gulp.src([`${dest}/cache/*.cls`])
        .pipe(preprocess(context))
        .pipe(gulp.dest(`${dest}/cache`));
});

gulp.task("default", ["cls"]);