//Récupération des données du panier dans le local storage.
cart = JSON.parse(localStorage.getItem("cart"));
if (cart === null) {
    cart = [];
}

//Boucle pour afficher les produits du panier.
//cart.forEach((product) => {
//    console.table(product);
//});

//Recuper les infos des produits et les afficher dans le DOM.
let goods = [];
fetch("http://localhost:3000/api/products") // Fetch les données depuis l'API.
.then((response) => response.json())
.then((data) => {
    goods = data;
    //console.table(data);
    data.forEach((product) => { //Création d'une boucle pour chaque produit.
        cart.forEach((item) => { //Création d'une boucle pour chaque produit du panier.
            if (product._id === item.id) { //Si l'id du produit est égal à l'id du produit du panier.
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
        })
    })
})

//Calcul du prix total du panier.
let totalPrice = 0;
cart.forEach((product) => {
    totalPrice += product.price * product.quantity;
});

//Affichage du prix total du panier sur la page html.
document.querySelector("#totalPrice").innerHTML += `<span id="totalPrice">${totalPrice}</span>`;

//Calcul du nombre d'articles dans le panier.
let totalQuantity = 0;
cart.forEach((product) => {
    totalQuantity += parseInt(product.quantity);
});

//Affichage total de produits dans le panier.
document.querySelector("#totalQuantity").innerHTML += `<span id="totalQuantity">${totalQuantity}</span>`;

//Recuperation du prix des articles grace a l'id via l'API.
function getProductPrice(productId) {
    let productPrice = 0;
    goods.forEach((good) => {
        if (good._id === productId) {
            productPrice = good.price;
        }
    });
    return productPrice;
}

//Recuperation du mom du produit grace a l'id via l'API.
function getProductName(productId) {
    let productName = "";
    goods.forEach((good) => {
        if (good._id === productId) {
            productName = good.name;
        }
    });
    return productName;  
}

//Modifie le prix total du panier en fonction de la quantité.
function updateCart() {
    let cartItems = document.querySelector("#cart__items"); //Récupération de la div cart__items.
    let cartItem = cartItems.querySelectorAll(".cart__item"); //Sélectionne tous les éléments avec la classe cart__item.
    let products = [];
    cartItem.forEach((item) => {
        let productId = item.getAttribute("data-id"); //Récupération de l'id du produit.
        let productName = getProductName(productId) //Récupération du nom du produit.
        let productQuantity = item.querySelector(".itemQuantity").value; //Récupération de la quantité du produit.
        let productColor = item.querySelector("p:nth-child(2)").textContent; //Récupération de la couleur du produit.
        let productPrice = getProductPrice(productId); //Récupération du prix du produit via l'API.
        products.push({
            id: productId,
            name: productName,
            quantity: productQuantity,
            color: productColor,
            price: productPrice,
        });
    });
    localStorage.setItem("cart", JSON.stringify(products));
    location.reload();
}

//Modifie la quantité d'un produit dans le panier et met a jour le local storage.
const quantity = document.querySelector(".itemQuantity");
addEventListener("change", (event) => { 
    event.preventDefault();
    if (event.target.classList.contains("itemQuantity")) { //Si l'élément cliqué a la classe itemQuantity.
        const quantity = event.target;
        //Si la quantité est inférieur à 1 ont met la quantité à 1 et on met a jour le local storage et le panier.
        if (quantity.value == 0) {
            quantity.value = 1;
        }  
        updateCart();
    } 
});

//Supprime un produit du panier et met a jour le local storage.
const deleteproduct = document.querySelectorAll(".deleteItem");
addEventListener("click", (event) => {
    if (event.target.classList.contains("deleteItem")) {
        const deleteproduct = event.target; 
        deleteproduct.parentElement.parentElement.parentElement.parentElement.remove(); //Supprime le produit du panier.
        updateCart();
    }
});

//Récupération des données du formulaire.
const form = document.querySelector("#form");
addEventListener("submit", (event) => {
    event.preventDefault();
    const firstName = document.querySelector("#firstName").value;
    const lastName = document.querySelector("#lastName").value;
    const address = document.querySelector("#address").value;
    const city = document.querySelector("#city").value;
    const email = document.querySelector("#email").value;
    const products = [];
    cart.forEach((product) => {
        products.push(product.id);
    });

    //Verification de la validité des données du formulaire.
    //Vérification du prénom et du nom.
    if (firstName.length < 2 || lastName.length < 2 || !isNaN(firstName) || !isNaN(lastName) || firstName.match(/[^a-zA-Z]/) || lastName.match(/[^a-zA-Z]/)) {
        alert("Veuillez entrer un prénom et/ou un nom valide");
        return false;
    }

    //Vérification de l'adresse.
    if (address.length < 5 || !isNaN(address) || address.match(/[^a-zA-Z0-9\s-']/)) {
        alert("Veuillez entrer une adresse valide");
        return false;
    }

    //Vérification de la ville.
    if (city.length < 2 || !isNaN(city) || city.match(/[^a-zA-Z\s-']/)) {
        alert("Veuillez entrer une ville valide");
        return false;
    }

    //Vérification de l'email.
    if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/)) {
        alert("Veuillez entrer une adresse email valide");
        return false;
    }

    //Verification du panier avant envoi des données.
    if (cart.length == 0) {
        alert("Votre panier est vide, vous allez être redirigé vers la page d'accueil");
        window.location.href = "index.html";
        //Ne retourne pas les données du formulaire a l'API.
        return false;  
    }

    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contact: {
                firstName: firstName,
                lastName: lastName,
                address: address,
                city: city,
                email: email,
            },
            products: products,
        }),
    })
    .then((response) => response.json())
    .then((json) => {
        localStorage.setItem("order", JSON.stringify(json));
        //Recupere l'orderId de la commande.
        let orderId = json.orderId;
        localStorage.setItem("orderId", orderId);
        window.location.href = "confirmation.html" + "?orderId=" + orderId;
        //Supprime le panier.
        localStorage.removeItem("cart");
        //console.log("json");
    });
});