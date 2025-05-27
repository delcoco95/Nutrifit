document.addEventListener("DOMContentLoaded", chargerProduitsVedettes);

function chargerProduitsVedettes() {
    // URL du produit spécifique avec authentification
    fetch("https://world.openfoodfacts.org/api/v2/search?fields=product_name,nutriments,image_front_url&language=fr&page_size=5", {
        method: 'GET',
        headers: { Authorization: 'Basic ' + btoa('off:off') },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Données API :", data);
        afficherProduitVedette(data.product);
    })
    .catch(error => console.error("Erreur API :", error));
}

function afficherProduitVedette(produit) {
    const zoneProduits = document.getElementById("produitsVedettes");
    zoneProduits.innerHTML = ""; // On vide la section avant d'ajouter les produits

    if (!produit) {
        zoneProduits.innerHTML = "<p class='text-center'>Aucun produit trouvé.</p>";
        return;
    }

    const imageSrc = produit.image_front_url ? produit.image_front_url : "img/placeholder.png";
    const div = document.createElement("div");
    div.className = "col-md-4";
    div.innerHTML = `
        <div class="card">
            <img src="${imageSrc}" class="card-img-top" alt="Image du produit">
            <div class="card-body">
                <h5 class="card-title">${produit.product_name || 'Nom inconnu'}</h5>
                <p class="card-text">
                    Protéines : ${produit.nutriments?.proteins_100g || '-'} g | 
                    Calories : ${produit.nutriments?.['energy-kcal_100g'] || '-'} kcal
                </p>
                <a href="#" class="btn btn-primary">En savoir plus</a>
            </div>
        </div>
    `;
    zoneProduits.appendChild(div);
}
