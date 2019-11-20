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
          files: ["src/\*\*/\*.ts"],
          tasks: ["ts", "tslint", "express:dev"],
          options: {
            spawn: false,
          },
        },
        sass: {
          files: ["static/scss/*.scss"],
          tasks: ["sass", "cssmin"],
          livereload: true,
        },
        webpack: {
          files: ["static/js/*.js"],
          tasks: ["webpack"],
          livereload: true,
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
      },


      express: {
        dev: {
          options: {
            port: 8000,
            script: "./dist/app.js"
          }
        }
      }
    });
  
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks("grunt-sass");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-webpack");
    grunt.loadNpmTasks('grunt-express-server');

    grunt.registerTask("default", [
      "ts",
      "tslint",
      "sass",
      "cssmin",
      "webpack",
      "express:dev",
      "watch"
    ]);
  
  };