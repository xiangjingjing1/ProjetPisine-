module.exports = function(grunt) {
    "use strict";

    const sass = require('dart-sass');
    const webpackConfig = require('./webpack.config');
  
    grunt.initConfig({
      ts: {
        app: {
          files: [{
            src: ["src/\*\*/\*.ts"],
            dest: "./dist"
          }],
          options: {
            module: "commonjs",
            lib: [
                "es2015"
            ],
            target: "es6",
            sourceMap: false,
            rootDir: "src/",
            esModuleInterop: true,
            noImplicitAny: true,
          }
        }
      },
      tslint: {
        options: {
          configuration: "tslint.json"
        },
        files: {
          src: ["src/\*\*/\*.ts"]
        }
      },
      watch: {
        ts: {
          files: ["js/src/\*\*/\*.ts", "src/\*\*/\*.ts"],
          tasks: ["ts", "tslint"]
        }
      },
      sass: {
        options: {
          implementation: sass,
          sourceMap: false,
        },
        dist: {
          files: [{
              expand: true,
              cwd: "static/scss",
              src: ["*.scss"],
              dest: "public/css",
              ext: ".css",
          }]
        }
      },
      cssmin: {
        target: {
          files: [{
            expand: true,
            cwd: "public/css",
            src: ["*.css"],
            dest: "public/css"
          }]
        }
      },
      webpack: {
        myConfig: webpackConfig
      }
    });
  
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks("grunt-sass");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-webpack");
  
    grunt.registerTask("default", [
      "ts",
      "tslint",
      "sass",
      "cssmin",
      "webpack"
    ]);
  
  };