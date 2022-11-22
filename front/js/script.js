//Recupération des produits via l'api
fetch("http://localhost:3000/api/products") // Fetch les données depuis l'API.
.then((response) => response.json()) // Transforme la réponse en JSON.
.then((data) => {  // Récupère les données.
    //console.table(data); // Affichage des données dans la console sous forme de tableau.
    listkanap(data); // Appel de la fonction d'affichage "listkanap".
}).catch((error) => {
    alert("Erreur, Nous rencontrons des problemes avec l'api."); // Affichage des erreurs dans une alerte.
});

//Affichage des produits dans le DOM
function listkanap(data){ // Fonction d'affichage des produits.
    data.forEach(function(products){ // Création d'une boucle pour chaque produit.
        document.querySelector("#items") // Sélection de la section "items".
        .innerHTML += `
        <a href="./product.html?_id=${products._id}"> 
        <article>
            <img src="${products.imageUrl}" alt="${products.altTxt}">
            <h3 class="productName">${products.name}</h3>
            <p class="productDescription">${products.description}</p>
        </article>
        </a>`; // Affichage des informations produits dans la section "items".
    });
}