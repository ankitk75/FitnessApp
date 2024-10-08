window.onload = function additionner() {
    let valeur1 = parseInt(document.getElementById("objectif-val").innerText);
    let valeur2 = parseInt(document.getElementById("sport-val").innerText);
    // let valeur3 = parseInt(document.getElementById("alim-val").innerText);
    
    // let resultat = valeur1 + valeur2 - valeur3;
    let resultat = valeur1 - valeur2 ;

    
    // Afficher le résultat dans la balise de sortie
    document.getElementById("rest-val").innerHTML = resultat;
    
    // let pourcentage = valeur3*100/valeur1;
    let pourcentage = resultat*100/valeur1;

    document.getElementById("cal-percent").innerHTML=Math.trunc(pourcentage)+"%";
    document.getElementById("percent-bar").setAttribute("style","width: "+Math.trunc(pourcentage)+"%; background-color: rgb(242, 151, 0);");

  }
  


  // Affichage icon correspondant au sport choisi
img = document.getElementById("img_sport");
function changeIcon(selectValue) {
	img.className = "";
	switch(selectValue){
		case "Yoga":
			img.className = "bi bi-yin-yang";
			break;
		case "Swimming":
			img.className = "bi bi-tsunami";
			break;
		case "Running":
			img.className = "bi bi-lungs-fill";
			break;
		case "Cycling":
			img.className = "bi bi-bicycle";
			break;
		case "Lift Weight":
			img.className = "bi bi-universal-access";
			break;
		case "High-intensity interval training":
			img.className = "bi bi-lightning-charge-fill";
			break;
		case "Cross Country Skiing":
			img.className = "bi bi-snow";
			break;
	}
	console.log(img.className.value);
}

let selectSport = document.getElementById("selectSport");
selectSport.addEventListener('change', function(e) {
	let selectValue = selectSport.value;
	changeIcon(selectValue);
})

function slideDuree() {
	var slider = document.getElementById("sliderbar").value;
	document.getElementById("duree").textContent = slider + " min";
}

var addButton = document.getElementById('add');
var divSelect = document.getElementById('div_select');
var isShown = false;

//Affichage de la div d'ajout
addButton.addEventListener("click", function() {
  if (isShown) {
    divSelect.style.display = "none";
    isShown = false;
  } else {
    divSelect.style.display = "block";
    isShown = true;
  }
});

//Suppression de la div d'ajout
var cancel = document.getElementById('cancel');
cancel.addEventListener("click", (e) =>{
    document.getElementById("div_select").style.display="none";
    isShown = false;
});

let context = document.getElementById("context-data").innerText;
context = JSON.parse(context);

//Creation du graphique des sports quotidiens
const myChart = document.getElementById("my_chart");

const abscisse_day = context["dates"].length
const ordo_cal = {count: abscisse_day, min: 0, max: 1500};

const labels = context["dates"]
let i = 0
const color = [
	'rgb(255, 105, 180)',
	'rgb(255, 215, 0)',
	'rgb(144, 238, 144)',
	'rgb(100, 149, 237)',
	'rgb(255, 127, 80)',
	'rgb(174,134,246)',
	'rgb(246,97,97)',
]

const config = {
	type: 'bar',
	data: update_chartjs_data(context),
	options: {
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
			},
			title: {
				display: true,
				text: "Activity time per sport per day",
				font: {
					size: 14
				}
			}
		}
	},
};

const nex_chart = new Chart(
    myChart,
    config
);

//Sauvegarde du sport
save = document.getElementById("save")

save.addEventListener("click", (e) => {
    let formData = new FormData()
    formData.append("activity", $("#selectSport").val())
    formData.append("duration", $("#sliderbar").val())
    $.ajax({
        url: "add_activity_to_user",
        type: 'POST',
        processData: false,
        contentType: false,
        data: formData,
        success: (data) => {
			$("#daily_calories_consumed").text(data["daily_calories_consumed"])
			nex_chart.data = update_chartjs_data(JSON.parse(data["context_data"]))
			$('html, body').animate({ scrollTop: 0 }, 'slow');
            setTimeout(() => {nex_chart.update()}, 750);
			setTimeout(() => {$("#div_select").fadeOut()}, 300);
			},
        error: function(xhr) {
            if (xhr.status === 400)
                ;
        }
    })
});

//Mise a jour du graphique avec la nouvelle activites indiquee
function update_chartjs_data(data) {
	return {
		"labels": data["dates"],
		"datasets": Object.entries(data["activities"]).reduce((acc, [label, values]) => {
						let allZero = values.every((val) => val === 0)
						if (!allZero) {
							acc.push({
								label: label,
								data: values,
								borderColor: color[acc.length % color.length],
								backgroundColor: `rgba(${color[acc.length % color.length].slice(4, -1)}, 0.7)`,
								borderWidth: 3,
								borderRadius: 6,
								borderSkipped: false,
							})
						}
						return acc
					}, [])
	}
}