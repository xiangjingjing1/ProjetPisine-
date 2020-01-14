module.exports = {
    mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production',
    entry: {
        bootstrap: './static/js/bootstrap.js',
        groupsCheckboxs: './static/js/groups-checkboxs.js',
        studentCharts: './static/js/student-charts.js',
        adminCharts: './static/js/admin-charts.js',
        pdf: './static/js/pdf.js',
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/public/js"
    }
}