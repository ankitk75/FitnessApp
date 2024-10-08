
const ctx = document.getElementById('ptichart');

//Recup les calories sur les 15 derniers jours, depuis Activity et Food, avec requete ajax

let chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label:"Calories",
      data: [],
      backgroundColor: [
        'rgb(242, 151, 0,0.3)',
      ],
      borderColor: [
        'rgb(242, 151, 0,0.6)',
      ],
      borderWidth: 2,
      maxBarThickness: 60,
      borderRadius: 5,
      minBarLength: 10,
  }]
  },
  options: {
    maintainAspectRatio: false,
    scales: {
      
      y: {
        beginAtZero: true,
        gridLines: {
          display: false
        }
      }
    }
  }
});


let formData = new FormData()
formData.append("dates", [])
formData.append("calories", [])
// Envoi requete ajax au server
const request = new Request('/home/ajax', {method: 'POST', body: formData})
fetch(request)
.then(response => response.json())
.then(result => {
    // Chart des calories
    chart.data.labels = result.dates
    chart.data.datasets[0].data = result.calories
    chart.update()
})




// const myChart = document.getElementById("my_chart");

// const abscisse_day = context["dates"].length
// const ordo_cal = {count: abscisse_day, min: 0, max: 1500};

// const labels = context["dates"]
// let i = 0
// const color = [
// 	'rgb(255, 105, 180)',
// 	'rgb(255, 215, 0)',
// 	'rgb(144, 238, 144)',
// 	'rgb(100, 149, 237)',
// 	'rgb(255, 127, 80)',
// 	'rgb(174,134,246)',
// 	'rgb(246,97,97)',
// ]

// const config = {
// 	type: 'bar',
// 	data: update_chartjs_data(context),
// 	options: {
// 		responsive: true,
// 		plugins: {
// 			legend: {
// 				position: 'top',
// 			},
// 			title: {
// 				display: true,
// 				text: "Activity time per sport per day",
// 				font: {
// 					size: 14
// 				}
// 			}
// 		}
// 	},
// };

// const nex_chart = new Chart(
//     myChart,
//     config
// );

// //Sauvegarde du sport
// save = document.getElementById("save")

// save.addEventListener("click", (e) => {
//     let formData = new FormData()
//     formData.append("activity", $("#selectSport").val())
//     formData.append("duration", $("#sliderbar").val())
//     $.ajax({
//         url: "add_activity_to_user",
//         type: 'POST',
//         processData: false,
//         contentType: false,
//         data: formData,
//         success: (data) => {
// 			$("#daily_calories_consumed").text(data["daily_calories_consumed"])
// 			nex_chart.data = update_chartjs_data(JSON.parse(data["context_data"]))
// 			$('html, body').animate({ scrollTop: 0 }, 'slow');
//             setTimeout(() => {nex_chart.update()}, 750);
// 			setTimeout(() => {$("#div_select").fadeOut()}, 300);
// 			},
//         error: function(xhr) {
//             if (xhr.status === 400)
//                 ;
//         }
//     })
// });

// //Mise a jour du graphique avec la nouvelle activites indiquee
// function update_chartjs_data(data) {
// 	return {
// 		"labels": data["dates"],
// 		"datasets": Object.entries(data["activities"]).reduce((acc, [label, values]) => {
// 						let allZero = values.every((val) => val === 0)
// 						if (!allZero) {
// 							acc.push({
// 								label: label,
// 								data: values,
// 								borderColor: color[acc.length % color.length],
// 								backgroundColor: `rgba(${color[acc.length % color.length].slice(4, -1)}, 0.7)`,
// 								borderWidth: 3,
// 								borderRadius: 6,
// 								borderSkipped: false,
// 							})
// 						}
// 						return acc
// 					}, [])
// 	}
// }

