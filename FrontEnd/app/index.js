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

// Gestion des filtres
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

// Mode édition
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
    ".modal-gallery-container",
  );

  btnBackForm.addEventListener("click", () => {
    modalForm.setAttribute("aria-hidden", "true");
    modalForm.style.display = "none";

    modalGalerie.setAttribute("aria-hidden", "false");
    modalGalerie.style.display = "flex";
  });

  function afficherOeuvresModal(oeuvres) {
    const modalGalleryContainer = document.querySelector(
      ".modal-gallery-container",
    );
    const galleryMain = document.querySelector(".gallery");

    modalGalleryContainer.innerHTML = "";

    oeuvres.forEach((oeuvre) => {
      const figure = document.createElement("figure");
      figure.classList.add("modal-figure");
      figure.dataset.id = oeuvre.id;

      const img = document.createElement("img");
      img.src = oeuvre.imageUrl;
      img.alt = oeuvre.title;

      const btnDelete = document.createElement("button");
      btnDelete.classList.add("btn-delete");
      btnDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

      // Listener suppression
      btnDelete.addEventListener("click", async (e) => {
        e.stopPropagation();
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
            },
          );
          if (!res.ok) throw new Error("Impossible de supprimer ce projet");

          // Retirer la figure de la modale
          figure.remove();

          // Retirer le même projet de la galerie principale
          const figureMain = galleryMain.querySelector(
            `figure img[src='${oeuvre.imageUrl}']`,
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

  // Fermer formulaire
  function closeForm() {
    modalForm.setAttribute("aria-hidden", "true");
    modalForm.style.display = "none";
  }

  btnCloseForm.addEventListener("click", closeForm);
  overlayForm.addEventListener("click", closeForm);

  // ÉTAPE 8.1 – AJOUT D'UN NOUVEAU PROJET

  // Sélection des éléments du formulaire
  const formAddWork = modalForm.querySelector("form");
  const inputImage = modalForm.querySelector("#photo");
  const previewImage = modalForm.querySelector("#preview-image");
  const inputTitle = modalForm.querySelector("#titre");
  const selectCategory = modalForm.querySelector("#categorie");
  const errorMessage = modalForm.querySelector(".error-message");

  // -------------------------------
  // Preview image
  // -------------------------------
  inputImage.addEventListener("change", () => {
    const file = inputImage.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      previewImage.style.display = "block";

      modalForm.querySelector(".fa-image").style.display = "none";
      modalForm.querySelector(".btn-upload").style.display = "none";
      modalForm.querySelector(".upload-info").style.display = "none";
    };
    reader.readAsDataURL(file);
  });

  // -------------------------------
  // Chargement dynamique catégories
  // -------------------------------
  function remplirSelectCategories() {
    selectCategory.innerHTML = "";

    const optionDefault = document.createElement("option");
    optionDefault.value = "";
    optionDefault.textContent = "";
    selectCategory.appendChild(optionDefault);

    categories.forEach((categorie) => {
      const option = document.createElement("option");
      option.value = categorie.id;
      option.textContent = categorie.name;
      selectCategory.appendChild(option);
    });
  }

  // Ouvrir formulaire depuis la galerie
  btnAddPhoto.addEventListener("click", () => {
    modalGalerie.setAttribute("aria-hidden", "true");
    modalGalerie.style.display = "none";

    modalForm.setAttribute("aria-hidden", "false");
    modalForm.style.display = "flex";

    remplirSelectCategories();
  });

  // -------------------------------
  // Envoi du formulaire (POST)
  // -------------------------------
  formAddWork.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMessage.textContent = "";
    errorMessage.style.display = "none";

    const image = inputImage.files[0];
    const title = inputTitle.value.trim();
    const category = selectCategory.value;
    const token = localStorage.getItem("token");

    // Validation
    if (!image || !title || !category) {
      errorMessage.textContent =
        "Veuillez renseigner tous les champs du formulaire.";
      errorMessage.style.display = "block";
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("title", title);
      formData.append("category", category);

      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l’envoi du projet");
      }

      const newWork = await response.json();

      // Mise à jour immédiate des galeries
      travaux.push(newWork);
      afficherOeuvres(travaux);
      afficherOeuvresModal(travaux);

      const btnValider = formAddWork.querySelector("button[type='submit']");
      btnValider.style.backgroundColor = "#1d6154";

      // Reset formulaire
      formAddWork.reset();
      previewImage.style.display = "none";
      errorMessage.textContent = "";
      errorMessage.style.display = "none";

      // Retour à la galerie
      modalForm.style.display = "none";
      modalForm.setAttribute("aria-hidden", "true");

      modalGalerie.style.display = "flex";
      modalGalerie.setAttribute("aria-hidden", "false");
    } catch (err) {
      console.error(err);
      errorMessage.textContent =
        "Une erreur est survenue lors de l’envoi du projet.";
    }
  });
}

// -------------------------------
// Initialisation
// -------------------------------
async function init() {
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
