//Récupération des données du panier dans le local storage.
cart = JSON.parse(localStorage.getItem("cart"));
if (cart === null) {
    cart = [];
}

//Fonction pour afficher les produits du panier.
function DisplayCart() {
    cart.forEach((product) => {
        //console.table(product);
    }); //Boucle pour afficher les produits du panier.
    //Recuper les infos des produits et les afficher dans le DOM.
    fetch("http://localhost:3000/api/products") // Fetch les données depuis l'API.
    .then((response) => response.json())
    .then((data) => {
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
    .catch((error) => {
        alert("Erreur, Nous rencontrons des problemes avec l'api."); // Affichage des erreurs dans une alerte.
    });
}
DisplayCart();

//Fonction pour calculer le prix total du panier.
function DisplayTotal () {
    let totalPrice = 0;
    cart.forEach((product) => {
        totalPrice += product.price * product.quantity;
    });
    document.querySelector("#totalPrice").innerHTML += `<span id="totalPrice">${totalPrice}</span>`; //Affichage du prix total du panier sur la page html.

    let totalQuantity = 0;
    cart.forEach((product) => {
        totalQuantity += parseInt(product.quantity);
    });
    document.querySelector("#totalQuantity").innerHTML += `<span id="totalQuantity">${totalQuantity}</span>`; //Affichage du nombre d'articles dans le panier sur la page html.
}
DisplayTotal();

//Fonction pour recuperer le prix du produit.
function getProductPrice(productId) {
    let productPrice = 0;
    cart.forEach((product) => {
        if (product.id === productId) {
            productPrice = product.price;
        }
    });
    return productPrice;
}

//Fonction pour recuperer le nom du produit.
function getProductName(productId) {
    let productName = "";
    cart.forEach((product) => {
        if (product.id === productId) {
            productName = product.name;
        }
    });
    return productName;
}

//Fonction pour mettre a jour le panier.
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
    // Recharge les données du panier et le prix total sans recharger la page.
    cart = JSON.parse(localStorage.getItem("cart"));
    document.querySelector("#totalPrice").innerHTML = "";
    document.querySelector("#totalQuantity").innerHTML = "";
    DisplayTotal();
}

//Fonction pour Modifier la quantité d'un produit.
function DisplayQuantity(){
    addEventListener("change", (event) => { 
        event.preventDefault();
        if (event.target.classList.contains("itemQuantity")) { //Si l'élément cliqué a la classe itemQuantity.
            const quantity = event.target;
            if (quantity.value == 0) {
                quantity.value = 1;
            } //Si la quantité est inférieur à 1 ont met la quantité à 1 et on met a jour le local storage et le panier.
            updateCart();
        } 
    });
}
DisplayQuantity();

//Fonction pour supprimer un produit du panier.
function DeleteItem() {
    addEventListener("click", (event) => {
        if (event.target.classList.contains("deleteItem")) {
            const deleteproduct = event.target; 
            deleteproduct.parentElement.parentElement.parentElement.parentElement.remove(); //Supprime le produit du panier.
            updateCart();
        }
    });
}
DeleteItem();

//Fonction pour envoyer les données du formulaire.
function sendOrder() {
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

        //Verification du nom
        if (firstName.length < 2 || !isNaN(firstName) || firstName.match(/[^a-zA-Z-çñàéèêëïîôüù - ]/)) { 
            document.querySelector("#firstName").style.border = "2px solid red";
            document.querySelector("#firstNameErrorMsg").innerHTML = "Seuls les majuscules, minuscules, accents, tirets et espaces sont autorisés.";
            return false;
        } else {
            document.querySelector("#firstName").style.border = "2px solid green";
            document.querySelector("#firstNameErrorMsg").innerHTML = "Prenom valide";
        }

        //Verification du prenom
        if (lastName.length < 2 || !isNaN(lastName) || lastName.match(/[^a-zA-Z-çñàéèêëïîôüù - ]/)) {
            document.querySelector("#lastName").style.border = "2px solid red";
            document.querySelector("#lastNameErrorMsg").innerHTML = "Seuls les majuscules, minuscules, accents, tirets et espaces sont autorisés.";
            return false;
        } else {
            document.querySelector("#lastName").style.border = "2px solid green";
            document.querySelector("#lastNameErrorMsg").innerHTML = "Nom valide";
        }

        //Vérification de l'adresse.
        if (address.length < 5 || !isNaN(address) || address.match(/[^a-zA-Z0-9-çñàéèêëïîôüù\s-']/)) {
            document.querySelector("#address").style.border = "2px solid red";
            document.querySelector("#addressErrorMsg").innerHTML = "Seuls les majuscules, minuscules, accents, tirets, espaces, chiffres et apostrophes sont autorisés.";
            return false;
        } else {
            document.querySelector("#address").style.border = "2px solid green";
            document.querySelector("#addressErrorMsg").innerHTML = "Adresse valide";
        }
      
        //Vérification de la ville.
        if (city.length < 2 || !isNaN(city) || city.match(/[^a-zA-ZÀ-ÿ\s-']/)) {
            document.querySelector("#city").style.border = "2px solid red";
            document.querySelector("#cityErrorMsg").innerHTML = "Seuls les majuscules, minuscules, accents, tirets, espaces et apostrophes sont autorisés.";
            return false;
        } else {
            document.querySelector("#city").style.border = "2px solid green";
            document.querySelector("#cityErrorMsg").innerHTML = "Ville valide";
        }

        //Vérification de l'email.
        if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/)) {
            document.querySelector("#email").style.border = "2px solid red";
            document.querySelector("#emailErrorMsg").innerHTML = "Veuillez entrer une adresse email valide.";
            return false;
        } else {
            document.querySelector("#email").style.border = "2px solid green";
            document.querySelector("#emailErrorMsg").innerHTML = "Email valide";
        }

        //Verification du panier avant envoi des données.
        if (cart.length == 0) {
            alert("Votre panier est vide, vous allez être redirigé vers la page d'accueil");
            window.location.href = "index.html";
            return false
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
            let orderId = json.orderId; //Recupere l'orderId de la commande.
            localStorage.setItem("orderId", orderId);
            window.location.href = "confirmation.html" + "?orderId=" + orderId;
            localStorage.removeItem("cart"); //Supprime le panier.
            console.log(json);
         });
    });
}
sendOrder();