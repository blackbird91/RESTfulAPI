import { $, $$ } from '/js/selectors.js';

export let makeChart = (posts) => {
    const ctx = $$('.myChart');

    ctx.forEach((element, index) => {
        let voteLabels = [];
        posts[index].votes.length > 2 ? voteLabels = [...Array(posts[index].votes.length + 1).keys()].slice(1) : voteLabels = ['Yes', 'No'];

        // Change the legend text to array numbers !!!!!!!!!!!!!!!!!!!
        new Chart(element, {
            type: 'doughnut',
            data: {
                labels: voteLabels,
                datasets: [{
                    data: posts[index].votes,
                    borderWidth: 0,
                    backgroundColor: ['#36a2eb', '#ff6384', '#4bc0c0', '#ff9f40', '#9966ff', '#ffcd56', '#63ff96', '#ee63ff', '#63f6ff']
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
                        display: false,
                    }
                }
            }
        });
    });
}