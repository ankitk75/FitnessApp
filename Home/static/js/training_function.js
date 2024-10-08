let pushBtn = document.getElementById("push")
let pullBtn = document.getElementById("pull")
let legBtn = document.getElementById("leg")
let push = document.getElementById("push-training")
let pull = document.getElementById("pull-training")
let leg = document.getElementById("leg-training")

pushBtn.addEventListener('click', function () {
    push.classList.replace("d-none", "d-block")
    pull.classList.replace("d-block", "d-none")
    leg.classList.replace("d-block", "d-none")
})

pullBtn.addEventListener('click', function () {
    pull.classList.replace("d-none", "d-block")
    push.classList.replace("d-block", "d-none")
    leg.classList.replace("d-block", "d-none")
})

legBtn.addEventListener('click', function () {
    leg.classList.replace("d-none", "d-block")
    push.classList.replace("d-block", "d-none")
    pull.classList.replace("d-block", "d-none")
})