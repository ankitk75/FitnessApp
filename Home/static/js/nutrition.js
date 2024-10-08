$('#product-select').hide();

$(document).ready(() => {
    $("#spinner").hide();
    const search_bar = $('#search_bar');
    const product_index = $("#product-index");
    const searched_product = $("#searched-product");
    const product_list = $('#product_list');
    const search_product = $('#search-product');
    const selected_product_quantity = $('#selected-product-quantity');
    
    selected_product_quantity.hide();
    search_product.hide()
    search_bar.val("");
    search_bar.on('input', (e) => {
        $("#product-container").hide()
        selected_product_quantity.hide();
        product_index.text(0);
        if (searched_product.length > 0)
            searched_product.remove();
        let formData = new FormData();
        formData.append("product", search_bar.val());
        $.ajax({
            url: "autocomplete",
            enctype: 'multipart/form-data',
            type: 'POST',
            processData: false,
            contentType: false,
            data: formData,
            success: (data) => {
                product_list.empty();
                if (data["products"].length == 0) {
                    if (search_product.is(":hidden"))
                        search_product.show();
                    product_list.hide();
                } else {
                    product_list.show();
                    search_product.hide();
                    const template = Handlebars.compile($("#product-template").html());
                    product_list.html(template(data)); 
                    document.querySelectorAll(".product").forEach(element => {
                        element.addEventListener("click", function(e) {
                            let nom = element.querySelector(".product-name").childNodes[1].textContent;
                            nom = nom.substring(1, nom.length - 1)
                            selected_product_quantity.show();
                            search_bar.val(nom);
                            product_list.hide();
                        });
                    });
                }
            },
            error: function(xhr) {
                if (xhr.status == 400) {
                }
            }
        });
    });
    search_bar.on('blur', (e) => {
        if (search_bar.val() == "")
            product_list.hide()
    });

});

function search_product (which = "current") {
    let formData = new FormData();
    formData.append('product', $('#search_bar').val());
    product_index = parseInt($("#product-index").text());
    formData.append('product-index',
        which === "next" ?                      product_index + 1 :
        which === "prev" && product_index > 0 ? product_index - 1 :
                                                product_index
    );
    $("#spinner").show()
    $.ajax({
        url: "search_product",
        enctype: 'multipart/form-data',
        type: 'POST',
        processData: false,
        contentType: false,
        data: formData,
        success: (data) => {
            $("#spinner").fadeOut()
            $("#searched-product").remove();
            let template = Handlebars.compile($("#searched-product-template").html());
            $("#product-container").html(template(data));
            $("#product-index").text(formData.get('product-index'));
            $("#product-container").show()
        },
        error: function(xhr) {
            if (xhr.status == 400)
                ;
        }
    });
}

function add_product() {
    let formData = new FormData();
    let product_name = $('#product-name').val().toLowerCase()
    formData.append("name", product_name);
    nutrients = ["energy", "lipid", "carbohydrate", "sugar", "protein", "fiber", "water"];
    $.each(nutrients, function(_, nutrient) {
        formData.append(nutrient, $(".product-" + nutrient).text().match(/\d+(?:\.\d+)?/)[0]);
    });
    $.ajax({
        url: "add_product_to_db",
        enctype: 'multipart/form-data',
        type: 'POST',
        processData: false,
        contentType: false,
        data: formData,
        success: (data) => {
            $("#product-container").hide()
            $("#search-product").hide()
            search_bar.value = product_name
            $("#search_bar").trigger("input")
        },
        error: function(xhr) {
            if (xhr.status == 400)
                ;
        }
    });
}


var addButton = document.getElementById('add');
var divSelect = document.getElementById('div_select');

addButton.addEventListener("click", function() {
  if (divSelect.style.display == "block") {
    divSelect.style.display = "none";
    window.scrollTo(0, 100);
} else {
    divSelect.style.display = "block";
    window.scrollTo(0, document.body.scrollHeight-600);
  }
});

var add = document.getElementById('cancel');
add.addEventListener("click", (e) =>{
    document.getElementById("div_select").style.display="none";
    divSelect.style.display = "none"
});

var add = document.getElementById('save');
add.addEventListener("click", (e) => {
    let formData = new FormData();
    formData.append("period", $('#selected-product-period').val());
    formData.append("category", $("#selected-product-category").val());
    formData.append("name", $('#search_bar').val());
    formData.append("quantity", $('#selected-product-quantity').val());
    $.ajax({
        url: "add_product_to_user",
        type: 'POST',
        processData: false,
        contentType: false,
        data: formData,
        success: (data) => {
            $("#consumed-calories").text(data["consumed_calories"])
            nex_chart.data.datasets[0].data = data["calories_per_period"];
            $('html, body').animate({ scrollTop: 0 }, 'slow');
            setTimeout(() => {nex_chart.update()}, 750);
            $("#div_select").slideUp()
            $("#search_bar").val("")
            $('#selected-product-quantity').val("");
            $('#selected-product-quantity').hide();
        },
        error: function(xhr) {
            if (xhr.status == 400)
                ;
        }

    })
});

const myChart = document.getElementById("my_chart");

const color = ['rgb( 255, 105, 180)', 'rgb( 255, 215, 0)', 'rgb( 144, 238, 144)', 'rgb(100, 149, 237)', 'rgb(255, 127, 80)', 'rgb(230, 233, 236)']


const calories_per_period = JSON.parse(document.getElementById("calories_per_period").textContent);
const chartData = {
    labels: ["Breakfast", "Morning snack", "Lunch", "Snack", "Dinner", "To consume"],
    datasets : [{
        label: '% calories of the day',
        data : calories_per_period,
        backgroundColor:[
            color[0],
            color[1],
            color[2],
            color[3],
            color[4],
            color[5]
        ],
        borderColor : [
            'rgb(255, 255, 255)'
        ]
    }],
};

const config = {
    type: "doughnut",
    data : chartData,
    options: {
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return `${context.parsed}% calories of the day`;
                    }
                }
            }
        },
    },
};

const nex_chart = new Chart(
    myChart,
    config
);

$("#selected-product-quantity").on("input", () => {
    const element = $("#selected-product-quantity");
    if (parseInt(element.val()) > 300) {
        element.val(300);
    }
});