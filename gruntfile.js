module.exports = function(grunt) {
    "use strict";
  
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
      }
    });
  
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-tslint");
  
    grunt.registerTask("default", [
      "ts",
      "tslint"
    ]);
  
  };