const productsContainer = document.getElementById("productsContainer");
const loadingMessage = document.getElementById("loadingMessage");
const paginationContainer = document.getElementById("pagination");

const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");
const filterRange = document.getElementById("filterRange");
const filterCategory = document.getElementById("filterCategory");
const filterSearchInput = document.getElementById("filterSearchInput");
const filterSearchBtn = document.getElementById("filterSearchBtn");

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 9;

function showLoading(show) {
  loadingMessage.style.display = show ? "block" : "none";
}

// Open Food Facts API
async function fetchOpenFoodFacts(query = "", page = 1) {
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page=${page}&page_size=50&tagtype_0=categories&tag_contains_0=contains&tag_0=sports-nutrition`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur avec l'API Open Food Facts");
  const data = await res.json();

  return data.products.filter(p =>
    p.product_name &&
    p.image_front_url &&
    p.categories_tags &&
    p.categories_tags.some(c => c.includes("en:sports-food"))
  );
}

// Nutritionix API
async function fetchNutritionix(query = "", page = 1) {
  const appId = "29ff0426";
  const appKey = "0c570d5a067d4a474045515a3801bc99";
  const limit = 50;
  const offset = (page - 1) * limit;
  const url = `https://trackapi.nutritionix.com/v2/search/instant?query=${encodeURIComponent(query)}&branded=true&self=false&limit=${limit}&offset=${offset}`;

  const res = await fetch(url, {
    headers: {
      "x-app-id": appId,
      "x-app-key": appKey,
    }
  });
  if (!res.ok) throw new Error("Erreur avec l'API Nutritionix");

  const data = await res.json();
  return (data.branded || []).filter(p =>
    p.photo?.thumb &&
    !p.food_name.toLowerCase().includes("makeup") &&
    !p.brand_name.toLowerCase().includes("cosmetics")
  ).map(p => ({
    product_name: `${p.brand_name} ${p.food_name}`,
    image_front_url: p.photo.thumb,
    nutriments: {
      proteins_100g: p.nf_protein ?? "-",
      "energy-kcal_100g": p.nf_calories ?? "-"
    }
  }));
}

// Fusionne les données des deux APIs
async function fetchProducts(query = "") {
  try {
    showLoading(true);
    currentPage = 1;

    const [openFood, nutritionix] = await Promise.all([
      fetchOpenFoodFacts(query),
      fetchNutritionix(query)
    ]);

    allProducts = [...openFood, ...nutritionix];
    filteredProducts = [...allProducts];
    displayProducts();
  } catch (err) {
    productsContainer.innerHTML = `<p class="text-danger">Erreur lors du chargement des produits.</p>`;
    console.error(err);
  } finally {
    showLoading(false);
  }
}

// Applique les filtres uniquement lors du clic
function applyFilters() {
  const type = filterType.value.toLowerCase();
  const range = filterRange.value.toLowerCase();
  const category = filterCategory.value.toLowerCase();
  const searchTerm = filterSearchInput.value.trim().toLowerCase();

  filteredProducts = allProducts.filter(p => {
    const name = p.product_name.toLowerCase();

    const matchType = !type || name.includes(type);
    const matchRange = !range || name.includes(range);
    const matchCategory = !category || name.includes(category);
    const matchSearch = !searchTerm || name.includes(searchTerm);

    return matchType && matchRange && matchCategory && matchSearch;
  });

  currentPage = 1;
  displayProducts();
}

function displayProducts() {
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const pageProducts = filteredProducts.slice(start, end);

  if (pageProducts.length === 0) {
    productsContainer.innerHTML = `<p>Aucun produit trouvé.</p>`;
    paginationContainer.innerHTML = "";
    return;
  }

  productsContainer.innerHTML = pageProducts.map(p => `
    <div class="card m-2" style="width: 18rem;">
      <img src="${p.image_front_url}" class="card-img-top" alt="${p.product_name}">
      <div class="card-body">
        <h5 class="card-title">${p.product_name}</h5>
        <p class="card-text">Protéines : ${p.nutriments?.proteins_100g ?? "-"}</p>
        <p class="card-text">Calories : ${p.nutriments?.["energy-kcal_100g"] ?? "-"}</p>
      </div>
    </div>
  `).join("");

  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  let html = `<nav><ul class="pagination justify-content-center">`;

  if (currentPage > 1) {
    html += `<li class="page-item"><a class="page-link" href="#" data-page="${currentPage - 1}">Précédent</a></li>`;
  }

  for (let i = 1; i <= totalPages; i++) {
    html += `<li class="page-item ${i === currentPage ? "active" : ""}">
      <a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
  }

  if (currentPage < totalPages) {
    html += `<li class="page-item"><a class="page-link" href="#" data-page="${currentPage + 1}">Suivant</a></li>`;
  }

  html += `</ul></nav>`;
  paginationContainer.innerHTML = html;

  paginationContainer.querySelectorAll("a.page-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const page = Number(e.target.getAttribute("data-page"));
      if (page && page !== currentPage) {
        currentPage = page;
        displayProducts();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
}

// Bouton de filtre
filterSearchBtn.addEventListener("click", applyFilters);

// Recherche globale avec entrée
searchInput?.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    fetchProducts(searchInput.value);
  }
});

// Chargement initial
fetchProducts();
