// Formulaire d'ajout de donnees
let form = document.querySelector("form")

let step1 = document.getElementById("step1")
let step2 = document.getElementById("step2")
let btnStep1 = document.getElementById("btn-step1")

btnStep1.addEventListener('click', function () {
  step1.classList.replace("d-block", "d-none")
  step2.classList.replace("d-none", "d-block")
  window.scrollTo(0, 0);
})

form.weight.addEventListener('input', function () {
  validate_weight()
})

function validate_weight() {
  let weight = document.getElementById("weight")

  if (weight.value == "" || weight.value <= 20) {
      if (weight.classList.contains("is-valid"))
          weight.classList.replace("is-valid", "is-invalid")
      else
          weight.classList.add("is-invalid")
      return false
  }
  if (weight.classList.contains("is-invalid"))
      weight.classList.replace("is-invalid", "is-valid")
  else
      weight.classList.add("is-valid")
  return true
}


var ctx = document.getElementById('canvas').getContext('2d');
var chart = new Chart(ctx, {
type: 'line',
data: {
    labels: [],
    datasets: [{
    label: 'Your Weight (kg)',
    data: [],
    backgroundColor: [
        'rgb(112, 44, 246, 0.2)',
      ],
    borderColor: [
        'rgb(112, 44, 246, 0.6)',
      ],
    tension: 0.1
    },{
    label: 'Your Goal (kg)',
    data: [],
    backgroundColor: [
        'rgb(242, 151, 0, 0)',
      ],
    borderColor: [
        'rgb(242, 151, 0, 0.6)',
      ],
    tension: 0.1   
    }]
  },
options: {
      maintainAspectRatio: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            stepSize: 15,
            max: 150,
          } 
        }]   
      }
    }
  });

var cv = document.getElementById('imc');
var chart2 = new Chart(cv, {
  type: 'line',
  data: {
      labels: [],
      datasets: [{
      label: 'Your BMI',
      data: [],
      backgroundColor: [
          'rgb(112, 44, 246,0)',
        ],
      borderColor: [
          'rgb(112, 44, 246, 0.6)',
        ],
      tension: 0.1
      },
      {
        label: "Overweight",
        data: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
        backgroundColor: [
            'rgb(255, 0, 0, 0)',
          ],
        borderColor: [
            'rgb(255, 0, 0, 0.6)',
          ],
        tension: 0.1   
      },
      {
        label: "Underweight",
        data: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
        backgroundColor: [
            'rgb(0, 255, 0, 0.1)',
          ],
        borderColor: [
            'rgb(0, 255, 0, 0.6)',
          ],
        tension: 0.1   
      }],
  },
  options: {
    maintainAspectRatio: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          stepSize: 5,
          max: 50,
        } 
      }]   
    }
  }
});

let formData = new FormData()
formData.append("goal_weights", [])
formData.append("height", 0)
formData.append("dates", [])
formData.append("weights", [])

const request = new Request('/progress/ajax', {method: 'POST', body: formData})
fetch(request)
.then(response => response.json())
.then(result => {
    // Chart des poids
    chart.data.labels = result.dates.map(str=>String(str))
    chart.data.datasets[0].data = result.weights.map(i=> i != " " ? Number(i) : NaN)
    chart.data.datasets[1].data = result.goal_weights.map(i=> Number(i))
    chart.update()

    // chart des imc
    chart2.data.labels = result.dates.map(str=>String(str))
    let imc_list = []
    for (let i = 0; i < result.dates.length; i++) {
      imc_list.push((parseFloat(result.weights[i]) / parseFloat((result.height/100)*(result.height/100))).toFixed(1))
    }
    chart2.data.datasets[0].data = imc_list
    chart2.update()
})