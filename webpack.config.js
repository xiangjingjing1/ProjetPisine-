module.exports = {
    mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production',
    entry: {
        bootstrap: './static/js/bootstrap.js'
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/public/js"
    }
}