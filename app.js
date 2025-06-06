// app.js

// Gestion de la recherche : redirige vers produits.html?search=terme
function redirigerVersProduits() {
  const termeRecherche = document.getElementById("produit").value.trim();
  if (termeRecherche) {
    window.location.href = `produits.html?recherche=${encodeURIComponent(termeRecherche)}`;
  }
}


// Produits vedettes codés en dur pour affichage
const produitsVedettes = [
  {
    nom: "Whey Protéine Premium",
    description: "Poudre de protéine pour prise de masse rapide et sèche.",
    image: "https://images.unsplash.com/photo-1606813909264-b26d48411839?auto=format&fit=crop&w=600&q=80",
    proteines: 24,
    calories: 120,
  },
  {
    nom: "Barres Énergétiques Bio",
    description: "Barres naturelles riches en protéines et fibres.",
    image: "https://images.unsplash.com/photo-1523983301330-1c9e068fca37?auto=format&fit=crop&w=600&q=80",
    proteines: 10,
    calories: 150,
  },
  {
    nom: "Créatine Monohydrate",
    description: "Supplément de créatine pour optimiser la récupération musculaire.",
    image: "https://images.unsplash.com/photo-1589927986089-35812386f223?auto=format&fit=crop&w=600&q=80",
    proteines: 0,
    calories: 0,
  },
];

function afficherProduitsVedettes() {
  const zone = document.getElementById("produitsVedettes");
  zone.innerHTML = "";

  produitsVedettes.forEach((p) => {
    const div = document.createElement("div");
    div.className = "col-md-4";

    div.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.nom}</h5>
          <p class="card-text flex-grow-1">${p.description}</p>
          <p class="mb-2">Protéines : <strong>${p.proteines}g</strong> | Calories : <strong>${p.calories} kcal</strong></p>
          <a href="produits.html?search=${encodeURIComponent(p.nom)}" class="btn btn-primary mt-auto">Voir produits similaires</a>
        </div>
      </div>
    `;

    zone.appendChild(div);
  });
}


document.addEventListener("DOMContentLoaded", afficherProduitsVedettes);
