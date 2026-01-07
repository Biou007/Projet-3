let travaux = [];
let categories = [];

// -------------------------------
// API - récupération des données
// -------------------------------

async function recupererOeuvres() {
  try {
    const reponse = await fetch("http://localhost:5678/api/works");
    if (!reponse.ok)
      throw new Error("Erreur lors de la récupération des œuvres");
    return await reponse.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function recupererCategories() {
  try {
    const reponse = await fetch("http://localhost:5678/api/categories");
    if (!reponse.ok)
      throw new Error("Erreur lors de la récupération des catégories");
    return await reponse.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// -------------------------------
// Affichage des œuvres et filtres
// -------------------------------

function afficherOeuvres(oeuvres) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  oeuvres.forEach((oeuvre) => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = oeuvre.imageUrl;
    img.alt = oeuvre.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = oeuvre.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

async function afficherFiltres(categories) {
  const sectionFiltres = document.querySelector(".filtres");
  sectionFiltres.innerHTML = "";

  // Bouton "Tous"
  const btnTous = document.createElement("button");
  btnTous.textContent = "Tous";
  btnTous.classList.add("active", "all-filter");
  btnTous.dataset.id = "all"; // data-id pour fiabilité
  sectionFiltres.appendChild(btnTous);

  // Boutons par catégorie
  categories.forEach((categorie) => {
    const bouton = document.createElement("button");
    bouton.textContent = categorie.name;
    bouton.dataset.id = categorie.id;
    sectionFiltres.appendChild(bouton);
  });
}

// -------------------------------
// Gestion des filtres
// -------------------------------

function activerBouton(boutonActif) {
  const boutons = document.querySelectorAll(".filtres button");
  boutons.forEach((btn) => btn.classList.remove("active"));
  boutonActif.classList.add("active");
}

function gestionChoixFiltres() {
  const filtreBoutons = document.querySelectorAll(".filtres button");

  filtreBoutons.forEach((bouton) => {
    bouton.addEventListener("click", () => {
      const categoryIdSelected = bouton.dataset.id;

      const travauxFiltres = travaux.filter((oeuvre) => {
        if (categoryIdSelected === "all") return true;
        return parseInt(oeuvre.categoryId) === parseInt(categoryIdSelected);
      });

      afficherOeuvres(travauxFiltres);
      activerBouton(bouton);
    });
  });
}
function activerModeEdition() {
  const token = localStorage.getItem("token");
  if (!token) return; // si pas connecté, on sort

  // 1️⃣ Afficher le bandeau noir
  const bandeau = document.querySelector(".bandeau-edition");
  if (bandeau) bandeau.style.display = "flex";

  // 2️⃣ Remplacer "login" par "logout"
  const loginLink = document.querySelector('nav a[href="login.html"]');
  if (loginLink) {
    loginLink.textContent = "logout";
    loginLink.href = "#";

    // 3️⃣ Déconnexion
    loginLink.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("token"); // supprime le token
      window.location.reload(); // recharge la page
    });
  }

  // 4️⃣ Cacher les filtres
  const filtres = document.querySelector(".filtres");
  if (filtres) {
    filtres.style.display = "none";
    filtres.style.pointerEvents = "none"; // désactive clic
  }

  // 5️⃣ Afficher le bouton "Modifier"
  const editProjects = document.querySelector(".edit-projects");
  if (editProjects) editProjects.style.display = "block";
}

// -------------------------------
// Initialisation
// -------------------------------

async function init() {
  travaux = await recupererOeuvres();
  afficherOeuvres(travaux);

  categories = await recupererCategories();
  await afficherFiltres(categories);

  gestionChoixFiltres();
  activerModeEdition();
}

// Lancement
init();
