// Récupération des données du panier dans le local storage
cart = JSON.parse(localStorage.getItem("cart")); 

// Boucle pour afficher les produits du panier
cart.forEach((product) => {
    console.table(product);
});

//Recuper les infos des produits et les afficher dans le DOM
fetch("http://localhost:3000/api/products") // Fetch les données depuis l'API.
    .then((response) => response.json())
    .then((data) => {
        console.table(data);
        data.forEach((product) => { // Création d'une boucle pour chaque produit.
            cart.forEach((item) => { // Création d'une boucle pour chaque produit du panier.
                if (product._id === item.id) { // Si l'id du produit est égal à l'id du produit du panier.
                    document.querySelector("#cart__items").innerHTML += `
                    <article class="cart__item" data-id="${product._id}">
                        <div class="cart__item__img">
                            <img src="${product.imageUrl}" alt="${product.altTxt}">
                        </div>
                        <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${product.name}</h2>
                                <p>${item.color}</p>
                                <p>${product.price} €</p>
                            </div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                    <p>Qté : </p>
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                        </div>
                     </article>`; 
                }
            });
        });
    });

// Calcul du prix total du panier
let totalPrice = 0;
cart.forEach((product) => {
    totalPrice += product.price * product.quantity;
    console.log(totalPrice);
});

// Affichage du prix total du panier sur la page html
document.querySelector("#totalPrice").innerHTML += `<span id="totalPrice">${totalPrice}</span>`;

//calcul du nombre d'articles dans le panier
let totalQuantity = 0;
cart.forEach((product) => {
    totalQuantity += parseInt(product.quantity);
    console.log(totalQuantity);
});

// Affichage total de produits dans le panier
document.querySelector("#totalQuantity").innerHTML += `<span id="totalQuantity">${totalQuantity}</span>`;

// Modifier la quantité d'un produit dans le panier

// Supprimer un produit du panier




