//Recupere le orderId depuis l'url.
const orderId = new URLSearchParams(window.location.search).get("orderId");

//Affiche le orderId dans le DOM.
document.querySelector("#orderId").innerHTML += `<p id="orderId">${orderId}</p>`;