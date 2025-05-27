document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formProgramme");
  const resultContainer = document.getElementById("programmeResultat");
  const detailDiv = document.getElementById("programmeDetail");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const taille = parseInt(document.getElementById("taille").value);
    const poids = parseInt(document.getElementById("poids").value);
    const age = parseInt(document.getElementById("age").value);
    const morpho = document.getElementById("morphologie").value;
    const objectif = document.getElementById("objectif").value;

    const programme = genererProgramme({ taille, poids, age, morpho, objectif });

    detailDiv.innerHTML = programme;
    resultContainer.classList.remove("hidden");
    resultContainer.classList.add("visible");
    resultContainer.scrollIntoView({ behavior: "smooth" });
  });
});

function genererProgramme({ taille, poids, age, morpho, objectif }) {
  if (objectif === "masse") {
    return `
      <h5>Programme : Prise de Masse</h5>
      <ul>
        <li><strong>Petit-déjeuner :</strong> Flocons d'avoine, œufs, banane, lait entier</li>
        <li><strong>Déjeuner :</strong> Riz complet, blanc de poulet, légumes verts</li>
        <li><strong>Collation :</strong> Shake protéiné, amandes, fruits secs</li>
        <li><strong>Dîner :</strong> Pâtes complètes, steak haché 5%, salade composée</li>
      </ul>
      <p><em>Conseil morphologie (${morpho}) :</em> Adaptez les quantités selon votre métabolisme.</p>
    `;
  } else if (objectif === "seche") {
    return `
      <h5>Programme : Sèche</h5>
      <ul>
        <li><strong>Petit-déjeuner :</strong> Fromage blanc 0%, flocons d’avoine, fruits rouges</li>
        <li><strong>Déjeuner :</strong> Filet de dinde, brocolis vapeur, quinoa</li>
        <li><strong>Collation :</strong> Yaourt nature, quelques amandes</li>
        <li><strong>Dîner :</strong> Omelette blanche, épinards, légumes verts</li>
      </ul>
      <p><em>Conseil morphologie (${morpho}) :</em> Priorisez les aliments à faible index glycémique.</p>
    `;
  } else {
    return `<p class="text-danger">Objectif inconnu. Veuillez réessayer.</p>`;
  }
}
