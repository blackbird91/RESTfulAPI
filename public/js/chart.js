import { $, $$ } from '/js/selectors.js';

export let makeChart = (posts) => {
    const ctx = $$('.myChart');

    const newLegendClickHandler = (e, legendItem, legend) => {
        // const index = legendItem.datasetIndex;
        // const ci = legend.chart;
        // if (ci.isDatasetVisible(index)) {
        //     ci.hide(index);
        //     legendItem.hidden = true;
        // } else {
        //     ci.show(index);
        //     legendItem.hidden = false;
        // }
        console.log(legendItem);
        //console.log(legendItem.text);
    };
    ctx.forEach((element, index) => {
        let voteLabels = [];
        posts[index].votes.length > 2 ? voteLabels = [...Array(posts[index].votes.length + 1).keys()].slice(1) : voteLabels = ['For', 'Against'];

        // Change the legend text to array numbers !!!!!!!!!!!!!!!!!!!
        new Chart(element, {
            type: 'doughnut',
            data: {
                labels: voteLabels,
                datasets: [{
                    data: posts[index].votes,
                    borderWidth: 0
                }]
            },
            options: {
                aspectRatio: 1,
                responsive: true,
                width: 230,
                height: 230,
                scales: {
                    y: {
                        display: false,
                    },
                    x: {
                        display: false,
                    }

                },
                plugins: {
                    legend: {
                        onClick: newLegendClickHandler,
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    }
                    // tooltip: {
                    //     callbacks: {
                    //         label: function (data) {
                    //             if (posts[index].votes.length > 2) {
                    //                 //console.log(tooltipItem);
                    //                 console.log(data);
                    //                 // posts[index].description.forEach((i, el) => {
                    //                 //     return posts[index].description[i];
                    //                 // });
                    //                 // for (var i in posts[index].description) {
                    //                 //     console.log(i);
                    //                 //     let label = i || '';
                    //                 //     return label;
                    //                 // }
                    //                 //return dataset[index];
                    //             }
                    //         }
                    //     }
                    // }
                }
            }
        });
    });
}