// Boutons likes et Dislikes des posts
let div_likes = document.querySelectorAll("#div-likes")
div_likes.forEach((div) => {
    div.addEventListener("click", function () {
        ajax_likes(this)
    })
})

// Click sur les div de dislikes
let div_dislikes = document.querySelectorAll("#div-dislikes")
div_dislikes.forEach((div) => {
    div.addEventListener("click", function () {
        ajax_dislikes(this)
    })
})

// Fonctions avec ajax, mise a jour des likes et dislikes

function ajax_likes(div) {
    let curr_post_id = parseInt(div.previousElementSibling.textContent)

    let icon_likes = div.childNodes[1]
    let curr_likes_counter = div.childNodes[3]

    let div_dislikes = div.nextElementSibling
    let icon_dislikes = div_dislikes.childNodes[1]
    let curr_dislikes_counter = div_dislikes.childNodes[3]

    // Preparation de la requete ajax avec les donnes a envoyer
    let formData = new FormData()
    formData.append("post_id", curr_post_id)

    // Si Bouton Dislikes deja selectionne, deselection du bouton Dislikes et selection du bouton Likes
    if (icon_dislikes.classList.contains("bi-hand-thumbs-down-fill")) {
        // Mise a jour des icons et compteurs
        icon_dislikes.classList.replace("bi-hand-thumbs-down-fill", "bi-hand-thumbs-down")
        icon_likes.classList.replace("bi-hand-thumbs-up", "bi-hand-thumbs-up-fill")
        curr_likes_counter.textContent = parseInt(curr_likes_counter.textContent) + 1
        curr_dislikes_counter.textContent = parseInt(curr_dislikes_counter.textContent) == 0 ?
            parseInt(curr_dislikes_counter.textContent) : parseInt(curr_dislikes_counter.textContent) - 1
    }

    // Si Bouton Likes deja selectionne, deselection du bouton Likes
    else if (icon_likes.classList.contains("bi-hand-thumbs-up-fill")) {
        // Mise a jour des icons et compteurs
        icon_likes.classList.replace("bi-hand-thumbs-up-fill", "bi-hand-thumbs-up")
        curr_likes_counter.textContent = parseInt(curr_likes_counter.textContent) == 0 ? 
            parseInt(curr_likes_counter.textContent) : parseInt(curr_likes_counter.textContent) - 1
    }

    // Si rien n'est selectionne, selection du bouton Likes
    else {
        // Mise a jour des icons et compteurs
        icon_likes.classList.replace("bi-hand-thumbs-up", "bi-hand-thumbs-up-fill")
        curr_likes_counter.textContent = parseInt(curr_likes_counter.textContent) + 1
    }

    // Ajout des donnees dans la requete ajax
    formData.append('likes', parseInt(curr_likes_counter.textContent))
    formData.append('dislikes', parseInt(curr_dislikes_counter.textContent))

    // Envoi requete ajax au server
    const request = new Request('/social/update/', {method: 'POST', body: formData})
    fetch(request)
    .then(response => response.json())
}

function ajax_dislikes(div) {
    let curr_post_id = parseInt(div.previousElementSibling.previousElementSibling.textContent)

    let icon_dislikes = div.childNodes[1]
    let curr_dislikes_counter = div.childNodes[3]

    let div_likes = div.previousElementSibling
    let icon_likes = div_likes.childNodes[1]
    let curr_likes_counter = div_likes.childNodes[3]

    let formData = new FormData()
    formData.append("post_id", curr_post_id)

    // Si Bouton Likes deja selectionne, deselection du bouton Likes et selection du bouton Dislikes
    if (icon_likes.classList.contains("bi-hand-thumbs-up-fill")) {
        // Mise a jour des icons et compteurs
        icon_likes.classList.replace("bi-hand-thumbs-up-fill", "bi-hand-thumbs-up")
        icon_dislikes.classList.replace("bi-hand-thumbs-down", "bi-hand-thumbs-down-fill")
        curr_likes_counter.textContent = parseInt(curr_likes_counter.textContent) == 0 ?
            parseInt(curr_likes_counter.textContent) : parseInt(curr_likes_counter.textContent) - 1
        curr_dislikes_counter.textContent = parseInt(curr_dislikes_counter.textContent) + 1
    }
    
    // Si Bouton Disikes deja selectionne, deselection du bouton Dislikes
    else if (icon_dislikes.classList.contains("bi-hand-thumbs-down-fill")) {
        // Mise a jour des icons et compteurs
        icon_dislikes.classList.replace("bi-hand-thumbs-down-fill", "bi-hand-thumbs-down")
        curr_dislikes_counter.textContent = parseInt(curr_dislikes_counter.textContent) == 0 ? 
            parseInt(curr_dislikes_counter.textContent) : parseInt(curr_dislikes_counter.textContent) - 1
    }   

    // Si rien n'est selectionne, selection du bouton Dislikes
    else {
        // Mise a jour des icons et compteurs
        icon_dislikes.classList.replace("bi-hand-thumbs-down", "bi-hand-thumbs-down-fill")
        curr_dislikes_counter.textContent = parseInt(curr_dislikes_counter.textContent) + 1
    }
    
    // Ajout des donnees dans la requete ajax
    formData.append('likes', parseInt(curr_likes_counter.textContent))
    formData.append('dislikes', parseInt(curr_dislikes_counter.textContent))

    // Envoi requete ajax au server
    const request = new Request('/social/update/', {method: 'POST', body: formData})
    fetch(request)
    .then(response => response.json())
}      

// Fonctions du formulaire d'ajout de post

let btn_add_post = document.getElementById('btn-add-post')
let div_form = document.getElementById('form-add-post')

btn_add_post.addEventListener('click', function () {
    toggle_add_post()
})

let cancel_btn = document.getElementById('cancel')
cancel_btn.addEventListener('click', function () {
    cancel_input()
})

let form = document.querySelector("form")
form.message.addEventListener('change', function () {
    validate_add_post
})

function toggle_add_post() {
    // Toggle du bouton
    if (btn_add_post.classList.contains("d-block")) {
        btn_add_post.classList.replace("d-block", "d-none")
    }
    else if (btn_add_post.classList.contains("d-none")) {
        btn_add_post.classList.replace("d-none", "d-block")
    }
    // Toggle du formulaire
    if (div_form.classList.contains("d-none")) {
        div_form.classList.replace("d-none", "d-block")
    }
    else if (div_form.classList.contains("d-block")) {
        div_form.classList.replace("d-block", "d-none")
    }
}

function validate_add_post() {
    let input = document.getElementById('message')
    if (input.value == "" || input.value.lenght > input.maxLength) {
        if (input.classList.contains("is-valid"))
        input.classList.replace("is-valid", "is-invalid")
        else
        input.classList.add("is-invalid")
        return false
    }
    if (input.classList.contains("is-invalid"))
input.classList.replace("is-invalid", "is-valid")
else
input.classList.add("is-valid")
return true
}

function cancel_input() {
    let input = document.getElementById('message')
    input.setAttribute('value', "")
    toggle_add_post()
}