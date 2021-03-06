import "chart.js";

let userId = document.getElementById("student-id").dataset.userid;

fetch(`/api/results/for/${userId}`).then((res) => res.json()).then((results) => {
    var labels = results.map((el) => {
        let date = new Date(el.date);
        return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
    });

    function getScoresForPart(i) {
        return results.map((session) => {
            let r = session.ExamResults.filter((result) => result.part == i);

            if (r.length == 0) {
                return 0;
            }
            return r[0].score;
        })
    }

    function getScoresForListReadPart(listening = true) {
        return results.map((session) => {
            let r = session.ExamResults.filter((result) => {
                if (listening) {
                    return result.part >= 1 && result.part <= 4
                }
                return result.part > 4
            });
            return r.reduce((prev, e) => prev + e.score, 0);
        })
    }

    function getScoreGlobal() {
        return results.map((session) => {

            return session.ExamResults.reduce((prev, e) => prev + e.score, 0);
        })
    }

    var datasets = [1, 2, 3, 4, 5, 6, 7].map((i) => {
        let scores = getScoresForPart(i)
        return {
            label: `Part ${i}`,
            borderColor: `rgb(${255 / 7 * (8 - i)}, 99, ${255 / 7 * i})`,

            data: scores
        }
    });


    var datasets2 = [true, false].map((i) => {
        let scores = getScoresForListReadPart(i);
        return {
            label: i ? "Listening" : "Reading",
            borderColor: `rgb(${255 / 7 * (8 - 12 * i)}, 99, ${255 / 7 * i})`,
            data: scores
        }
    })

    datasets2.push({
        label: "Score total",
        borderColor: "blue",
        data: getScoreGlobal()

    })

    var ctx = document.getElementById('globalChart').getContext('2d');
    new Chart(ctx, {

        type: 'line',

        // The data for our dataset
        data: {
            labels: labels,
            datasets: datasets2,
        },
        // Configuration options go here
        options: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Nombre de réponses justes",
                    },
                    ticks: {
                        stepSize: 1,
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Date de session d'examen"
                    }
                }]
            }
        }
    });


    var ctx = document.getElementById('partsChart').getContext('2d');
    new Chart(ctx, {

        type: 'line',

        // The data for our dataset
        data: {
            labels: labels,
            datasets,
        },
        // Configuration options go here
        options: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Nombre de réponses justes"
                    },
                    ticks: {
                        stepSize: 1,
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Date de session d'examen"
                    }
                }]
            }
        }
    });

});