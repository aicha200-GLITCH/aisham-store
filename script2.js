
// ===============================
// 1. RECHERCHE DES ROMANS
// ===============================

const searchInput = document.querySelector(".search input");

const books = document.querySelectorAll(".book-card");

searchInput.addEventListener("input", function () {

    const searchValue = searchInput.value.toLowerCase();

    books.forEach(function (book) {

        const title = book.querySelector("h3").textContent.toLowerCase();

        const author = book.querySelector(".author").textContent.toLowerCase();

        if (title.includes(searchValue) || author.includes(searchValue)) {

            book.style.display = "block";

        } else {

            book.style.display = "none";

        }

    });

});


// ===============================
// 2. PANIER COMPLET
// ===============================

let cart = [];

// Récupérer les éléments HTML
const cartIcon = document.getElementById("cartIcon");
const cartCount = document.getElementById("cartCount");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const clearCart = document.getElementById("clearCart");
const checkoutBtn = document.getElementById("checkoutBtn");

const orderButtons = document.querySelectorAll(".order");

// Ouvrir le panier
cartIcon.addEventListener("click", function () {
    cartOverlay.style.display = "flex";
});

// Fermer le panier
closeCart.addEventListener("click", function () {
    cartOverlay.style.display = "none";
});

// Fermer en cliquant à l'extérieur
cartOverlay.addEventListener("click", function (event) {
    if (event.target === cartOverlay) {
        cartOverlay.style.display = "none";
    }
});

// Ajouter un roman au panier
orderButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const book = button.closest(".book-card");

        const title = book.querySelector("h3").textContent.trim();

        const priceText = book.querySelector("strong").textContent;

        const price = parseFloat(
            priceText.replace(/[^\d.,]/g, "").replace(",", ".")
        );

        if (!Number.isFinite(price)) {
            alert("Le prix de ce roman est invalide.");
            return;
        }

        // Vérifier si le roman existe déjà
        const existingBook = cart.find(function (item) {
            return item.title === title;
        });

        if (existingBook) {
            existingBook.quantity++;
        } else {
            cart.push({
                title: title,
                price: price,
                quantity: 1
            });
        }

        afficherPanier();

        // Petit retour visuel
        const ancienTexte = button.textContent;

        button.textContent = "✓ Ajouté !";

        setTimeout(function () {
            button.textContent = ancienTexte;
        }, 1000);

    });

});

// Afficher les romans dans le panier
function afficherPanier() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        const message = document.createElement("p");

        message.className = "empty-cart";
        message.textContent = "Votre panier est vide ♡";

        cartItems.appendChild(message);

    }

    cart.forEach(function (item) {

        const article = document.createElement("div");
        article.className = "cart-item";

        const informations = document.createElement("div");

        const titre = document.createElement("h3");
        titre.textContent = item.title;

        const prix = document.createElement("p");
        prix.textContent = item.price + " DH / unité";

        const controles = document.createElement("div");
        controles.className = "quantity-controls";

        const moins = document.createElement("button");
        moins.type = "button";
        moins.textContent = "−";
        moins.setAttribute("aria-label", "Diminuer la quantité");

        const quantite = document.createElement("span");
        quantite.textContent = item.quantity;

        const plus = document.createElement("button");
        plus.type = "button";
        plus.textContent = "+";
        plus.setAttribute("aria-label", "Augmenter la quantité");

        // Diminuer la quantité
        moins.addEventListener("click", function () {

            item.quantity--;

            if (item.quantity <= 0) {
                cart = cart.filter(function (book) {
                    return book !== item;
                });
            }

            afficherPanier();

        });

        // Augmenter la quantité
        plus.addEventListener("click", function () {

            item.quantity++;

            afficherPanier();

        });

        controles.append(moins, quantite, plus);

        informations.append(titre, prix, controles);

        // Bouton supprimer
        const supprimer = document.createElement("button");

        supprimer.type = "button";
        supprimer.className = "remove-item";
        supprimer.textContent = "🗑️";
        supprimer.setAttribute("aria-label", "Supprimer ce roman");

        supprimer.addEventListener("click", function () {

            cart = cart.filter(function (book) {
                return book !== item;
            });

            afficherPanier();

        });

        article.append(informations, supprimer);

        cartItems.appendChild(article);

    });

    // Calculer le nombre total de livres
    const nombreTotal = cart.reduce(function (total, item) {
        return total + item.quantity;
    }, 0);

    cartCount.textContent = nombreTotal;

    // Calculer le prix total
    const total = cart.reduce(function (somme, item) {
        return somme + item.price * item.quantity;
    }, 0);

    cartTotal.textContent = total.toFixed(2);

}

// Vider complètement le panier
clearCart.addEventListener("click", function () {

    if (cart.length === 0) {
        alert("Votre panier est déjà vide.");
        return;
    }

    const confirmation = confirm(
        "Voulez-vous vraiment vider votre panier ?"
    );

    if (confirmation) {
        cart = [];
        afficherPanier();
    }

});

// Passer la commande
checkoutBtn.addEventListener("click", function () {

    if (cart.length === 0) {
        alert("Votre panier est vide !");
        return;
    }

    const total = cart.reduce(function (somme, item) {
        return somme + item.price * item.quantity;
    }, 0);

    let recapitulatif = "Récapitulatif de votre commande :\n\n";

    cart.forEach(function (item) {

        recapitulatif +=
            item.title +
            " × " + item.quantity +
            " = " + (item.price * item.quantity) +
            " DH\n";

    });

    recapitulatif += "\nTotal : " + total.toFixed(2) + " DH";

    alert(
        recapitulatif +
        "\n\nCeci est une démonstration. Aucun paiement réel n'est effectué."
    );

});

// Initialiser l'affichage
afficherPanier();



// ===============================
// 3. VOIR DETAILS
// ===============================

const detailsButtons = document.querySelectorAll(".details");


detailsButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const book = button.closest(".book-card");

        const title = book.querySelector("h3").textContent;

        const author = book.querySelector(".author").textContent;

        const price = book.querySelector("strong").textContent;

        alert(
            "Titre : " + title +
            "\nAuteur : " + author +
            "\nPrix : " + price
        );

    });

});


// ===============================
// 4. FAVORIS
// ===============================

const favoriteIcon = document.querySelectorAll(".nav-right .icon")[0];

let favorites = [];


favoriteIcon.style.cursor = "pointer";


favoriteIcon.addEventListener("click", function () {

    const favoriteButtons = document.querySelectorAll(".favorite");

    const favoriteList = books;

    let message = "Vos romans favoris :\n";

    if (favorites.length === 0) {

        alert("Vous n'avez pas encore de favoris.");

    } else {

        favorites.forEach(function (title) {

            message += "- " + title + "\n";

        });

        alert(message);

    }

});


// Ajouter un bouton Favoris à chaque roman

books.forEach(function (book) {

    const favoriteButton = document.createElement("button");

    favoriteButton.textContent = "♡ Favoris";

    favoriteButton.classList.add("favorite");

    book.querySelector(".buttons").appendChild(favoriteButton);


    favoriteButton.addEventListener("click", function () {

        const title = book.querySelector("h3").textContent;

        if (favorites.includes(title)) {

            favorites = favorites.filter(function (item) {

                return item !== title;

            });

            favoriteButton.textContent = "♡ Favoris";

            alert("Roman retiré des favoris.");

        } else {

            favorites.push(title);

            favoriteButton.textContent = "♥ Favoris";

            alert("Roman ajouté aux favoris !");

        }

    });

});


// ===============================
// 5. NAVIGATION ACTIVE
// ===============================

const navLinks = document.querySelectorAll("nav a");


navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        navLinks.forEach(function (item) {

            item.classList.remove("active");

        });

        link.classList.add("active");

    });
// OUVRIR LE PANIER DANS LE MEME ONGLET

const mainPage = document.getElementById("mainPage");
const panierPage = document.getElementById("panierPage");

const cartIcon = document.getElementById("cartIcon");
const retourAccueil = document.getElementById("retourAccueil");

cartIcon.addEventListener("click", function () {

    mainPage.style.display = "none";
    panierPage.style.display = "block";

    afficherPanierPage();

    window.scrollTo(0, 0);

});

// RETOUR À L'ACCUEIL

retourAccueil.addEventListener("click", function () {

    panierPage.style.display = "none";
    mainPage.style.display = "block";

    window.scrollTo(0, 0);

});
});
