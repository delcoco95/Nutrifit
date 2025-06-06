const productsContainer = document.getElementById("productsContainer");
const filterType = document.getElementById("filterType");
const filterRange = document.getElementById("filterRange");
const filterCategory = document.getElementById("filterCategory");
const filterSearchInput = document.getElementById("filterSearchInput");
const filterSearchBtn = document.getElementById("filterSearchBtn");

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 9;

// Produits par défaut
const produitsParDefaut = [
  { product_name: "Whey Protéine Naturelle", nutriments: { proteins_100g: 24, "energy-kcal_100g": 120 }},
  { product_name: "Barre Énergétique Bio", nutriments: { proteins_100g: 9, "energy-kcal_100g": 140 }},
  { product_name: "Boisson Énergisante Citron", nutriments: { proteins_100g: 0, "energy-kcal_100g": 50 }},
  { product_name: "Créatine Monohydrate", nutriments: { proteins_100g: 0, "energy-kcal_100g": 0 }},
  { product_name: "Barre Chocolat & Amande", nutriments: { proteins_100g: 11, "energy-kcal_100g": 180 }},
  { product_name: "Poudre Vegan Multi-Plantes", nutriments: { proteins_100g: 16, "energy-kcal_100g": 110 }},
  { product_name: "Gel énergétique fruits rouges", nutriments: { proteins_100g: 1, "energy-kcal_100g": 95 }},
  { product_name: "Boisson d’endurance Menthe", nutriments: { proteins_100g: 0, "energy-kcal_100g": 42 }},
  { product_name: "Vitamine C Complexe", nutriments: { proteins_100g: 0, "energy-kcal_100g": 10 }}
];

// Appel API Open Food Facts
async function fetchOpenFoodFacts(query = "") {
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=50`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur API Open Food Facts");

  const data = await res.json();

  return data.products
    .filter(p => p.product_name && p.nutriments)
    .map(p => ({
      product_name: p.product_name,
      nutriments: {
        proteins_100g: p.nutriments.proteins_100g ?? "-",
        "energy-kcal_100g": p.nutriments["energy-kcal_100g"] ?? "-"
      }
    }));
}

// Affichage
function displayProducts() {
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const pageProducts = filteredProducts.slice(start, end);

  if (pageProducts.length === 0) {
    productsContainer.innerHTML = `<p class="text-center">Aucun produit trouvé.</p>`;
    return;
  }

  productsContainer.innerHTML = pageProducts.map(p => `
    <div class="col-md-4 d-flex">
      <div class="card h-100 shadow-sm w-100">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.product_name}</h5>
          <p class="card-text flex-grow-1">
            Protéines : <strong>${p.nutriments.proteins_100g}</strong><br>
            Calories : <strong>${p.nutriments["energy-kcal_100g"]}</strong>
          </p>
          <a href="https://www.google.com/search?q=${encodeURIComponent(p.product_name)}" target="_blank" class="btn btn-primary mt-auto">Voir plus</a>
        </div>
      </div>
    </div>
  `).join("");
}

// Filtres
function applyFilters() {
  const type = filterType.value.toLowerCase();
  const range = filterRange.value.toLowerCase();
  const category = filterCategory.value.toLowerCase();
  const searchTerm = filterSearchInput.value.trim().toLowerCase();

  filteredProducts = allProducts.filter(p => {
    const name = p.product_name.toLowerCase();
    return (
      (!type || name.includes(type)) &&
      (!range || name.includes(range)) &&
      (!category || name.includes(category)) &&
      (!searchTerm || name.includes(searchTerm))
    );
  });

  currentPage = 1;
  displayProducts();
}

// Recherche active
filterSearchBtn.addEventListener("click", async () => {
  const terme = filterSearchInput.value.trim();
  if (terme) {
    try {
      const resultats = await fetchOpenFoodFacts(terme);
      allProducts = resultats.length ? resultats : [...produitsParDefaut];
      filteredProducts = [...allProducts];
      displayProducts();
    } catch (err) {
      console.error("Erreur recherche :", err);
      allProducts = [...produitsParDefaut];
      filteredProducts = [...produitsParDefaut];
      displayProducts();
    }
  } else {
    applyFilters();
  }
});

// Initialisation
window.addEventListener("DOMContentLoaded", () => {
  allProducts = [...produitsParDefaut];
  filteredProducts = [...produitsParDefaut];
  displayProducts();
});
