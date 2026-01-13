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
// Affichage des œuvres sur la page
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

// -------------------------------
// Affichage des filtres
// -------------------------------
function afficherFiltres(categories) {
  const sectionFiltres = document.querySelector(".filtres");
  sectionFiltres.innerHTML = "";

  const btnTous = document.createElement("button");
  btnTous.textContent = "Tous";
  btnTous.classList.add("active");
  btnTous.dataset.id = "all";
  sectionFiltres.appendChild(btnTous);

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

// -------------------------------
// Mode édition
// -------------------------------
function activerModeEdition() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const bandeau = document.querySelector(".bandeau-edition");
  if (bandeau) bandeau.style.display = "flex";

  const loginLink = document.querySelector('nav a[href="login.html"]');
  if (loginLink) {
    loginLink.textContent = "logout";
    loginLink.href = "#";
    loginLink.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("token");
      window.location.reload();
    });
  }

  const filtres = document.querySelector(".filtres");
  if (filtres) {
    filtres.style.display = "none";
    filtres.style.pointerEvents = "none";
  }

  const editProjects = document.querySelector(".edit-projects");
  if (editProjects) editProjects.style.display = "block";
}

function resetModales() {
  const modalGalerie = document.querySelector(".modal-gallery");
  const modalForm = document.querySelector(".modal-form");

  if (modalGalerie) {
    modalGalerie.style.display = "none";
    modalGalerie.setAttribute("aria-hidden", "true");
  }

  if (modalForm) {
    modalForm.style.display = "none";
    modalForm.setAttribute("aria-hidden", "true");
  }
}

// -------------------------------
// Modales Galerie & Formulaire
// -------------------------------
function initModales() {
  // Sélection des modales
  const modalGalerie = document.querySelector(".modal-gallery");
  const modalForm = document.querySelector(".modal-form");

  // Overlay et boutons
  const overlayGalerie = modalGalerie.querySelector(".overlay");
  const overlayForm = modalForm.querySelector(".overlay");

  const btnCloseGalerie = modalGalerie.querySelector(".btnClose");
  const btnCloseForm = modalForm.querySelector(".btnClose");
  const btnBackForm = modalForm.querySelector(".btnBack");
  const btnAddPhoto = modalGalerie.querySelector(".btnAddPhoto");
  const modalGalleryContainer = modalGalerie.querySelector(
    ".modal-gallery-container"
  );

  function afficherOeuvresModal(oeuvres) {
    const modalGalleryContainer = document.querySelector(
      ".modal-gallery-container"
    );
    const galleryMain = document.querySelector(".gallery");

    modalGalleryContainer.innerHTML = "";

    oeuvres.forEach((oeuvre) => {
      const figure = document.createElement("figure");
      figure.classList.add("modal-figure");
      figure.dataset.id = oeuvre.id; // stocker l'id

      const img = document.createElement("img");
      img.src = oeuvre.imageUrl;
      img.alt = oeuvre.title;

      const btnDelete = document.createElement("button");
      btnDelete.classList.add("btn-delete");
      btnDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

      // Listener suppression
      btnDelete.addEventListener("click", async (e) => {
        e.stopPropagation(); // éviter les clics sur la figure
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
          const res = await fetch(
            `http://localhost:5678/api/works/${oeuvre.id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!res.ok) throw new Error("Impossible de supprimer ce projet");

          // Retirer la figure de la modale
          figure.remove();

          // Retirer le même projet de la galerie principale
          const figureMain = galleryMain.querySelector(
            `figure img[src='${oeuvre.imageUrl}']`
          )?.parentElement;
          if (figureMain) figureMain.remove();

          // Supprimer du tableau travaux
          travaux = travaux.filter((t) => t.id !== oeuvre.id);
        } catch (err) {
          console.error(err);
          alert("Erreur lors de la suppression du projet.");
        }
      });

      figure.appendChild(img);
      figure.appendChild(btnDelete);
      modalGalleryContainer.appendChild(figure);
    });
  }

  // Ouvrir galerie
  const btnEditProjects = document.querySelector(".edit-projects");
  btnEditProjects.addEventListener("click", () => {
    modalGalerie.setAttribute("aria-hidden", "false");
    modalGalerie.style.display = "flex";
    afficherOeuvresModal(travaux);
  });

  // Fermer modale galerie
  function closeGalerie() {
    modalGalerie.setAttribute("aria-hidden", "true");
    modalGalerie.style.display = "none";
  }

  btnCloseGalerie.addEventListener("click", closeGalerie);
  overlayGalerie.addEventListener("click", closeGalerie);

  // Ouvrir formulaire depuis galerie
  btnAddPhoto.addEventListener("click", () => {
    modalGalerie.setAttribute("aria-hidden", "true");
    modalGalerie.style.display = "none";

    modalForm.setAttribute("aria-hidden", "false");
    modalForm.style.display = "flex";
  });

  // Retour à la galerie depuis le formulaire
  btnBackForm.addEventListener("click", () => {
    modalForm.setAttribute("aria-hidden", "true");
    modalForm.style.display = "none";

    modalGalerie.setAttribute("aria-hidden", "false");
    modalGalerie.style.display = "flex";
  });

  // Fermer formulaire
  function closeForm() {
    modalForm.setAttribute("aria-hidden", "true");
    modalForm.style.display = "none";
  }

  btnCloseForm.addEventListener("click", closeForm);
  overlayForm.addEventListener("click", closeForm);
}

// -------------------------------
// Initialisation
// -------------------------------
async function init() {
  // Toujours repartir d’un état propre
  resetModales();

  travaux = await recupererOeuvres();
  afficherOeuvres(travaux);

  categories = await recupererCategories();
  afficherFiltres(categories);
  gestionChoixFiltres();
  activerModeEdition();

  // Modales UNIQUEMENT si connecté
  const token = localStorage.getItem("token");
  if (token) {
    initModales();
  }
}

init();
