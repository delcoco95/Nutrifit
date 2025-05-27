document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formProgramme");
  const resultContainer = document.getElementById("programmeResultat");
  const divAlim = document.getElementById("programmeAlimentaire");
  const divExo = document.getElementById("programmeExercices");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const morpho = document.getElementById("morphologie").value;
    const objectif = document.getElementById("objectif").value;

    const htmlAlim = genererProgrammeAlimentaire(morpho, objectif);
    const htmlExo = genererProgrammeExercices(objectif);

    divAlim.innerHTML = htmlAlim;
    divExo.innerHTML = htmlExo;

    resultContainer.classList.remove("hidden");
    resultContainer.classList.add("visible");
    resultContainer.scrollIntoView({ behavior: "smooth" });
  });
});

function genererProgrammeAlimentaire(morpho, objectif) {
  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const repasIcons = { petitDej: "\u2600\ufe0f", dejeuner: "\ud83c\udf7d\ufe0f", collation: "\ud83e\udd5b", diner: "\ud83c\udf19" };

  const menus = {
    masse: [
      { petitDej: "Omelette, pain complet, smoothie banane", dejeuner: "Pâtes, steak, salade", collation: "Shake protéiné, amandes", diner: "Riz complet, dinde, haricots verts" },
      { petitDej: "Flocons, œufs, banane", dejeuner: "Poulet, brocolis, quinoa", collation: "Yaourt grec, noix", diner: "Pâtes complètes, thon, courgettes" },
      { petitDej: "Fromage blanc, fruits secs, miel", dejeuner: "Riz, poisson blanc, légumes verts", collation: "Smoothie maison, noix", diner: "Patates douces, boeuf haché, épinards" }
    ],
    seche: [
      { petitDej: "Fromage blanc 0%, flocons, fraises", dejeuner: "Dinde, haricots verts, quinoa", collation: "Amandes, pomme", diner: "Omelette, salade verte" },
      { petitDej: "Œufs durs, pain complet, kiwi", dejeuner: "Filet de poisson, riz basmati, brocolis", collation: "Shake léger, noix", diner: "Soupe maison, blanc de poulet" },
      { petitDej: "Smoothie vert, flocons d'avoine", dejeuner: "Tofu, courgettes, patate douce", collation: "Yaourt 0%, fruits secs", diner: "Légumes grillés, steak 5%" }
    ]
  };

  const selectedMenus = menus[objectif];

  let html = `<div class="table-responsive">
  <table class="table table-bordered text-center align-middle">
    <thead class="table-success">
      <tr>
        <th>Jour</th>
        <th class="bg-warning-subtle">☀️<br>Petit-déjeuner</th>
        <th class="bg-primary-subtle">🍽️<br>Déjeuner</th>
        <th class="bg-info-subtle">🥤<br>Collation</th>
        <th class="bg-dark-subtle text-white">🌙<br>Dîner</th>
      </tr>
    </thead>
    <tbody>`;

  jours.forEach((jour, index) => {
    const v = selectedMenus[index % selectedMenus.length];
    html += `<tr>
      <td><strong>${jour}</strong></td>
      <td class="bg-warning-subtle">${repasIcons.petitDej} ${v.petitDej}</td>
      <td class="bg-primary-subtle text-white">🍽️ ${v.dejeuner}</td>
      <td class="bg-info-subtle">🥤 ${v.collation}</td>
      <td class="bg-dark-subtle text-white">🌙 ${v.diner}</td>
    </tr>`;
  });

  html += `</tbody></table></div>
  <p class="mt-3"><em>Conseil morphologie (${morpho}) :</em> adaptez les portions selon votre métabolisme.</p>`;
  return html;
}

function genererProgrammeExercices(objectif) {
  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

  const programmes = {
    masse: [
      { titre: "Pectoraux + triceps", details: "Développé couché, Écarté haltères, Dips, Extensions poulie" },
      { titre: "Dos + biceps", details: "Tractions, Rowing barre, Curl haltères, Curl marteau" },
      { titre: "Repos ou gainage", details: "Planche 3x30s, Crunchs, Étirements" },
      { titre: "Jambes complètes", details: "Squats, Presse à cuisses, Fentes, Soulevé de terre jambes tendues, Mollets" },
      { titre: "Épaules + abdos", details: "Développé militaire, Élévations latérales, Russian twist, Relevés de jambes" },
      { titre: "Full body + cardio modéré", details: "Circuit training 3 tours, rameur 15 min" },
      { titre: "Repos total", details: "-" }
    ],
    seche: [
      { titre: "HIIT + gainage", details: "Burpees, Mountain climbers, Planche, Crunchs" },
      { titre: "Cardio + jambes", details: "Corde à sauter 10 min, Fentes sautées, Squats, Mollets" },
      { titre: "Abdos + haut du corps", details: "Crunchs, Relevés jambes, Pompes, Rowing haltères" },
      { titre: "Repos actif", details: "Marche rapide 45 min, Étirements" },
      { titre: "Full body intensif", details: "Circuit training poids du corps (pompes, squats, planche)" },
      { titre: "Circuit training", details: "4 exercices enchaînés x4 (burpees, squats, planche, dips)" },
      { titre: "Repos total", details: "-" }
    ]
  };

  const joursHtml = jours.map((jour, i) => {
    const prog = programmes[objectif][i];
    return `<tr>
      <td><strong>${jour}</strong></td>
      <td><strong>${prog.titre}</strong><br><small>${prog.details}</small></td>
    </tr>`;
  }).join("");

  return `<div class="table-responsive">
    <table class="table table-bordered">
      <thead class="table-secondary">
        <tr>
          <th>Jour</th>
          <th>Entraînement</th>
        </tr>
      </thead>
      <tbody>${joursHtml}</tbody>
    </table>
    <p class="mt-3 text-center text-success fw-bold">💪 Reste concentré, chaque jour compte pour atteindre ton objectif !</p>
  </div>`;
}