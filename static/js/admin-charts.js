import "chart.js";

fetch("/api/results/per/subject").then((res) => res.json()).then((results) => {

    let ctx = document.getElementById("perSubjectChart").getContext('2d');
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: results.map((result) => result.name),
            datasets: [["min", "Minimum", "red"], ["average", "Moyenne", "orange"], ["max", "Maximum", "green"]].map((attr) => ({
                label: attr[1],
                data: results.map((result) => result[attr[0]]),
                borderColor: attr[2],
                backgroundColor: attr[2],
            }))
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                    }
                }]
            }
        }
    });

});