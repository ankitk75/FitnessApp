// Handle different steps to create an account

let nextBtn = document.getElementById("next")
let prevBtn = document.getElementById("prev")
let step1 = document.getElementById("private-data")
let step2 = document.getElementById("body-data")

nextBtn.addEventListener('click', function () {
    step1.classList.replace("d-block", "d-none")
    step2.classList.replace("d-none", "d-block")
    window.scrollTo(0, 0);
})

prevBtn.addEventListener('click', function () {
    step2.classList.replace("d-block", "d-none")
    step1.classList.replace("d-none", "d-block")
    window.scrollTo(0, 0);
})

let form = document.querySelector("form")
let birthdate = document.getElementById("birthdate")
birthdate.max = new Date().toLocaleDateString('fr-FR')

// Validation eventListeners to validate fields in real time

form.firstname.addEventListener('change', function () {
    validate_firstname()
})

form.lastname.addEventListener('change', function () {
    validate_lastname()
})

form.birthdate.addEventListener('change', function () {
    validate_birthdate()
})

form.username.addEventListener('change', function () {
    validate_username()
})

form.email.addEventListener('change', function () {
    validate_email()
})

form.password.addEventListener('change', function () {
    validate_password() 
})

form.confirm_password.addEventListener('change', function () {
    validate_password() 
})

form.weight.addEventListener('input', function () {
    validate_weight()
})

form.height.addEventListener('input', function () {
    validate_height()
})

for (const input of form.goal) {
    input.addEventListener('click', function () {
        maintain_weight()
    })
}

form.goal_weight.addEventListener('input', function () {
    validate_goalweight()
})

// Validation functions

function validate_firstname() {
    let firstname = document.getElementById("firstname")
    let regex = new RegExp("^(?=.{1,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$");
    
    if (firstname.value == "" || regex.test(firstname.value) == false) {
        if (firstname.classList.contains("is-valid"))
            firstname.classList.replace("is-valid", "is-invalid")
        else
            firstname.classList.add("is-invalid")
        return false;
    }
    if (firstname.classList.contains("is-invalid"))
        firstname.classList.replace("is-invalid", "is-valid")
    else
        firstname.classList.add("is-valid")
    return true;
}

function validate_lastname() {
    let lastname = document.getElementById("lastname");
    let regex = new RegExp("^(?=.{1,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$");
    
    if (lastname.value == "" || regex.test(lastname.value) == false) {
        if (lastname.classList.contains("is-valid"))
            lastname.classList.replace("is-valid", "is-invalid")
        else
            lastname.classList.add("is-invalid")
        return false;
    }
    if (lastname.classList.contains("is-invalid"))
        lastname.classList.replace("is-invalid", "is-valid")
    else
        lastname.classList.add("is-valid")
    return true;
}

function validate_birthdate() {
    let birthdate = document.getElementById("birthdate");
    let bdate = new Date(birthdate.value);
    let now = new Date();
    let currentYear = now.getFullYear();
    let birthYear = bdate.getFullYear()
    
    if (birthdate.value == "" || bdate == "Invalid Date" || bdate > now ||  currentYear-birthYear < 10) {
        if (birthdate.classList.contains("is-valid"))
            birthdate.classList.replace("is-valid", "is-invalid")
        else
            birthdate.classList.add("is-invalid")
        return false;
    }
    if (birthdate.classList.contains("is-invalid"))
        birthdate.classList.replace("is-invalid", "is-valid")
    else
        birthdate.classList.add("is-valid")
    return true;
}

function validate_username() {
    let username = document.getElementById("username");
    let regex = new RegExp("^(?=.{1,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$");
    
    if (username.value == "" || regex.test(username.value) == false) {
        if (username.classList.contains("is-valid"))
            username.classList.replace("is-valid", "is-invalid")
        else
            username.classList.add("is-invalid")
        return false;
    }
    if (username.classList.contains("is-invalid"))
        username.classList.replace("is-invalid", "is-valid")
    else
        username.classList.add("is-valid")
    return true;
}

function validate_email() {
    let email = document.getElementById("email");
    // let regex = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm;
    let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");

    if (email.value == "" || regex.test(email.value) == false) {
        if (email.classList.contains("is-valid"))
            email.classList.replace("is-valid", "is-invalid")
        else
            email.classList.add("is-invalid")
        return false
    }
    if (email.classList.contains("is-invalid"))
        email.classList.replace("is-invalid", "is-valid")
    else
        email.classList.add("is-valid")
    return true;
}

function validate_password() {
    let password = document.getElementById("password");
    let confirm_password = document.getElementById("confirm_password");
    
    if ((password.value == "" && confirm_password.value == "") || (password.value != confirm_password.value)) {
        if (password.classList.contains("is-valid") && confirm_password.classList.contains("is-valid")) {
            password.classList.replace("is-valid", "is-invalid")
            confirm_password.classList.replace("is-valid", "is-invalid")
        }
        else {
            password.classList.add("is-invalid")
            confirm_password.classList.add("is-invalid")
        }
        return false;
    }
    if (password.classList.contains("is-invalid") && confirm_password.classList.contains("is-invalid")) {
        password.classList.replace("is-invalid", "is-valid")
        confirm_password.classList.replace("is-invalid", "is-valid")
    }
    else {
        password.classList.add("is-valid")
        confirm_password.classList.add("is-valid")
    }
    return true;
}

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

function validate_height() {
    let height = document.getElementById("height")
    
    if (height.value == "" || height.value <= 20) {
        if (height.classList.contains("is-valid"))
            height.classList.replace("is-valid", "is-invalid")
        else
            height.classList.add("is-invalid")
        return false
    }
    if (height.classList.contains("is-invalid"))
        height.classList.replace("is-invalid", "is-valid")
    else
        height.classList.add("is-valid")
    return true
}

function maintain_weight() {
    let weight = document.getElementById("weight")
    let goaltype = document.querySelector("input[name = goal]:checked")
    let goalweight = document.getElementById("goal_weight")

    if (goaltype.value == "M") {
        weight.addEventListener('change', function () {
            let goalweight = document.getElementById("goal_weight")
            goalweight.setAttribute('value', weight.value)
        })
        goalweight.setAttribute('value', weight.value)
        goalweight.parentNode.hidden = true
        goalweight.hidden = true
    }
    else {
        goalweight.setAttribute('value', "")
        goalweight.parentNode.hidden = false
        goalweight.hidden = false
    }
}

function validate_goalweight() {
    let weight = document.getElementById("weight")
    let goaltype = document.querySelector("input[name = goal]:checked")
    let goalweight = document.getElementById("goal_weight")

    switch (goaltype.value) {
        case "L":
            if (goalweight.value >= weight.value) {
                if (goalweight.classList.contains("is-valid")) {
                    goalweight.classList.replace("is-valid", "is-invalid")
                } else {
                    goalweight.classList.add("is-invalid")
                }
            } else {
                if (goalweight.classList.contains("is-invalid")) {
                    goalweight.classList.replace("is-invalid", "is-valid")
                } else {
                    goalweight.classList.add("is-valid")
                }
            }
            break
        case "G":
            if (goalweight.value <= weight.value) {
                if (goalweight.classList.contains("is-valid")) {
                    goalweight.classList.replace("is-valid", "is-invalid")
                } else {
                    goalweight.classList.add("is-invalid")
                }
            } else {
                if (goalweight.classList.contains("is-invalid")) {
                    goalweight.classList.replace("is-invalid", "is-valid")
                } else {
                    goalweight.classList.add("is-valid")
                }
            }
            break
        default: break
    }
}