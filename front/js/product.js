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
    } 

    // Recupere les données du produit
    const product = {
        id: id,
        name: document.querySelector("#title").textContent,
        price: document.querySelector("#price").textContent,
        quantity: document.querySelector("#quantity").value,
        color: document.querySelector("#colors").value,
    }

    // Alerte si la quantité est inférieur à 1
    if (product.quantity < 1) {
        alert("Veuillez choisir une quantité");
    };

    // Alerte si la quantité est supérieur à 100
    if (product.quantity > 100) {
        alert("Veuillez choisir une qualité inferieur à 100");
    };
    
    // Alerte si une couleur n'est pas choisie
    if (product.color === '' || product.color == null) {
        alert("Veuillez choisir une couleur");
    };

    // Ajoute le produit au panier dans le local storage si tout est ok
    if (product.quantity > 0 && product.quantity <= 100 && product.color !== '' && product.color !== null) {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Produit ajouté au panier");
        console.log(cart);
        // Regroupe les produits identiques dans le panier
        let cartGrouped = [];
        cart.forEach((product) => {
            let productFound = cartGrouped.find((productGrouped) => productGrouped.id === product.id && productGrouped.color === product.color); // Recherche si le produit existe déjà dans le panier
            if (productFound) {
                productFound.quantity = parseInt(productFound.quantity) + parseInt(product.quantity); // Si le produit existe déjà, on ajoute la quantité
            } else {
                cartGrouped.push(product); //Si le produit n'existe pas, on l'ajoute au panier
            }
        });
        localStorage.setItem("cart", JSON.stringify(cartGrouped));
        console.log(cartGrouped);
        // Redirection vers la page panier
        window.location.href = "cart.html";
    }
});