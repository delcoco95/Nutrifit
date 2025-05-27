document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const calorieFilter = document.getElementById("calorieFilter");
  const clearFiltersBtn = document.getElementById("clearFilters");
  const productCatalog = document.getElementById("productCatalog");
  const loadingMessage = document.getElementById("loadingMessage");
  const errorMessage = document.getElementById("errorMessage");

  let products = [];
  const fallbackImage = "https://via.placeholder.com/300x200?text=Pas+d'image";

  function createProductCard(product) {
    const name = product.product_name || "Nom inconnu";
    const categoryRaw = product.categories_tags ? product.categories_tags[0] : "";
    let category = "autres";

    if (categoryRaw.includes("proteine")) category = "proteines";
    else if (categoryRaw.includes("vitamine")) category = "vitamines";
    else if (categoryRaw.includes("complement")) category = "compléments";
    else if (categoryRaw.includes("accessoire")) category = "accessoires";

    const calories = product.nutriments?.energy_kcal_100g
      ? Math.round(product.nutriments.energy_kcal_100g)
      : 0;

    const imgSrc = product.image_front_small_url || fallbackImage;

    const div = document.createElement("div");
    div.className = "col-md-4 product-card";
    div.dataset.name = name.toLowerCase();
    div.dataset.category = category;
    div.dataset.calories = calories;

    div.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${imgSrc}" class="card-img-top" alt="${name}" onerror="this.src='${fallbackImage}'" />
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${name}</h5>
          <p class="card-text flex-grow-1">
            Catégorie : ${category.charAt(0).toUpperCase() + category.slice(1)}<br>
            Calories (100g) : ${calories} kcal
          </p>
          <a href="${product.url || '#'}" target="_blank" class="btn btn-primary mt-auto">Voir sur OpenFoodFacts</a>
        </div>
      </div>
    `;
    return div;
  }

  function filterProducts() {
    const searchText = searchInput.value.toLowerCase().trim();
    const categoryValue = categoryFilter.value;
    const calorieValue = calorieFilter.value;

    const cards = Array.from(productCatalog.children);

    cards.forEach(card => {
      const name = card.dataset.name;
      const category = card.dataset.category;
      const calories = parseInt(card.dataset.calories, 10);

      let show = true;

      if (searchText && !name.includes(searchText)) show = false;
      if (categoryValue !== "all" && category !== categoryValue) show = false;

      if (calorieValue !== "all") {
        if (calorieValue === "low" && calories >= 100) show = false;
        else if (calorieValue === "medium" && (calories < 100 || calories > 200)) show = false;
        else if (calorieValue === "high" && calories <= 200) show = false;
      }

      card.style.display = show ? "" : "none";
    });
  }

  async function loadProducts() {
    try {
      loadingMessage.style.display = "block";
      errorMessage.style.display = "none";

      const response = await fetch("https://world.openfoodfacts.org/category/sports-nutrition.json");

      if (!response.ok) throw new Error("Erreur HTTP " + response.status);

      const data = await response.json();

      if (!data.products || data.products.length === 0) throw new Error("Aucun produit trouvé");

      products = data.products.slice(0, 20); // Modifier si tu veux plus de produits

      productCatalog.innerHTML = "";

      products.forEach(product => {
        const card = createProductCard(product);
        productCatalog.appendChild(card);
      });

      loadingMessage.style.display = "none";
      filterProducts();
    } catch (error) {
      loadingMessage.style.display = "none";
      errorMessage.style.display = "block";
      console.error("Erreur chargement :", error);
    }
  }

  // Events
  searchInput.addEventListener("input", filterProducts);
  categoryFilter.addEventListener("change", filterProducts);
  calorieFilter.addEventListener("change", filterProducts);
  clearFiltersBtn.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "all";
    calorieFilter.value = "all";
    filterProducts();
  });

  loadProducts();
});
