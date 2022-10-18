// Recupere l'id du produit depuis l'url.
const url = new URLSearchParams(document.location.search); 
const id = url.get("_id");

// Recupere les données du produit depuis l'API 
fetch("http://localhost:3000/api/products/" + id)
    .then((response) => response.json())
    .then((data) => {
      document.querySelector("title").textContent=`${data.name}`;
      document.querySelector(".item__img").innerHTML += `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
      document.querySelector("#title").innerHTML += `<h1 id="title">${data.name}</h1>`;
      document.querySelector("#price").innerHTML += `<span id="price">${data.price}</span>`;
      document.querySelector("#description").innerHTML += `<p id="description">${data.description}</p>`;
        // Boucle pour afficher les options de couleurs
        data.colors.forEach((color) => {
           document.querySelector("#colors").innerHTML += `<option value="${color}">${color}</option>`;
        });
        console.log(data);
    })

// Ecoute le click sur le bouton "Ajouter au panier"
const addToCart = document.querySelector("#addToCart");
addToCart.addEventListener("click", (event) => {
    event.preventDefault();
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (cart === null) {
        cart = [];
    } console.log(cart);
});