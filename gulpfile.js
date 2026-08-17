const { src, dest, series, parallel, watch } = require("gulp");
const { exec } = require("child_process");

function css(done) {
  exec(
    "npx tailwindcss -i ./src/css/input.css -o ./dist/css/styles.css --minify",
    (error, stdout, stderr) => {
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);

      done(error);
    },
  );
}

function html() {
  return src(["src/index.html", "src/portfolio.html"]).pipe(dest("dist"));
}

function assets() {
  return src("src/{images,js}/**/*", {
    encoding: false,
    allowEmpty: true,
  }).pipe(dest("dist"));
}

function watcher() {
  watch("src/css/**/*.css", css);
  watch("src/**/*.html", html);
  watch("src/images/**/*", assets);
  watch("src/js/**/*", assets);
}

exports.build = series(css, parallel(html, assets));

exports.watch = series(exports.build, watcher);
