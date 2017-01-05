const ctx = document.getElementById("myChart").getContext("2d");
var chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'E[T]',
            data: [],
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
            borderColor: 'rgba(255, 0, 0, 1)',
            borderWidth: 1,
            pointRadius: 0
        }, 
        {
            label: 'E[W]',
            data: [],
            backgroundColor: 'rgba(0, 255, 0, 0.2)',
            borderColor: 'rgba(0, 255, 0, 1)',
            borderWidth: 1,
            pointRadius: 0
        },
        {
            label: 'E[U]',
            data: [],
            backgroundColor: 'rgba(255, 0, 255, 0.2)',
            borderColor: 'rgba(255, 0, 255, 1)',
            borderWidth: 1,
            pointRadius: 0
        },
        {
            label: 'E[N]',
            data: [],
            backgroundColor: 'rgba(200, 200, 50, 0.2)', 
            borderColor: 'rgba(200, 200, 50, 1)',
            borderWidth: 1,
            pointRadius: 0
        }, 
        {
            label: 'E[B]',
            data: [],
            backgroundColor: 'rgba(24, 24, 124, 0.2)', 
            borderColor: 'rgba(24, 24, 124, 1)',
            borderWidth: 1,
            pointRadius: 0
        }]
    },
    options: {
        width: 100,
        height: 100,
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            yAxes: [{
                gridLines: {
                    display:false
                },
                ticks: {
                    beginAtZero:true
                }
            }], 
            xAxes: [{
                gridLines: {
                    display:false
                },
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});