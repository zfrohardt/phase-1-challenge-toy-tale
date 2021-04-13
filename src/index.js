const url = 'http://localhost:3000/toys/';

let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.querySelector("#new-toy-btn");
    const toyFormContainer = document.querySelector(".container");
    addBtn.addEventListener("click", event => {
        // hide & seek with the form
        addToy = !addToy;
        if (addToy) {
            toyFormContainer.style.display = "block";
        } else {
            toyFormContainer.style.display = "none";
        }
    });

    document.querySelector('.add-toy-form').addEventListener('submit', formHandler);

    // fetch existing data from the server
    fetch(url)
    .then(resp => resp.json())
    .then(json => {
        addToys(json);
    })
});

let addToys = (toys) => {
    let toyCollection = document.querySelector('#toy-collection');
    for (toy of toys) {
        toyCollection.appendChild(createCard(toy));
    }
}

let createCard = toy => {
    let card = document.createElement('div');
    let name = document.createElement('h2');
    let img = document.createElement('img');
    let likes = document.createElement('p');
    let bttn = document.createElement('button');

    name.innerText = toy.name;
    
    img.src = toy.image;
    img.classList.add('toy-avatar');

    likes.innerText = `${toy.likes} Likes `;

    bttn.classList.add('like-btn')
    bttn.innerText = "Like <3"
    bttn.id = `${toy.id}`
    bttn.likes = toy.likes;
    bttn.addEventListener("click", bttnHandler);

    card.classList.add('card');
    card.appendChild(name);
    card.appendChild(img);
    card.appendChild(likes);
    card.appendChild(bttn);

    return card;
}

let formHandler = event => {
    event.preventDefault();
    let form = event.target;

    let name = form.querySelector('[name=name]').value;
    let img = form.querySelector('[name=image]').value;

    let toy ={
        name: name,
        image: img,
        likes: 0,
    }

    fetch(url, getConfigObj("POST", toy))
    .then(resp => resp.json())
    .then(json => {
        addToys([json]);
    })

}

let bttnHandler = event => {
    event.preventDefault();
    let bttn = event.target;

    let patchObj = {
        likes: bttn.likes + 1,
    }

    fetch(url + bttn.id, getConfigObj("PATCH", patchObj))
    .then(resp => resp.json())
    .then(json => {
        bttn.likes = json.likes;
        bttn.closest('div').querySelector('p').innerText = `${json.likes} Likes `;
    }).catch(console.error)
}

let getConfigObj = (reqType, body) => {
    let configObj = {
        method: reqType,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
    }

    configObj.body = JSON.stringify(body);

    return configObj;
}