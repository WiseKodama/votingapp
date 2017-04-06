function updatedb(cid,i){
    axios.post('/update/' + cid, { results : i })
    .then(function (response) {
    })
  .catch(function (error) {
    console.log(error);
  });
}
function addOption(cid,vBool){if(vBool && document.getElementById('extraOption').validity.valid){
    axios.post('/update/' + cid, { data : document.getElementById('extraOption').value }).then(function (response){
    if(response.status == 200){window.location.reload(true);}
        
    }).catch(function (error){
        console.log(error);
    });
    }
    vBool = false;
}
function hideInp(){
    document.getElementById('addOpt').style.display = 'none';
}
function makeChart(chartData,chartResults,voteBool,chartID){
var ctx = document.getElementById('mainCanvas').getContext("2d");
var sChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: chartData,
        datasets: [{
            label: '# of Votes',
            data: chartResults,
            backgroundColor: [
                '#EF5350',
                '#EC407A',
                '#FFEE58',
                '#42A5F5',
                '#AB47BC',
                '#7E57C2',
                '#5C6BC0',
                '#FFA726'
            ],
            borderColor: [
                'white',
                'white',
                'white',
                'white',
                'white',
                'white',
                'white',
                'white'
            ],
            borderWidth: 2
        }]
    },
    options: {
        legend:{
            position:'bottom',
            onClick: function(e, legendItem) {
                if(voteBool){
                    var index = legendItem.index;
                    var ci = this.chart;
                    ci.data.datasets[0].data[index] +=1;
                    ci.update();
                    updatedb(chartID,index);
                    hideInp();
                    voteBool = false;
                    }
                }
        },
        responsive:false,
        maintainAspectRatio:false,
        animation:{
            duration:750,
            easing:'easeInOutSine',
            animateScale:true,
            animateRotate:true
        },
        cutoutPercentage:35,
        rotation:Math.PI,
        circumference:Math.PI
    }
});
}
